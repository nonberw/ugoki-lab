import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["500", "700"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ugoki-lab.vercel.app"),
  title: "Ugoki Lab · open physical AI",
  description:
    "A non-profit research lab building affordable humanoid robots and an open model that designs real hardware. Free for anyone to use.",
  openGraph: {
    title: "Ugoki Lab · open physical AI",
    description: "Affordable humanoids and an open engineering model, built in the open.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efeeec" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

// Sets the theme class before first paint, so a dark-mode visitor never sees a light flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-[100dvh] bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
