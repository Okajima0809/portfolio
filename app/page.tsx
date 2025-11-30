"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const [game, setGame] = useState<any>(null);
  const [innings, setInnings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: latestGame } = await supabase
        .from("games")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (!latestGame) return;

      setGame(latestGame);

      const { data: inningData } = await supabase
        .from("innings")
        .select("*")
        .eq("game_id", latestGame.id)
        .order("inning_number");

      setInnings(inningData || []);
    };

    fetchData();
  }, []);

  const home = innings.filter((i) => i.team === "home");
  const away = innings.filter((i) => i.team === "away");

  return (
    <main className="bg-white">
      {/* ① メイン画像 */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <img
          src="/img/main.jpg"
          alt="野球チームの試合"
          className="w-full h-full object-cover"
        />
      </section>

      {/* ② スコアボード */}
      <section className="py-12 bg-white text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">直近の試合結果</h2>

        {!game ? (
          <p className="text-center text-gray-600 text-lg">試合データがありません</p>
        ) : (
          <div className="max-w-6xl mx-auto px-4">
            {/* 試合タイトル */}
            <p className="text-center text-2xl mb-8">
              {game.date} vs {game.opponent}
            </p>

            {/* スコアボード本体 */}
            <div className="overflow-x-auto">
              <table className="w-full text-center bg-white shadow-lg border-2 border-gray-400">
                <thead>
                  <tr className="bg-gray-300 text-lg">
                    <th className="border-2 border-gray-400 p-4 w-40">TEAM</th>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <th key={n} className="border-2 border-gray-400 p-4 w-20">
                        {n}
                      </th>
                    ))}
                    <th className="border-2 border-gray-400 p-4 w-20">R</th>
                  </tr>
                </thead>

                <tbody>
                  {/* アスレッチクス */}
                  <tr className="text-xl">
                    <td className="border-2 border-gray-400 p-4 font-bold">
                      アスレッチクス
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <td key={n} className="border-2 border-gray-400 p-4">
                        {home.find((i) => i.inning_number === n)?.runs ?? 0}
                      </td>
                    ))}
                    <td className="border-2 border-gray-400 p-4 font-bold">
                      {game.score_home}
                    </td>
                  </tr>

                  {/* 相手チーム */}
                  <tr className="text-xl">
                    <td className="border-2 border-gray-400 p-4 font-bold">
                      {game.opponent}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <td key={n} className="border-2 border-gray-400 p-4">
                        {away.find((i) => i.inning_number === n)?.runs ?? 0}
                      </td>
                    ))}
                    <td className="border-2 border-gray-400 p-4 font-bold">
                      {game.score_away}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center mt-8 text-3xl font-bold">
              {" "}
              <span
                className={
                  game.result === "勝ち"
                    ? "text-blue-600"
                    : game.result === "負け"
                    ? "text-red-600"
                    : "text-gray-700"
                }
              >
                {game.result}
              </span>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
