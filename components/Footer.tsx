export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--void-05)",
        padding: "20px clamp(24px, 6vw, 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--ink-primary)",
          }}
        >
          balloon.
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "var(--ink-tertiary)",
          }}
        >
          a tool by{" "}
          <a
            href="https://mojeeb.xyz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Mojeeb Titilayo
          </a>{" "}
          /{" "}
          <a
            href="https://blindspotlab.xyz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink-secondary)", textDecoration: "none" }}
          >
            BlindspotLab
          </a>
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.06em",
          color: "var(--ink-tertiary)",
        }}
      >
        © 2026 BlindspotLab
      </span>
    </footer>
  )
}
