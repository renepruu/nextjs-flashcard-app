"use client";

import { useState, useEffect } from "react";
import { createPublicClient } from "@/lib/supabase/client";
import CardForm from "./CardForm";
import CardsList from "./CardList";

interface DatabaseCard {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
  categories: {
    id: number;
    name: string;
  } | null;
}

type Card = DatabaseCard;

type Category = {
  id: number;
  name: string;
};

export default function CardsPage() {
  const supabase = createPublicClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setCategories(data ?? []);
  }

  async function fetchCards() {
    setLoading(true);
    try {
      // First, check if we can access the cards table
      const { count, error: countError } = await supabase
        .from("cards")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Error accessing cards table:", countError);
        return;
      }

      console.log(`Found ${count} cards`); // Debug log

      const { data, error } = await supabase
        .from("cards")
        .select(
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
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching cards:", error.message);
        console.error("Error details:", error);
        return;
      }

      console.log("Fetched cards data:", JSON.stringify(data, null, 2)); // Debug log

      // Transform data to match our interface
      const transformedCards = (data ?? []).map((card) => ({
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
      }));

      console.log(
        "Transformed cards:",
        JSON.stringify(transformedCards, null, 2)
      ); // Debug log
      setCards(transformedCards);
    } catch (err) {
      console.error("Unexpected error in fetchCards:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addCard(
    question: string,
    answer: string,
    categoryId: number | null
  ) {
    try {
      const { data, error } = await supabase.from("cards").insert({
        question,
        answer,
        category_id: categoryId,
      }).select(`
          id,
          question,
          answer,
          category_id,
          categories (
            id,
            name
          )
        `);

      if (error) {
        console.error("Error adding card:", error.message);
        console.error("Error details:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.error("No data returned after insert");
        return;
      }

      console.log("Added card data:", JSON.stringify(data, null, 2));

      // Transform the newly added card to match our interface
      const newCards = data.map((card) => ({
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
      }));

      setCards((prev) => [...prev, ...newCards]);
    } catch (err) {
      console.error("Unexpected error in addCard:", err);
    }
  }

  async function updateCard(
    id: number,
    question: string,
    answer: string,
    categoryId: number | null
  ) {
    try {
      const { error } = await supabase
        .from("cards")
        .update({ question, answer, category_id: categoryId })
        .eq("id", id);

      if (error) {
        console.error("Error updating card:", error.message);
        console.error("Error details:", error);
        return;
      }

      // Fetch updated cards to get the latest data with categories
      await fetchCards();
    } catch (err) {
      console.error("Unexpected error in updateCard:", err);
    }
  }

  async function deleteCard(id: number) {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", id);

      if (error) {
        console.error("Error deleting card:", error.message);
        console.error("Error details:", error);
        return;
      }

      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Unexpected error in deleteCard:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Flashcards</h1>
      <CardForm addCard={addCard} categories={categories} />
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
