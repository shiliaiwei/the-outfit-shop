import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono, Kantumruy_Pro, Caveat, Playfair_Display, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const khmerFont = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
  preload: false,
});

const caveatFont = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-handwriting",
  display: "swap",
  preload: false,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-serif-luxury",
  display: "swap",
  preload: false,
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["900"],
  style: ["normal"],
  variable: "--font-runiga",
  display: "swap",
  preload: false,
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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
