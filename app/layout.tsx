import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "balloon. — make your logo float",
  description: "Drop your brand logo or pfp. Get it in balloonmorphism — the hottest design trend on X right now. Free.",
  metadataBase: new URL("https://balloon.blindspotlab.xyz"),
  openGraph: {
    title: "balloon. — make your logo float",
    description: "Drop your brand logo or pfp. Get it in balloonmorphism. Free.",
    url: "https://balloon.blindspotlab.xyz",
    siteName: "balloon.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "balloon. — make your logo float",
    description: "Drop your brand logo or pfp. Get it in balloonmorphism. Free.",
    creator: "@mojeebeth",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
