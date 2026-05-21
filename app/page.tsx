import { BalloonTool } from "@/components/BalloonTool"
import { Footer } from "@/components/Footer"

export default function Home() {
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
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-tertiary)",
        }}>
          balloonmorphism generator
        </span>
      </nav>

      <main style={{
        flex: 1,
        paddingTop: "calc(var(--nav-height) + clamp(48px, 8vw, 96px))",
        paddingBottom: "clamp(64px, 10vw, 120px)",
      }}>
        <section style={{
          textAlign: "center",
          marginBottom: "clamp(48px, 7vw, 72px)",
          padding: "0 clamp(24px, 6vw, 80px)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "16px",
          }}>
            the trend, weaponized. 🎈
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--ink-primary)",
            marginBottom: "20px",
          }}>
            make your logo float.
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(15px, 2vw, 18px)",
            fontWeight: 300,
            color: "var(--ink-secondary)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            drop your brand logo or pfp — get it back in{" "}
            <span style={{ color: "var(--ink-primary)", fontWeight: 500 }}>balloonmorphism style</span>.
            free. no signup.
          </p>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--ink-tertiary)",
            marginTop: "12px",
          }}>
            2 generations per 5 hours
          </p>
        </section>

        <BalloonTool />
      </main>

      <Footer />
    </div>
  )
}
