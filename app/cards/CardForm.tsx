"use client";

import { useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  addCard: (
    question: string,
    answer: string,
    categoryId: number | null
  ) => Promise<void>;
  categories: Category[];
};

export default function CardForm({ addCard, categories }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    await addCard(question, answer, categoryId);
    setQuestion("");
    setAnswer("");
    setCategoryId(null);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <select
        value={categoryId ?? ""}
        onChange={(e) =>
          setCategoryId(e.target.value ? Number(e.target.value) : null)
        }
        className="border rounded p-2"
      >
        <option value="">Select Category (Optional)</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border rounded p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white rounded p-2 mt-2 hover:bg-indigo-700"
      >
        {loading ? "Adding..." : "Add Card"}
      </button>
    </form>
  );
}
