"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function NewPitcherStatsPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");

  // 投手データ
  const [appearances, setAppearances] = useState(0);
  const [starts, setStarts] = useState(0);
  const [relieves, setRelieves] = useState(0);
  const [inningsPitched, setInningsPitched] = useState(0);
  const [earnedRuns, setEarnedRuns] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [save, setSave] = useState(0);

  /* ------------------------------------
        選手一覧・試合一覧の取得
  ------------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      const { data: playersData } = await supabase
        .from("users")
        .select("*")
        .order("number", { ascending: true });

      const { data: gamesData } = await supabase
        .from("games")
        .select("*")
        .order("date", { ascending: false });

      setPlayers(playersData || []);
      setGames(gamesData || []);
    };

    fetchData();
  }, []);

  /* ------------------------------------
        ERA 自動計算
  ------------------------------------ */
  const calcERA = () => {
    if (inningsPitched === 0) return 0;
    return Number(((earnedRuns * 9) / inningsPitched).toFixed(2));
  };

  /* ------------------------------------
        登録機能
  ------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const era = calcERA();

    const { error } = await supabase.from("pitcher_stats").insert({
      game_id: gameId,
      user_id: playerId,
      appearances,
      starts,
      relieves,
      innings_pitched: inningsPitched,
      earned_runs: earnedRuns,
      strikeouts,
      win,
      loss,
      save,
      era, // ← 自動計算した ERA を保存！
    });

    if (error) {
      alert("登録に失敗: " + error.message);
      return;
    }

    alert("投手成績を登録しました！");
    router.push("/admin/pitcher");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">投手成績 登録</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >
        {/* 試合選択 */}
        <Select
          label="試合"
          value={gameId}
          onChange={setGameId}
          options={games}
          format={(g: any) => `${g.date} - ${g.opponent}`}
        />

        {/* 選手選択 */}
        <Select
          label="選手"
          value={playerId}
          onChange={setPlayerId}
          options={players}
          format={(p: any) => `${p.number} - ${p.username}`}
        />

        {/* 投手データ */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="登板数" value={appearances} onChange={setAppearances} />
          <Input label="先発" value={starts} onChange={setStarts} />
          <Input label="救援" value={relieves} onChange={setRelieves} />
          <Input
            label="投球回"
            value={inningsPitched}
            onChange={setInningsPitched}
          />
          <Input label="自責点" value={earnedRuns} onChange={setEarnedRuns} />
          <Input label="三振" value={strikeouts} onChange={setStrikeouts} />
          <Input label="勝" value={win} onChange={setWin} />
          <Input label="敗" value={loss} onChange={setLoss} />
          <Input label="セーブ" value={save} onChange={setSave} />
        </div>

        {/* ERA（自動表示のみ） */}
        <div className="p-3 bg-gray-200 rounded text-center font-bold">
          自動計算 防御率（ERA）: {calcERA()}
        </div>

        <button className="mt-4 bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700">
          登録する
        </button>
      </form>
    </main>
  );
}

/* -------------------------
  共通UIコンポーネント
-------------------------- */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block font-bold mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  format,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: any[];
  format: (x: any) => string;
}) {
  return (
    <div>
      <label className="font-bold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">選択してください</option>
        {options.map((o: any) => (
          <option key={o.id} value={o.id}>
            {format(o)}
          </option>
        ))}
      </select>
    </div>
  );
}
