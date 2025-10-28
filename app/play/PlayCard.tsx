"use client";

import { useState } from "react";
import { createPublicClient } from "@/lib/supabase/client";

export default function PlayCard({ cards }: { cards: any[] }) {
  const supabase = createPublicClient();
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const currentCard = cards[index];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentCard) return;

    const correct =
      userAnswer.trim().toLowerCase() ===
      currentCard.answer.trim().toLowerCase();

    setFeedback(
      correct
        ? " Correct!"
        : ` Incorrect. Correct answer: ${currentCard.answer}`
    );

    // update statistics in Supabase
    await supabase
      .from("cards")
      .update({
        correct_count: currentCard.correct_count + (correct ? 1 : 0),
        incorrect_count: currentCard.incorrect_count + (correct ? 0 : 1),
      })
      .eq("id", currentCard.id);
  }

  function handleNext() {
    setFeedback("");
    setUserAnswer("");
    if (index < cards.length - 1) setIndex(index + 1);
    else setIndex(0);
  }

  if (!currentCard) return <p>No cards to play.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Category:{" "}
        <span className="text-blue-600 dark:text-blue-400">
          {currentCard.categories?.name || "Uncategorized"}
        </span>
      </h2>

      <p className="text-xl text-gray-900 mb-4">{currentCard.question}</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Check Answer
        </button>
      </form>

      {feedback && <div className="my-3 text-sm font-medium">{feedback}</div>}

      <button
        onClick={handleNext}
        className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-md"
      >
        Next Card
      </button>
    </div>
  );
}
