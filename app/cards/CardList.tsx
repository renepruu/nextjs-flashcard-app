"use client";

import { useState } from "react";

type Card = {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
  categories?: {
    name: string;
  } | null;
};

type Props = {
  cards: Card[];
  updateCard: (
    id: number,
    question: string,
    answer: string,
    categoryId: number | null
  ) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
};

export default function CardsList({ cards, updateCard, deleteCard }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

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
              {card.categories && (
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {card.categories.name}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {editingId === card.id ? (
              <>
                <button
                  onClick={async () => {
                    await updateCard(
                      card.id,
                      editQuestion,
                      editAnswer,
                      editCategoryId
                    );
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
                    setEditCategoryId(card.category_id);
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
