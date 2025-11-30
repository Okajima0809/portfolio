"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function EditPitcherPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // 編集フォーム用の state
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");

  const [appearances, setAppearances] = useState(0);
  const [starts, setStarts] = useState(0);
  const [relieves, setRelieves] = useState(0);

  const [inningsPitched, setInningsPitched] = useState(0);
  const [earnedRuns, setEarnedRuns] = useState(0);
  const [strikeouts, setStrikeouts] = useState(0);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [save, setSave] = useState(0);

  const [era, setEra] = useState(0); // 表示用（編集不可）

  /* ------------------------------
      初期データ読み込み
  ------------------------------ */
  useEffect(() => {
    const fetchInitial = async () => {
      // 選手
      const { data: playersData } = await supabase
        .from("users")
        .select("*")
        .order("number", { ascending: true });

      // 試合
      const { data: gamesData } = await supabase
        .from("games")
        .select("*")
        .order("date", { ascending: false });

      setPlayers(playersData || []);
      setGames(gamesData || []);

      // 投手成績本体
      const { data, error } = await supabase
        .from("pitcher_stats")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("データ取得に失敗：" + error.message);
        return;
      }

      setPlayerId(data.user_id);
      setGameId(data.game_id);

      setAppearances(data.appearances);
      setStarts(data.starts);
      setRelieves(data.relieves ?? data.relieveS ?? 0);

      setInningsPitched(Number(data.innings_pitched));
      setEarnedRuns(data.earned_runs);
      setStrikeouts(data.strikeouts);
      setWin(data.win);
      setLoss(data.loss);
      setSave(data.save);

      setEra(Number(data.era));
    };

    fetchInitial();
  }, [id]);

  /* ------------------------------
      更新処理
  ------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ERA 自動再計算
    const calculatedEra =
      inningsPitched > 0
        ? Number(((earnedRuns * 9) / inningsPitched).toFixed(2))
        : 0;

    const { error } = await supabase
      .from("pitcher_stats")
      .update({
        user_id: playerId,
        game_id: gameId,
        appearances,
        starts,
        relieves,
        innings_pitched: inningsPitched,
        earned_runs: earnedRuns,
        strikeouts,
        win,
        loss,
        save,
        era: calculatedEra,
      })
      .eq("id", id);

    if (error) {
      alert("更新に失敗：" + error.message);
      return;
    }

    alert("投手成績を更新しました！");
    router.push("/admin/pitcher");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">
        投手成績 編集
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded max-w-xl mx-auto space-y-4"
      >
        {/* 選手選択 */}
        <div>
          <label className="font-bold">選手</label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">選択してください</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number} - {p.username}
              </option>
            ))}
          </select>
        </div>

        {/* 試合選択 */}
        <div>
          <label className="font-bold">試合</label>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">選択してください</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.date} vs {g.opponent}
              </option>
            ))}
          </select>
        </div>

        {/* 投手データ */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="登板" value={appearances} onChange={setAppearances} />
          <Input label="先発" value={starts} onChange={setStarts} />
          <Input label="救援" value={relieves} onChange={setRelieves} />
          <Input
            label="投球回"
            value={inningsPitched}
            onChange={setInningsPitched}
          />
          <Input
            label="自責点"
            value={earnedRuns}
            onChange={setEarnedRuns}
          />
          <Input
            label="奪三振"
            value={strikeouts}
            onChange={setStrikeouts}
          />
          <Input label="勝" value={win} onChange={setWin} />
          <Input label="敗" value={loss} onChange={setLoss} />
          <Input label="セーブ" value={save} onChange={setSave} />
        </div>

        {/* ERA（編集不可） */}
        <div>
          <label className="block font-bold mb-1">
            防御率（自動計算）
          </label>
          <input
            type="number"
            value={era}
            readOnly
            className="border p-2 rounded w-full bg-gray-200"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4">
          更新する
        </button>
      </form>
    </main>
  );
}

/* 共通 Input UI */
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
