"use client";

import { useState } from "react";

type Card = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  cards: Card[];
  updateCard: (id: number, question: string, answer: string) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
};

export default function CardsList({ cards, updateCard, deleteCard }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  return (
    <ul className="space-y-3">
      {cards.map((card) => (
        <li
          key={card.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          {editingId === card.id ? (
            <div className="flex gap-2 flex-1">
              <input
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="border rounded p-1 flex-1"
              />
              <input
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="border rounded p-1 flex-1"
              />
            </div>
          ) : (
            <div className="flex-1">
              <p>
                <strong>Q:</strong> {card.question}
              </p>
              <p>
                <strong>A:</strong> {card.answer}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {editingId === card.id ? (
              <>
                <button
                  onClick={async () => {
                    await updateCard(card.id, editQuestion, editAnswer);
                    setEditingId(null);
                  }}
                  className="bg-green-600 text-white p-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white p-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(card.id);
                    setEditQuestion(card.question);
                    setEditAnswer(card.answer);
                  }}
                  className="bg-yellow-600 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="bg-red-600 text-white p-1 rounded"
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
