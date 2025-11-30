"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function NewBatterStatsPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");

  // ---- 打撃データ ----
  const [plateAp, setPlateAp] = useState(0);
  const [atBats, setAtBats] = useState(0);
  const [hits, setHits] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [triples, setTriples] = useState(0);
  const [homeRuns, setHomeRuns] = useState(0);
  const [walks, setWalks] = useState(0);
  const [hitByPitch, setHitByPitch] = useState(0);
  const [sacFlies, setSacFlies] = useState(0);
  const [stolenBases, setStolenBases] = useState(0);
  const [rbis, setRbis] = useState(0);

  /* 選手・試合の取得 */
  useEffect(() => {
    const fetchData = async () => {
      const { data: playersData } = await supabase
        .from("users")
        .select("*")
        .order("number");

      const { data: gamesData } = await supabase
        .from("games")
        .select("*")
        .order("date", { ascending: false });

      setPlayers(playersData || []);
      setGames(gamesData || []);
    };

    fetchData();
  }, []);

  /* 打率 / 出塁率 / 長打率 / OPS */
  const calcStats = () => {
    const pa = plateAp;
    const ab = atBats;

    const avg = ab > 0 ? hits / ab : 0;

    const obp = pa > 0 ? (hits + walks + hitByPitch) / pa : 0;

    const slg =
      ab > 0
        ? (hits +
            doubles +
            triples * 2 +
            homeRuns * 3) /
          ab
        : 0;

    const ops = obp + slg;

    return {
      batting_average: avg,
      on_base_percen: obp, // ← DB の正しい名前！
      slugging_percentage: slg,
      ops,
    };
  };

  /* 登録処理 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const calc = calcStats();

    const { error } = await supabase.from("batter_stats").insert({
      user_id: playerId,
      game_id: gameId,
      plate_appearances: plateAp,
      at_bats: atBats,
      hits,
      doubles,
      triples,
      home_runs: homeRuns,
      walks,
      hit_by_pitch: hitByPitch,
      sacrifice_flies: sacFlies,
      stolen_bases: stolenBases,
      rbis,
      ...calc, // ← 自動計算した打率・出塁率・長打率・OPS をまとめて挿入
    });

    if (error) {
      alert("登録失敗: " + error.message);
      return;
    }

    alert("打撃成績を登録しました！");
    router.push("/admin/batter");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900 ">
      <h1 className="text-3xl font-bold mb-6 text-center">打撃成績 登録</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >
        {/* 試合選択 */}
        <SelectBox
          label="試合"
          value={gameId}
          onChange={setGameId}
          options={games.map((g) => ({
            value: g.id,
            label: `${g.date} - ${g.opponent}`,
          }))}
        />

        {/* 選手選択 */}
        <SelectBox
          label="選手"
          value={playerId}
          onChange={setPlayerId}
          options={players.map((p) => ({
            value: p.id,
            label: `${p.number} - ${p.username}`,
          }))}
        />

        {/* 打撃データ */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="打席" value={plateAp} onChange={setPlateAp} />
          <Input label="打数" value={atBats} onChange={setAtBats} />
          <Input label="安打" value={hits} onChange={setHits} />
          <Input label="二塁打" value={doubles} onChange={setDoubles} />
          <Input label="三塁打" value={triples} onChange={setTriples} />
          <Input label="本塁打" value={homeRuns} onChange={setHomeRuns} />
          <Input label="四球" value={walks} onChange={setWalks} />
          <Input label="死球" value={hitByPitch} onChange={setHitByPitch} />
          <Input label="犠飛" value={sacFlies} onChange={setSacFlies} />
          <Input label="盗塁" value={stolenBases} onChange={setStolenBases} />
          <Input label="打点" value={rbis} onChange={setRbis} />
        </div>

        <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700">
          登録する
        </button>
      </form>
    </main>
  );
}

/* 共通 Input */
function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block font-bold mb-1">{label}</label>
      <input
        type="number"
        className="border p-2 rounded w-full"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* 共通 SelectBox */
function SelectBox({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="font-bold">{label}</label>
      <select
        className="border p-2 rounded w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">選択してください</option>
        {options.map((op: any) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
