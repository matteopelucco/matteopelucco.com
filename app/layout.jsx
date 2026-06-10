import "./globals.css";
import CONFIG from "./config";

export const metadata = {
  title: CONFIG.pageTitle,
  description: CONFIG.pageDescription,
  metadataBase: new URL("https://matteopelucco.com"),
  openGraph: {
    title: CONFIG.name.toLowerCase(),
    description: CONFIG.pageDescription,
    url: "https://matteopelucco.com",
    siteName: CONFIG.name.toLowerCase(),
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
