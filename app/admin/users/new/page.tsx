"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewPlayerPage() {
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [category, setCategory] = useState("選手");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  // ------------------------
  // 画像を Storage にアップロード
  // ------------------------
  const uploadImage = async () => {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`; // 重複防止
    const { data, error } = await supabase.storage
      .from("players")
      .upload(fileName, file);

    if (error) {
      alert("画像アップロード失敗：" + error.message);
      return null;
    }

    // 公開URLを取得
    const url = supabase.storage.from("players").getPublicUrl(fileName);
    return url.data.publicUrl;
  };

  // ------------------------
  // 登録ボタン押した時
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let avatar_url = null;
    if (file) {
      avatar_url = await uploadImage();
    }

    const { error } = await supabase.from("users").insert({
      username,
      number,
      category,
      avatar_url,
    });

    if (error) {
      alert("登録に失敗しました: " + error.message);
      return;
    }

    alert("選手を登録しました！");
    router.push("/admin/users");
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
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* 背番号 */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">背番号</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="border p-2 rounded w-full text-gray-900"
            required
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="監督">監督</option>
            <option value="主将">主将</option>
            <option value="選手">選手</option>
          </select>
        </div>

        {/* 画像アップロード */}
        <div>
          <label className="block font-bold mb-1 text-gray-900">選手写真</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full bg-white text-gray-900"
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
