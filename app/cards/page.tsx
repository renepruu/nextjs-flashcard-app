"use client";

import { useState, useEffect } from "react";
import { createPublicClient } from "@/lib/supabase/client";
import CardForm from "./CardForm";
import CardsList from "./CardList";

type Card = {
  id: number;
  question: string;
  answer: string;
};

export default function CardsPage() {
  const supabase = createPublicClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setCards(data ?? []);
    setLoading(false);
  }

  async function addCard(question: string, answer: string) {
    const { data, error } = await supabase
      .from("cards")
      .insert({ question, answer })
      .select();
    if (error) console.error(error);
    else setCards((prev) => [...prev, ...data]);
  }

  async function updateCard(id: number, question: string, answer: string) {
    const { error } = await supabase
      .from("cards")
      .update({ question, answer })
      .eq("id", id);
    if (error) console.error(error);
    else fetchCards();
  }

  async function deleteCard(id: number) {
    const { error } = await supabase.from("cards").delete().eq("id", id);
    if (error) console.error(error);
    else setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Flashcards</h1>
      <CardForm addCard={addCard} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CardsList
          cards={cards}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      )}
    </div>
  );
}
