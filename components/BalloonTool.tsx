"use client"

import { useState, useRef, useCallback } from "react"

type Stage = "idle" | "uploaded" | "generating" | "done"

interface GenerateResult {
  url: string
}

function formatResetTime(ms: number) {
  const h = Math.floor(ms / (1000 * 60 * 60))
  const m = Math.ceil((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${h}h ${m}m`
}

export function BalloonTool() {
  const [stage, setStage] = useState<Stage>("idle")
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resetIn, setResetIn] = useState<number>(0)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)) {
      setError("unsupported format — use PNG, JPG, or WEBP")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("file too large — max 5MB")
      return
    }
    setError(null)
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
    setStage("uploaded")
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleGenerate = async () => {
    if (!file) return
    setStage("generating")
    setError(null)

    const fd = new FormData()
    fd.append("image", file)

    try {
      const res = await fetch("/api/generate", { method: "POST", body: fd })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setResetIn(data.resetIn ?? 0)
          setError(data.message ?? "rate limited")
        } else {
          setError(data.message ?? "something went wrong")
        }
        setStage("uploaded")
        return
      }

      const r = data as GenerateResult
      setResult(r.url)
      setStage("done")
    } catch {
      setError("network error — try again")
      setStage("uploaded")
    }
  }

  const handleReset = () => {
    setStage("idle")
    setPreview(null)
    setFile(null)
    setResult(null)
    setError(null)
  }

  const handleDownload = async () => {
    if (!result) return
    try {
      const res = await fetch(result)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "ballooned.png"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(result, "_blank")
    }
  }

  const handleShareToX = () => {
    if (!result) return
    const resultUrl = result.startsWith("data:")
      ? "https://balloon.blindspotlab.xyz"
      : `https://balloon.blindspotlab.xyz/result?img=${encodeURIComponent(result)}`
    const text = encodeURIComponent("just ballooned my logo 🎈 try it →")
    window.open(`https://x.com/intent/post?text=${text}&url=${encodeURIComponent(resultUrl)}`, "_blank")
  }

  return (
    <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
      {stage === "idle" && (
        <div
          onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--void-05)"}`,
            borderRadius: "16px",
            background: dragging ? "color-mix(in srgb, var(--accent) 5%, var(--void-02))" : "var(--void-02)",
            padding: "clamp(48px, 8vw, 80px) 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.2s var(--ease-out)",
            userSelect: "none",
          }}
        >
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--void-03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            transition: "transform 0.2s var(--ease-out)",
            transform: dragging ? "scale(1.1)" : "scale(1)",
          }}>
            🎈
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--ink-secondary)",
              marginBottom: "6px",
            }}>
              drop your logo or pfp here
            </p>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--ink-tertiary)",
            }}>
              PNG · JPG · WEBP · max 5MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      )}

      {(stage === "uploaded" || stage === "generating") && preview && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{
            border: "1px solid var(--void-05)",
            borderRadius: "16px",
            background: "var(--void-02)",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
            <img
              src={preview}
              alt="uploaded"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                borderRadius: "10px",
                background: "var(--void-03)",
                padding: "8px",
                flexShrink: 0,
              }}
            />
            <div>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-tertiary)",
                marginBottom: "4px",
              }}>
                ready to balloon
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--ink-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}>
                {file?.name}
              </p>
            </div>
            {stage !== "generating" && (
              <button
                onClick={handleReset}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "var(--ink-tertiary)",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                }}
              >
                ×
              </button>
            )}
          </div>

          {error && (
            <div style={{
              background: "color-mix(in srgb, #ff4444 8%, var(--void-02))",
              border: "1px solid color-mix(in srgb, #ff4444 25%, transparent)",
              borderRadius: "10px",
              padding: "14px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "#ff8888",
              letterSpacing: "0.04em",
            }}>
              {error}
              {resetIn > 0 && (
                <span style={{ display: "block", marginTop: "4px", color: "var(--ink-tertiary)" }}>
                  come back in {formatResetTime(resetIn)}
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={stage === "generating"}
            style={{
              background: stage === "generating" ? "var(--void-04)" : "var(--accent)",
              color: stage === "generating" ? "var(--ink-tertiary)" : "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "16px 32px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: stage === "generating" ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s var(--ease-out)",
              width: "100%",
            }}
          >
            {stage === "generating" ? (
              <>
                <SpinnerIcon />
                inflating your logo…
              </>
            ) : (
              "balloon it 🎈"
            )}
          </button>
        </div>
      )}

      {stage === "done" && preview && result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}>
            <div style={{
              border: "1px solid var(--void-05)",
              borderRadius: "14px",
              background: "var(--void-02)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--void-05)",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink-tertiary)",
                }}>
                  original
                </span>
              </div>
              <div style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "180px",
                background: "#f5f5f0",
              }}>
                <img src={preview} alt="original" style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "contain" }} />
              </div>
            </div>

            <div style={{
              border: "1px solid var(--accent-border)",
              borderRadius: "14px",
              background: "var(--void-02)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{ fontSize: "12px" }}>🎈</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}>
                  ballooned
                </span>
              </div>
              <div style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "180px",
                background: "#f5f5f0",
              }}>
                <img src={result} alt="ballooned" style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "contain" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleDownload}
              style={{
                flex: 1,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 20px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ↓ download
            </button>

            <button
              onClick={handleShareToX}
              style={{
                flex: 1,
                background: "var(--void-03)",
                color: "var(--ink-secondary)",
                border: "1px solid var(--void-05)",
                borderRadius: "10px",
                padding: "14px 20px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ink-tertiary)"
                e.currentTarget.style.color = "var(--ink-primary)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--void-05)"
                e.currentTarget.style.color = "var(--ink-secondary)"
              }}
            >
              <XIcon />
              share
            </button>
          </div>

          <button
            onClick={handleReset}
            style={{
              background: "none",
              border: "none",
              color: "var(--ink-tertiary)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-tertiary)")}
          >
            try another →
          </button>
        </div>
      )}
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 14" strokeLinecap="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z" fill="currentColor" />
    </svg>
  )
}
