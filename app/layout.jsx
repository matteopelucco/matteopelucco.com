import "./globals.css";

export const metadata = {
  title: "matteo pelucco — in costruzione",
  description: "matteopelucco.com — sito in costruzione, coming soon.",
  metadataBase: new URL("https://matteopelucco.com"),
  openGraph: {
    title: "matteo pelucco",
    description: "Sito in costruzione — coming soon.",
    url: "https://matteopelucco.com",
    siteName: "matteo pelucco",
    locale: "it_IT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#050608",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
