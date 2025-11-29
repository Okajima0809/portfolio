"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";

export default function HomePage() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*");

      if (error) {
        console.error("データ取得失敗:", error);
      } else {
        setPlayers(sortPlayers(data));
      }
    };

    fetchPlayers();
  }, []);

  return (
    <>
      {/* ------------------------------
          メイン画像
      ------------------------------- */}
      <section className="relative w-full h-[450px] overflow-hidden">
        <img
          src="/img/main.jpg"
          alt="野球チームの試合"
          className="w-full h-full object-cover"
        />
      </section>

      {/* ------------------------------
          選手カード一覧
      ------------------------------- */}
      <main className="px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">選手一覧</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </main>
    </>
  );
}

/* --------------------------------
   🔥 並び替え（監督→主将→選手→背番号順）
----------------------------------- */
function sortPlayers(data: any[]) {
  const categoryOrder: Record<string, number> = {
    "監督": 1,
    "主将": 2,
    "選手": 3,
  };

  return data.sort((a, b) => {
    const aCat = categoryOrder[a.category] ?? 999;
    const bCat = categoryOrder[b.category] ?? 999;

    if (aCat !== bCat) return aCat - bCat;

    return (a.number ?? 999) - (b.number ?? 999);
  });
}

/* --------------------------------
   🔥 カード UI（あなたの提示したデザインに近づけた版）
----------------------------------- */
function PlayerCard({ player }: { player: any }) {
  return (
    <div className="text-center p-6 border rounded-xl shadow-sm bg-white">

      {/* 画像 */}
      <div className="w-full flex justify-center">
        <Image
          src={player.avatar_url || "/img/noimage.png"}
          alt={player.username}
          width={250}
          height={250}
          className="rounded-md object-cover"
        />
      </div>

      {/* 背番号 */}
      <p className="text-4xl font-bold text-blue-900 mt-4">
        {player.number ?? ""}
      </p>

      {/* 名前 */}
      <p className="text-2xl font-bold text-blue-900">
        {player.username}
      </p>

      {/* カテゴリ（監督・主将・選手） */}
      <p className="text-gray-600 mt-2">{player.category}</p>

      <hr className="mt-4 border-blue-900" />
    </div>
  );
}
