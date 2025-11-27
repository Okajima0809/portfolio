"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        alert("選手データ取得エラー: " + error.message);
        return;
      }

      setUsername(data.username);
      setRole(data.role);
      setAvatarUrl(data.avatar_url);
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("users")
      .update({
        username,
        role,
        avatar_url: avatarUrl,
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
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">選手情報を編集</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4 "
      >
        <div>
          <label className="block font-bold mb-1 text-gray-900">選手名</label>
          <input
            type="text"
            className="border p-2 w-full text-gray-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-900">ポジション</label>
          <input
            type="text"
            className="border p-2 w-full text-gray-900"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-900">画像URL</label>
          <input
            type="text"
            className="border p-2 w-full text-gray-900"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          更新する
        </button>
      </form>
    </main>
  );
}
