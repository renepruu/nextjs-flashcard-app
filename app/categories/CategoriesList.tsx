"use client";

import { useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  categories: Category[];
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
};

export default function CategoryList({
  categories,
  updateCategory,
  deleteCategory,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex justify-between items-center p-2 border rounded-md"
        >
          {editingId === cat.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 p-1 border rounded-md"
            />
          ) : (
            <span>{cat.name}</span>
          )}

          <div className="flex gap-2 ml-2">
            {editingId === cat.id ? (
              <>
                <button
                  onClick={async () => {
                    await updateCategory(cat.id, editName);
                    setEditingId(null);
                    setEditName("");
                  }}
                  className="text-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditName("");
                  }}
                  className="text-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
