// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const metadata: Metadata = {
  title: "アスレッチクス(ホワイトリーグ)のホームページ",
  description: "福岡市を中心に活動している草野球チームです",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 Next.js 14.3+ では cookies() が Promise
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // セッションをサーバーで読み込む
  await supabase.auth.getSession();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <header className="flex flex-col items-center bg-white shadow-md">
          <div className="mt-4">
            <Image src="/img/logo.png" alt="チームロゴ" width={100} height={60} priority />
          </div>

          <nav className="flex justify-center gap-30 py-4">
            <NavItem href="/" title="トップページ" eng="TOPPAGE" />
            <NavItem href="/players" title="選手紹介" eng="PLAYER" />
            <NavItem href="/games" title="試合結果" eng="GAMEDATE" />
            <NavItem href="/results" title="個人成績" eng="RESULTS" />
            <NavItem href="/admin" title="管理者ページ" eng="ADMIN" />
          </nav>
        </header>

        <main>{children}</main>

        <footer className="text-center text-sm text-gray-400 py-6">
          © 2025 草野球チーム All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}

function NavItem({ href, title, eng }: { href: string; title: string; eng: string }) {
  return (
    <Link href={href} className="text-center group">
      <span className="block text-lg font-bold text-gray-800 group-hover:text-blue-600">{title}</span>
      <span className="block text-xs text-gray-500 tracking-widest">{eng}</span>
    </Link>
  );
}
