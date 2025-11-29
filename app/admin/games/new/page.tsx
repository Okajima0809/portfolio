"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [result, setResult] = useState("win");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("games").insert({
      date,
      opponent,
      score_home: Number(scoreHome),
      score_away: Number(scoreAway),
      result,
    });

    if (error) {
      alert("登録に失敗しました: " + error.message);
      return;
    }

    alert("試合を登録しました！");
    router.push("/admin/games");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">試合登録</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4 text-center mx-auto"
      >
        {/* 日付 */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* 対戦相手 */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">対戦相手</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* スコア（自チーム） */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">
            自チームスコア
          </label>
          <input
            type="number"
            value={scoreHome}
            onChange={(e) => setScoreHome(e.target.value)}
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* スコア（相手） */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">相手スコア</label>
          <input
            type="number"
            value={scoreAway}
            onChange={(e) => setScoreAway(e.target.value)}
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* 勝敗 */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">勝敗</label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="border p-2 rounded w-full text-gray-900"
          >
            <option value="win">勝ち</option>
            <option value="lose">負け</option>
            <option value="draw">引き分け</option>
          </select>
        </div>

        {/* 登録ボタン */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          登録する
        </button>
      </form>
    </main>
  );
}
