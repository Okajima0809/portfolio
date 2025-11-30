"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [username, setUsername] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [category, setCategory] = useState("選手");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 新しく選んだ画像ファイル
  const [newFile, setNewFile] = useState<File | null>(null);

  // ----------------------------------------
  // ① 初期データ読み込み
  // ----------------------------------------
  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      alert("データ取得に失敗しました: " + error.message);
      return;
    }

    setUsername(data.username);
    setNumber(data.number ?? "");
    setCategory(data.category);
    setAvatarUrl(data.avatar_url ?? null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ----------------------------------------
  // ② Storage に画像アップロード
  // ----------------------------------------
  const uploadImage = async () => {
    if (!newFile) return avatarUrl; // 新しい画像が無ければ既存画像をそのまま利用

    const fileName = `${Date.now()}-${newFile.name}`;

    const { error } = await supabase.storage
      .from("players")
      .upload(fileName, newFile);

    if (error) {
      alert("画像アップロード失敗: " + error.message);
      return avatarUrl;
    }

    const url = supabase.storage.from("players").getPublicUrl(fileName);
    return url.data.publicUrl;
  };

  // ----------------------------------------
  // ③ 更新処理
  // ----------------------------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 新しい画像がある場合はアップロード → URL 取得
    const finalAvatarUrl = await uploadImage();

    const { error } = await supabase
      .from("users")
      .update({
        username,
        number: number === "" ? null : Number(number),
        category,
        avatar_url: finalAvatarUrl,
      })
      .eq("id", userId);

    if (error) {
      alert("更新に失敗しました: " + error.message);
      return;
    }

    alert("更新しました！");
    router.push("/admin/users");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        選手情報 編集
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white max-w-md p-6 rounded shadow space-y-4 mx-auto"
      >
        {/* 名前 */}
        <div>
          <label className="font-bold text-gray-900">名前</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* 背番号 */}
        <div>
          <label className="font-bold text-gray-900">背番号</label>
          <input
            type="number"
            value={number}
            onChange={(e) =>
              setNumber(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 rounded w-full"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="font-bold text-gray-900">カテゴリ</label>
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

        {/* 現在の画像 */}
        {avatarUrl && (
          <div className="text-center">
            <p className="font-bold text-gray-900">現在の画像</p>
            <Image
              src={avatarUrl}
              alt="現在の画像"
              width={200}
              height={200}
              className="rounded mx-auto"
            />
          </div>
        )}

        {/* 新しい画像 */}
        <div>
          <label className="font-bold text-gray-900">新しい画像（任意）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewFile(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2 rounded w-full bg-white"
          />
        </div>

        {/* 更新ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          更新する
        </button>
      </form>
    </main>
  );
}
