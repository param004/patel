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
  default: "Param Pambhar, Full-Stack-Entwickler für 3D-Produkterlebnisse",
    template: "%s, Param Pambhar",
  },
  description:
    "Full-Stack-Entwickler mit React, Node und Echtzeit-3D im Browser. Fünf veröffentlichte Projekte, vom Redux-Fragenportal bis zum interaktiven WebGL-Produktviewer.",
  openGraph: {
    type: "website",
    title: "Param Pambhar",
    description:
      "Full-Stack-Entwickler für 3D-Produkterlebnisse mit React, Node und WebGL.",
    siteName: "Param Pambhar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Param Pambhar",
    description:
      "Full-Stack-Entwickler für 3D-Produkterlebnisse mit React, Node und WebGL.",
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
      lang="de"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}