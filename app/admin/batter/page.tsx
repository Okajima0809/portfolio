"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function BatterStatsList() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("batter_stats")
        .select(`
          id,
          plate_appearances,
          at_bats,
          hits,
          doubles,
          triples,
          home_runs,
          rbis,
          walks,
          hit_by_pitch,
          sacrifice_flies,
          users (
            username,
            number
          ),
          games (
            opponent,
            date
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setStats(data || []);
      }
    };

    fetchStats();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase
      .from("batter_stats")
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
      <h1 className="text-3xl font-bold mb-4">打撃成績一覧</h1>
        <div className="mt-6">
        <Link
          href="/admin/batter/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block mb-4"
        >
          + 新規登録
        </Link>
        </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-700 text-white text-sm">
            <tr>
              <th className="p-2">選手</th>
              <th className="p-2">試合</th>
              <th className="p-2">打席</th>
              <th className="p-2">打数</th>
              <th className="p-2">安打</th>
              <th className="p-2">二塁打</th>
              <th className="p-2">三塁打</th>
              <th className="p-2">本塁打</th>
              <th className="p-2">打点</th>
              <th className="p-2">四球</th>
              <th className="p-2">死球</th>
              <th className="p-2">犠飛</th>
              <th className="p-2">編集</th>
              <th className="p-2">削除</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((s) => (
              <tr key={s.id} className="border-b text-sm">
                <td className="p-2">
                  {s.users?.number} {s.users?.username}
                </td>

                <td className="p-2">
                  {s.games?.date} vs {s.games?.opponent}
                </td>

                <td className="p-2">{s.plate_appearances}</td>
                <td className="p-2">{s.at_bats}</td>
                <td className="p-2">{s.hits}</td>
                <td className="p-2">{s.doubles}</td>
                <td className="p-2">{s.triples}</td>
                <td className="p-2">{s.home_runs}</td>
                <td className="p-2">{s.rbis}</td>
                <td className="p-2">{s.walks}</td>
                <td className="p-2">{s.hit_by_pitch}</td>
                <td className="p-2">{s.sacrifice_flies}</td>

                <td className="p-2 text-blue-600 underline">
                  <Link href={`/admin/batter/${s.id}/edit`}>編集</Link>
                </td>

                <td
                  className="p-2 text-red-600 underline cursor-pointer"
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
