"use client";

import { useState } from "react";

type Props = {
  addCard: (question: string, answer: string) => Promise<void>;
};

export default function CardForm({ addCard }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    await addCard(question, answer);
    setQuestion("");
    setAnswer("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
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
