import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono, Kantumruy_Pro, Caveat, Playfair_Display, Bodoni_Moda } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const khmerFont = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khmer",
});

const caveatFont = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-handwriting",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-serif-luxury",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["900"],
  style: ["normal"],
  variable: "--font-runiga",
});

export const metadata: Metadata = {
  title: "OUTFIT SHOP",
  description: "Official OUTFIT SHOP. Contemporary quiet luxury tailoring, Normandy flax overshirts, and ready-to-wear essentials.",
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/brand/logo.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfitFont.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${khmerFont.variable} ${caveatFont.variable} ${playfairDisplay.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#C84428] selection:text-white">
        {children}
      </body>
    </html>
  );
}
