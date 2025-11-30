"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function PublicGamesPage() {
  const [games, setGames] = useState<any[]>([]);

  // 試合一覧を取得
  const fetchGames = async () => {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      alert("試合取得エラー: " + error.message);
      return;
    }

    setGames(data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <main className="p-8 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">試合結果一覧</h1>

      <table className="w-full bg-white shadow rounded text-center">
        <thead>
          <tr className="bg-gray-300 border-b text-lg">
            <th className="p-3">日付</th>
            <th className="p-3">対戦相手</th>
            <th className="p-3">スコア</th>
            <th className="p-3">結果</th>
          </tr>
        </thead>

        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-b text-lg">
              <td className="p-3">{game.date}</td>
              <td className="p-3">{game.opponent}</td>

              {/* 🔥 スコアにスコアボードページへのリンクを付与 */}
              <td className="p-3">
                <Link
                  href={`/games/${game.id}`}
                  className="text-blue-600 underline"
                >
                  {game.score_home} - {game.score_away}
                </Link>
              </td>

              <td className="p-3">{game.result}</td>
            </tr>
          ))}

          {games.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                試合データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
