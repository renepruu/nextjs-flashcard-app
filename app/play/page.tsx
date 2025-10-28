"use client";

import { useEffect, useState } from "react";
import { createPublicClient } from "@/lib/supabase/client";
import PlayCard from "./PlayCard";

export default function PlayPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"ordered" | "random">("ordered");

  useEffect(() => {
    async function loadCards() {
      const supabase = createPublicClient();

      const { data, error } = await supabase
        .from("cards")
        .select(
          `
          id,
          question,
          answer,
          correct_count,
          incorrect_count,
          category_id,
          categories ( id, name )
        `
        )
        .order("category_id", { ascending: true }); // default order by category

      if (error) console.error("Error loading cards:", error);
      else setCards(data || []);

      setLoading(false);
    }

    loadCards();
  }, []);

  const handleModeChange = (newMode: "ordered" | "random") => {
    setMode(newMode);
    if (newMode === "random") {
      // shuffle cards
      setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    } else {
      // reload ordered list
      setCards((prev) =>
        [...prev].sort((a, b) => a.category_id - b.category_id)
      );
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!cards.length)
    return (
      <p className="text-center mt-8">
        No cards available. Please add some first.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Play Mode</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleModeChange("ordered")}
          className={`px-4 py-2 rounded-md ${
            mode === "ordered" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Ordered
        </button>
        <button
          onClick={() => handleModeChange("random")}
          className={`px-4 py-2 rounded-md ${
            mode === "random" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Random
        </button>
      </div>

      <PlayCard cards={cards} />
    </div>
  );
}
