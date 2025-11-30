"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;

  // ----------------------
  // State（試合情報）
  // ----------------------
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [inningsHome, setInningsHome] = useState(Array(7).fill(0));
  const [inningsAway, setInningsAway] = useState(Array(7).fill(0));

  // 合計得点（自動計算）
  const totalHome = inningsHome.reduce((a, b) => a + Number(b), 0);
  const totalAway = inningsAway.reduce((a, b) => a + Number(b), 0);

  const result =
    totalHome > totalAway ? "勝ち"
    : totalHome < totalAway ? "負け"
    : "引き分け";

  // ------- イニング得点変更 -------
  const updateInning = (index: number, value: number, team: "home" | "away") => {
    if (team === "home") {
      const updated = [...inningsHome];
      updated[index] = value;
      setInningsHome(updated);
    } else {
      const updated = [...inningsAway];
      updated[index] = value;
      setInningsAway(updated);
    }
  };

  // ----------------------
  // データ取得（games + innings）
  // ----------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!gameId) return;

      // ① games テーブル
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (gameError || !game) {
        alert("試合データ取得に失敗しました：" + gameError?.message);
        return;
      }

      setDate(game.date);
      setOpponent(game.opponent);

      // ② innings テーブル（home / away）
      const { data: inningData, error: inningError } = await supabase
        .from("innings")
        .select("*")
        .eq("game_id", gameId)
        .order("inning_number", { ascending: true });

      if (inningError) {
        alert("イニングデータ取得に失敗：" + inningError.message);
        return;
      }

      const home = inningData.filter((i) => i.team === "home").map((i) => i.runs);
      const away = inningData.filter((i) => i.team === "away").map((i) => i.runs);

      setInningsHome(home);
      setInningsAway(away);
    };

    fetchData();
  }, [gameId]);

  // ----------------------
  // 更新処理（games + innings）
  // ----------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // games 更新
    const { error: gameError } = await supabase
      .from("games")
      .update({
        date,
        opponent,
        score_home: totalHome,
        score_away: totalAway,
        result,
      })
      .eq("id", gameId);

    if (gameError) {
      alert("試合更新に失敗しました：" + gameError.message);
      return;
    }

    // innings 更新
    const inningRows = [];

    for (let i = 0; i < 7; i++) {
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

    // 先に既存削除 → 再INSERT（上書き）
    await supabase.from("innings").delete().eq("game_id", gameId);

    const { error: inningError } = await supabase
      .from("innings")
      .insert(inningRows);

    if (inningError) {
      alert("イニング更新に失敗しました：" + inningError.message);
      return;
    }

    alert("試合データを更新しました！");
    router.push("/admin/games");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center text-gray-900 ">
      <h1 className="text-3xl font-bold mb-6">試合データ編集</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-md shadow-md max-w-4xl w-full space-y-6"
      >
        {/* 日付 */}
        <div>
          <label className="font-bold mb-1 block">日付</label>
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
          <label className="font-bold mb-1 block">対戦相手</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* -------- イニング得点入力テーブル -------- */}
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">TEAM</th>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <th key={n} className="border p-2 w-20">{n}</th>
              ))}
              <th className="p-2 border w-20">合計</th>
            </tr>
          </thead>

          <tbody>
            {/* 自チーム */}
            <tr>
              <td className="border p-2 font-bold">アスレッチクス</td>

              {inningsHome.map((score, i) => (
                <td key={i} className="border p-1">
                  <input
                    type="number"
                    value={score}
                    min={0}
                    onChange={(e) =>
                      updateInning(i, Number(e.target.value), "home")
                    }
                    className="w-16 p-1 border rounded text-center"
                  />
                </td>
              ))}

              <td className="border p-2 font-bold">{totalHome}</td>
            </tr>

            {/* 相手 */}
            <tr>
              <td className="border p-2 font-bold">相手</td>

              {inningsAway.map((score, i) => (
                <td key={i} className="border p-1">
                  <input
                    type="number"
                    value={score}
                    min={0}
                    onChange={(e) =>
                      updateInning(i, Number(e.target.value), "away")
                    }
                    className="w-16 p-1 border rounded text-center"
                  />
                </td>
              ))}

              <td className="border p-2 font-bold">{totalAway}</td>
            </tr>
          </tbody>
        </table>

        {/* 勝敗（自動） */}
        <div className="text-xl font-bold text-center">
          勝敗：<span className="text-blue-600">{result}</span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          更新する
        </button>
      </form>
    </main>
  );
}
