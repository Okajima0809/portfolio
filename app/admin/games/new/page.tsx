"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function NewGamePage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [inningsHome, setInningsHome] = useState(Array(7).fill(0));
  const [inningsAway, setInningsAway] = useState(Array(7).fill(0));

  // 🔥 合計点を自動計算
  const totalHome = inningsHome.reduce((a, b) => a + Number(b), 0);
  const totalAway = inningsAway.reduce((a, b) => a + Number(b), 0);

  const result =
    totalHome > totalAway ? "勝ち" :
    totalHome < totalAway ? "負け" :
    "引き分け";

  // 🔥 イニング得点変更
  const updateInning = (
    index: number,
    value: number,
    team: "home" | "away"
  ) => {
    if (team === "home") {
      const newScores = [...inningsHome];
      newScores[index] = value;
      setInningsHome(newScores);
    } else {
      const newScores = [...inningsAway];
      newScores[index] = value;
      setInningsAway(newScores);
    }
  };

  // 🔥 保存処理（games + innings）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ----------------------------
    // ① games テーブルに保存
    // ----------------------------
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        date,
        opponent,
        score_home: totalHome,
        score_away: totalAway,
        result,
      })
      .select()
      .single();

    if (gameError || !game) {
      alert("試合登録に失敗しました: " + gameError?.message);
      return;
    }

    const gameId = game.id; // ← これを FK として使う

    // ----------------------------
    // ② innings テーブルにまとめて保存
    // ----------------------------
    const inningRows = [];

    for (let i = 0; i < inningsHome.length; i++) {
      inningRows.push({
        game_id: gameId,
        inning_number: i + 1,
        team: "home",
        runs: inningsHome[i],
      });
      inningRows.push({
        game_id: gameId,
        inning_number: i + 1,
        team: "away",
        runs: inningsAway[i],
      });
    }

    const { error: inningError } = await supabase
      .from("innings")
      .insert(inningRows);

    if (inningError) {
      alert("イニング保存に失敗しました: " + inningError.message);
      return;
    }

    alert("試合登録が完了しました！");
    router.push("/admin"); // 管理ダッシュボードへ戻る
  };

  return (
    <main className="p-8 bg-gray-100 min-h-screen flex flex-col items-center text-gray-900 ">
      <h1 className="text-3xl font-bold mb-8">試合登録</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6 w-full max-w-4xl"
      >
        {/* 日付 */}
        <div>
          <label className="block font-bold mb-1 text-gray-700">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* 対戦相手 */}
        <div>
          <label className="block font-bold mb-1 text-gray-700">対戦相手</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="例：レッドソックス"
            required
          />
        </div>

        {/* ----------------------------------------------------
            イニング入力テーブル
        ---------------------------------------------------- */}
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">TEAM</th>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <th key={n} className="p-2 border w-20">{n}</th>
              ))}
              <th className="p-2 border w-20">合計</th>
            </tr>
          </thead>

          <tbody>

            {/* 自チーム（アスレッチクス） */}
            <tr>
              <td className="border p-2 font-bold">アスレッチクス</td>

              {inningsHome.map((score, i) => (
                <td key={i} className="border p-1">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={score}
                    min={0}
                    onChange={(e) =>
                      updateInning(i, Number(e.target.value), "home")
                    }
                  />
                </td>
              ))}

              <td className="border p-2 font-bold">{totalHome}</td>
            </tr>

            {/* 相手チーム */}
            <tr>
              <td className="border p-2 font-bold">相手</td>

              {inningsAway.map((score, i) => (
                <td key={i} className="border p-1">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={score}
                    min={0}
                    onChange={(e) =>
                      updateInning(i, Number(e.target.value), "away")
                    }
                  />
                </td>
              ))}

              <td className="border p-2 font-bold">{totalAway}</td>
            </tr>
          </tbody>
        </table>

        {/* 勝敗（自動計算） */}
        <div className="text-xl font-bold text-center mt-4">
          勝敗： <span className="text-blue-600">{result}</span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 mt-6"
        >
          登録する
        </button>
      </form>
    </main>
  );
}
