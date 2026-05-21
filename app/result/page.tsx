import type { Metadata } from "next"
import { Footer } from "@/components/Footer"

interface Props {
  searchParams: Promise<{ img?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { img } = await searchParams

  return {
    title: "i ballooned my logo 🎈 — balloon.blindspotlab.xyz",
    description: "Drop your brand logo or pfp. Get it in balloonmorphism — the hottest design trend on X right now.",
    openGraph: {
      title: "i ballooned my logo 🎈",
      description: "Try it free → balloon.blindspotlab.xyz",
      images: img
        ? [{ url: img, width: 1024, height: 1024, alt: "Ballooned logo" }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: "i ballooned my logo 🎈",
      description: "Try it free → balloon.blindspotlab.xyz",
      creator: "@mojeebeth",
      images: img ? [img] : [],
    },
  }
}

export default async function ResultPage({ searchParams }: Props) {
  const { img } = await searchParams

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "var(--nav-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(24px, 6vw, 80px)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "color-mix(in srgb, var(--void-01) 70%, transparent)",
        borderBottom: "1px solid var(--void-05)",
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--ink-primary)",
        }}>
          balloon.
        </span>
        <a
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
          }}
        >
          try yours →
        </a>
      </nav>

      <main style={{
        flex: 1,
        paddingTop: "calc(var(--nav-height) + clamp(48px, 8vw, 96px))",
        paddingBottom: "clamp(64px, 10vw, 120px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "calc(var(--nav-height) + 64px) 24px 80px",
        gap: "32px",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "12px",
          }}>
            ballooned 🎈
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--ink-primary)",
          }}>
            floating in the void.
          </h1>
        </div>

        {img ? (
          <div style={{
            border: "1px solid var(--accent-border)",
            borderRadius: "20px",
            background: "var(--void-02)",
            overflow: "hidden",
            maxWidth: "480px",
            width: "100%",
          }}>
            <div style={{
              padding: "12px 18px",
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
                your ballooned result
              </span>
            </div>
            <div style={{
              padding: "32px",
              background: "#f5f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}>
              <img
                src={img}
                alt="Ballooned result"
                style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
          </div>
        ) : (
          <div style={{
            border: "1px solid var(--void-05)",
            borderRadius: "14px",
            background: "var(--void-02)",
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: "380px",
            width: "100%",
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "var(--ink-tertiary)",
            }}>
              no image found in this link.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--ink-secondary)",
          }}>
            want yours?
          </p>
          <a
            href="/"
            style={{
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "10px",
              padding: "14px 32px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            balloon it free →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
