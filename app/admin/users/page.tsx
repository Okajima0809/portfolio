"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type User = {
  id: string;
  username: string;
  number: number;
  category: "監督" | "主将" | "選手";
  avatar_url: string | null;
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("category", { ascending: true })
      .order("number", { ascending: true });

    if (error) {
      alert("ユーザー取得エラー: " + error.message);
      return;
    }

    setUsers(data as User[]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      alert("削除失敗: " + error.message);
      return;
    }

    alert("削除しました");
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">選手一覧</h1>

      <div className="mb-4">
        <Link
          href="/admin/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 新規登録
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-600 text-white border-b text-center">
            <th className="p-3">背番号</th>
            <th className="p-3">名前</th>
            <th className="p-3">カテゴリ</th>
            <th className="p-3">編集</th>
            <th className="p-3">削除</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b text-center" key={user.id}>
              <td className="p-3 text-gray-900">{user.number}</td>
              <td className="p-3 text-gray-900">{user.username}</td>
              <td className="p-3 text-gray-900">{user.category}</td>

              <td className="p-3">
                <Link
                  href={`/admin/users/${user.id}/edit`}
                  className="text-blue-500 underline"
                >
                  編集
                </Link>
              </td>

              <td className="p-3">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:underline"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
