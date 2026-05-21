import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { put } from "@vercel/blob"
import { checkRateLimit } from "@/lib/ratelimit"

const BALLOON_PROMPT = `Transform this image into balloonmorphism style.

Balloonmorphism is a design aesthetic where every element looks like it's been sculpted from inflated, glossy latex balloons. Apply these visual properties:

- Puffy, pressure-filled, inflated surfaces — everything bulges outward slightly
- Glossy sheen with a bright white highlight streak across the top-left of each form
- Smooth, rounded, pillow-like contours — no hard edges
- Colors become slightly more saturated and vibrant than the original
- Soft drop shadow underneath the subject
- The subject looks like it was blown up from the inside — like a balloon animal but refined

Critical: preserve the original subject, shape, logo, character, or icon as faithfully as possible. Only the surface material and texture changes — the identity stays. Output a clean centered illustration on a soft neutral gradient background (light lavender or soft white). No background clutter.`

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"

  const { allowed, resetIn } = checkRateLimit(ip)

  if (!allowed) {
    const hours = Math.floor(resetIn / (1000 * 60 * 60))
    const minutes = Math.ceil((resetIn % (1000 * 60 * 60)) / (1000 * 60))
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `you've used your 2 generations for this window. try again in ${hours}h ${minutes}m.`,
        resetIn,
      },
      { status: 429 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "invalid_form_data" }, { status: 400 })
  }

  const file = formData.get("image") as File | null
  if (!file) {
    return NextResponse.json({ error: "no_image" }, { status: 400 })
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "unsupported_format", message: "use PNG, JPG, or WEBP" }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "file_too_large", message: "max file size is 5MB" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString("base64")
  const mimeType = file.type

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
  })

  let result
  try {
    result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: base64 } },
            { text: BALLOON_PROMPT },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      } as never,
    })
  } catch (err) {
    console.error("Gemini error:", err)
    return NextResponse.json({ error: "generation_failed", message: "gemini could not process this image" }, { status: 500 })
  }

  const parts = result.response.candidates?.[0]?.content?.parts
  const imagePart = parts?.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data)

  if (!imagePart?.inlineData?.data) {
    return NextResponse.json({ error: "no_image_output", message: "generation returned no image" }, { status: 500 })
  }

  const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64")
  const outputMime = imagePart.inlineData.mimeType ?? "image/png"
  const ext = outputMime.includes("png") ? "png" : outputMime.includes("webp") ? "webp" : "jpg"

  let imageUrl: string

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(
      `gen/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`,
      imageBuffer,
      { access: "public", contentType: outputMime }
    )
    imageUrl = blob.url
  } else {
    imageUrl = `data:${outputMime};base64,${imagePart.inlineData.data}`
  }

  return NextResponse.json({ url: imageUrl })
}
