"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      alert("ユーザー取得エラー: " + error.message);
      return;
    }
    setUsers(data);
  };

  const handleDelete = async (id: number) => {
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
      <h1 className="text-3xl font-bold mb-6">選手一覧</h1>

      <div className="mb-4">
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded"
          href="/admin/users/new"
        >
          ＋ 新規登録
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="p-3">名前</th>
            <th className="p-3">ポジション</th>
            <th className="p-3">編集</th>
            <th className="p-3">削除</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b" key={user.id}>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.role}</td>

              <td className="p-3">
                <Link
                  className="text-blue-600 underline"
                  href={`/admin/users/${user.id}/edit`}
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
