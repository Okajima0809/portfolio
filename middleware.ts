// middleware.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  // セッション取得
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  const url = req.nextUrl;

  // ------------------------------
  // 🔒 未ログイン → /login に強制移動
  // ------------------------------
  if (!session && url.pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }


  if (session && url.pathname === "/login") {
    const redirectUrl = new URL("/admin", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
