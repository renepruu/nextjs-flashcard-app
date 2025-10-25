"use client";

import { useState } from "react";

type Props = {
  addCategory: (name: string) => Promise<void>;
};

export default function CategoryForm({ addCategory }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addCategory(name.trim());
    setName("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="New category"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 p-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Add
      </button>
    </form>
  );
}
