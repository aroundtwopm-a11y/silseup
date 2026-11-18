import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "맞춤 요금제 추천",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={notoSansKr.className}>
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-390 flex-col bg-bg-default">{children}</div>
      </body>
    </html>
  );
}
