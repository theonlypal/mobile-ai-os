import type { Metadata } from "next";
import "../styles/globals.css";
import { ShellProvider } from "../ui/ShellProvider";

export const metadata: Metadata = {
  title: "Mobile AI OS",
  description: "An AI layer for your phone, built as a PWA.",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0b1220" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="workspace-personal">
        <ShellProvider>{children}</ShellProvider>
      </body>
    </html>
  );
}
