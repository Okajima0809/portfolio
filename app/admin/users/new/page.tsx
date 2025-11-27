"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewPlayerPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("users").insert({
      username,
      role,
      avatar_url: avatarUrl,
    });

    if (error) {
      alert("登録に失敗しました: " + error.message);
      return;
    }

    alert("選手を登録しました！");
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">選手登録</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4"
      >
        {/* 選手名 */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">選手名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* ポジション */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">ポジション</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="例：投手、捕手、一塁手"
          />
        </div>

        {/* 画像URL */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">画像URL（任意）</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="border p-2 rounded w-full "
            placeholder="https://〜"
          />
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
