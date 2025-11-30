"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function EditBatterStatsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");

  // 打撃データ
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

  /* ---- データ読込（選手・試合・成績） ---- */
  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: playersData }, { data: gamesData }, { data: statData }] =
        await Promise.all([
          supabase.from("users").select("*").order("number"),
          supabase.from("games").select("*").order("date", { ascending: false }),
          supabase.from("batter_stats").select("*").eq("id", id).single(),
        ]);

      setPlayers(playersData || []);
      setGames(gamesData || []);

      if (statData) {
        setPlayerId(statData.user_id);
        setGameId(statData.game_id);
        setPlateAp(statData.plate_appearances);
        setAtBats(statData.at_bats);
        setHits(statData.hits);
        setDoubles(statData.doubles);
        setTriples(statData.triples);
        setHomeRuns(statData.home_runs);
        setWalks(statData.walks);
        setHitByPitch(statData.hit_by_pitch);
        setSacFlies(statData.sacrifice_flies);
        setStolenBases(statData.stolen_bases);
        setRbis(statData.rbis);
      }
    };

    fetchAll();
  }, [id]);

  /* ---- 更新処理 ---- */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("batter_stats")
      .update({
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
      })
      .eq("id", id);

    if (error) {
      alert("更新に失敗しました：" + error.message);
      return;
    }

    alert("打撃成績を更新しました！");
    router.push("/admin/batter");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">打撃成績 編集</h1>

      <form
        onSubmit={handleUpdate}
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
          更新する
        </button>
      </form>
    </main>
  );
}

/* ------- 共通 Input ------- */
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
        className="border p-2 rounded w-full"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* ------- 共通 SelectBox ------- */
function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
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
        {options.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
