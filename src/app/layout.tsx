import type React from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://param004.github.io"),
  title: {
    default: "Param Pambhar, full-stack developer building 3D product experiences",
    template: "%s, Param Pambhar",
  },
  description:
    "Full-stack developer working across React, Node and real-time 3D in the browser. Five shipped projects, from a Redux Q&A client to an interactive WebGL product viewer.",
  openGraph: {
    type: "website",
    title: "Param Pambhar",
    description:
      "Full-stack developer building 3D product experiences with React, Node and WebGL.",
    siteName: "Param Pambhar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Param Pambhar",
    description:
      "Full-stack developer building 3D product experiences with React, Node and WebGL.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}