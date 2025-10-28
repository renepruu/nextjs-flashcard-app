"use client";

import { useState, useEffect } from "react";
import { createPublicClient } from "@/lib/supabase/client";
import "./play.css";

interface Card {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
  categories: {
    id: number;
    name: string;
  } | null;
}

interface Category {
  id: number;
  name: string;
}

export default function PlayPage() {
  const supabase = createPublicClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchCards();
    fetchCategories();
  }, [selectedCategory]);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setCategories(data ?? []);
  }

  async function fetchCards() {
    try {
      let query = supabase.from("cards").select(
        `
          id,
          question,
          answer,
          category_id,
          categories (
            id,
            name
          )
        `
      );

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching cards:", error);
        return;
      }

      // Transform and shuffle the cards
      const transformedCards = (data ?? [])
        .map((card) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          category_id: card.category_id,
          categories:
            card.categories &&
            Array.isArray(card.categories) &&
            card.categories[0]
              ? {
                  id: card.categories[0].id,
                  name: card.categories[0].name,
                }
              : null,
        }))
        .sort(() => Math.random() - 0.5); // Shuffle the cards

      setCards(transformedCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error("Unexpected error in fetchCards:", err);
    } finally {
      setLoading(false);
    }
  }

  const currentCard = cards[currentCardIndex];
  const progress = cards.length
    ? ((currentCardIndex + 1) / cards.length) * 100
    : 0;

  function handleNext() {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  }

  function handlePrevious() {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  }

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleShuffle() {
    setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading cards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">No cards available</p>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show all cards
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <select
          value={selectedCategory || ""}
          onChange={(e) =>
            setSelectedCategory(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full md:w-auto px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600">
          Card {currentCardIndex + 1} of {cards.length}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div
          key={currentCardIndex}
          className="w-full max-w-lg aspect-[3/2] cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div
            className={`relative w-full h-full rounded-xl shadow-lg transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute w-full h-full p-6 bg-white rounded-xl backface-hidden">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Question</h2>
                <p className="text-lg text-center">{currentCard.question}</p>
                {currentCard.categories && (
                  <span className="absolute bottom-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {currentCard.categories.name}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute w-full h-full p-6 bg-blue-50 rounded-xl backface-hidden rotate-y-180 answer-side">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Answer</h2>
                <p className="text-lg text-center">{currentCard.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleShuffle}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Shuffle
        </button>
        <button
          onClick={handleNext}
          disabled={currentCardIndex === cards.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
