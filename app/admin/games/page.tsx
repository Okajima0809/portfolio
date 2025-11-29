"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function GameListPage() {
  const [games, setGames] = useState<any[]>([]);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      alert("試合データ取得エラー: " + error.message);
      return;
    }
    setGames(data);
  };

  // 試合削除
  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) {
      alert("削除失敗: " + error.message);
      return;
    }

    alert("削除しました");
    fetchGames();
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">試合一覧</h1>

      {/* 新規作成ボタン */}
      <div className="mb-4">
        <Link
          href="/admin/games/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 新規登録
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded overflow-hidden ">
        <thead className="bg-gray-600 text-white">
          <tr>
            <th className="p-3">日付</th>
            <th className="p-3">対戦相手</th>
            <th className="p-3">スコア</th>
            <th className="p-3">勝敗</th>
            <th className="p-3">編集</th>
            <th className="p-3">削除</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-b text-center text-gray-900">
              <td className="p-3">{game.date}</td>
              <td className="p-3">{game.opponent}</td>

              <td className="p-3">
                {game.score_home} - {game.score_away}
              </td>

              <td className="p-3">
                {game.result === "win" && <span className="text-green-600">勝ち</span>}
                {game.result === "lose" && <span className="text-red-600">負け</span>}
                {game.result === "draw" && <span className="text-gray-600">引き分け</span>}
              </td>

              <td className="p-3">
                <Link
                  href={`/admin/games/${game.id}/edit`}
                  className="text-blue-600 underline"
                >
                  編集
                </Link>
              </td>

              <td className="p-3">
                <button
                  onClick={() => handleDelete(game.id)}
                  className="text-red-500 hover:underline"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}

          {games.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                試合データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
