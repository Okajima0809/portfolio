"use client";

import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        管理者ダッシュボード
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

        {/* 選手登録 */}
        <DashboardCard
          title="選手登録"
          description="新しい選手を登録します"
          href="/admin/users/new"
        />

        {/* 試合結果 */}
        <DashboardCard
          title="試合結果登録"
          description="試合結果を入力し記録します"
          href="/admin/games/new"
        />

        {/* 打撃成績 */}
        <DashboardCard
          title="打撃成績登録"
          description="打撃データを入力します"
          href="/admin/batter/new"
        />

        {/* 投手成績 */}
        <DashboardCard
          title="投手成績登録"
          description="投手成績を入力します"
          href="/admin/pitcher/new"
        />
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ログアウト
        </button>
      </div>
    </main>
  );
}

/* -----------------------------------------
   カードコンポーネント
------------------------------------------ */
function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </Link>
  );
}
