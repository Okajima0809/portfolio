"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function GameScoreBoardPage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<any>(null);
  const [innings, setInnings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: gameData } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      const { data: inningData } = await supabase
        .from("innings")
        .select("*")
        .eq("game_id", gameId)
        .order("inning_number", { ascending: true });

      setGame(gameData);
      setInnings(inningData || []);
    };

    fetchData();
  }, [gameId]);

  if (!game) return <p className="p-8 text-center">読み込み中...</p>;

  const homeScores = innings.filter((i) => i.team === "home").map((i) => i.runs);
  const awayScores = innings.filter((i) => i.team === "away").map((i) => i.runs);

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1f2947]">
        試合結果（{game.date}）
      </h1>

      <div className="max-w-5xl mx-auto">
        {/* スコアボード */}
        <table className="w-full border border-[#9aa1ac] text-[#1f2947] text-xl">
          <thead>
            <tr className="bg-[#d3d7df] text-2xl font-bold">
              <th className="border border-[#9aa1ac] px-6 py-3 w-70 text-left">TEAM</th>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <th
                  key={num}
                  className="border border-[#9aa1ac] w-20 text-center"
                >
                  {num}
                </th>
              ))}
              <th className="border border-[#9aa1ac] px-6 py-3 w-20 text-center">R</th>
            </tr>
          </thead>

          <tbody>
            {/* 自チーム */}
            <tr className="text-2xl font-bold">
              <td className="border border-[#9aa1ac] px-6 py-4 text-left">
                アスレッチクス
              </td>
              {homeScores.map((run, i) => (
                <td
                  key={i}
                  className="border border-[#9aa1ac] text-center"
                >
                  {run}
                </td>
              ))}
              <td className="border border-[#9aa1ac] text-center">
                {game.score_home}
              </td>
            </tr>

            {/* 相手チーム */}
            <tr className="text-2xl font-bold">
              <td className="border border-[#9aa1ac] px-6 py-4 text-left">
                {game.opponent}
              </td>
              {awayScores.map((run, i) => (
                <td
                  key={i}
                  className="border border-[#9aa1ac] text-center"
                >
                  {run}
                </td>
              ))}
              <td className="border border-[#9aa1ac] text-center">
                {game.score_away}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
