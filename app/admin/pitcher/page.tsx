"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function PitcherStatsList() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("pitcher_stats")
        .select(`
          id,
          user_id,
          game_id,
          appearances,
          starts,
          relieves,
          innings_pitched,
          earned_runs,
          strikeouts,
          win,
          loss,
          save,
          era,
          users:users!pitcher_stats_user_id_fkey (
            username,
            number,
            category
          ),
          games:games!pitcher_stats_game_id_fkey (
            opponent,
            date
          )
        `)
        .order("created_at", { ascending: false });

      if (!error) setStats(data || []);
    };

    fetchStats();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase
      .from("pitcher_stats")
      .delete()
      .eq("id", id);

    if (error) {
      alert("削除に失敗しました：" + error.message);
      return;
    }

    alert("削除しました");
    location.reload();
  };

  return (
    <main className="p-8 bg-gray-100 min-h-screen text-gray-900">
      {/* 上部タイトル + 新規登録ボタン */}
      <div className="justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">投手成績一覧</h1>

        <Link
          href="/admin/pitcher/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 items-center gap-2"
        >
          + 新規登録
        </Link>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          {/* テーブルヘッダー */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-3 text-center">選手</th>
              <th className="p-3 text-center">試合</th>
              <th className="p-3 text-center">登板</th>
              <th className="p-3 text-center">先発</th>
              <th className="p-3 text-center">救援</th>
              <th className="p-3 text-center">投球回</th>
              <th className="p-3 text-center">自責</th>
              <th className="p-3 text-center">三振</th>
              <th className="p-3 text-center">勝</th>
              <th className="p-3 text-center">敗</th>
              <th className="p-3 text-center">S</th>
              <th className="p-3 text-center">ERA</th>
              <th className="p-3 text-center">編集</th>
              <th className="p-3 text-center">削除</th>
            </tr>
          </thead>

          {/* テーブル本体 */}
          <tbody>
            {stats.map((s) => (
              <tr key={s.id} className="border-b text-center">
                <td className="p-3">
                  {s.users?.number} {s.users?.username}
                </td>
                <td className="p-3">
                  {s.games?.date} vs {s.games?.opponent}
                </td>
                <td className="p-3">{s.appearances}</td>
                <td className="p-3">{s.starts}</td>
                <td className="p-3">{s.relieves}</td>
                <td className="p-3">{s.innings_pitched}</td>
                <td className="p-3">{s.earned_runs}</td>
                <td className="p-3">{s.strikeouts}</td>
                <td className="p-3">{s.win}</td>
                <td className="p-3">{s.loss}</td>
                <td className="p-3">{s.save}</td>
                <td className="p-3">{s.era}</td>

                <td className="p-3 text-blue-600 underline">
                  <Link href={`/admin/pitcher/${s.id}/edit`}>編集</Link>
                </td>

                <td
                  className="p-3 text-red-600 underline cursor-pointer"
                  onClick={() => handleDelete(s.id)}
                >
                  削除
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
