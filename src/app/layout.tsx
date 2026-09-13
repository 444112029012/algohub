import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "演算法研究室｜研究所常考演算法",
    template: "%s｜演算法研究室",
  },
  description:
    "針對資訊研究所考試整理的演算法教材：介紹、複雜度、手算步驟、虛擬碼、Python / C++ / TypeScript，以及可逐步播放的示意動畫。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${sans.variable} ${serif.variable} ${mono.variable} min-h-screen font-sans antialiased`}
      >
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
