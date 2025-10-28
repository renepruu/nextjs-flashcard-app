"use client";

import { useEffect, useState } from "react";
import { createPublicClient } from "@/lib/supabase/client";
import StatisticsList from "./StatisticsList";

type CardStats = {
  id: string;
  question: string;
  correct_count: number;
  incorrect_count: number;
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<CardStats[]>([]);
  const supabase = createPublicClient();

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("cards")
        .select("id, question, correct_count, incorrect_count");
      if (error) console.error("Error fetching stats:", error);
      else setStats(data || []);
    }
    fetchStats();
  }, []);

  const totalCorrect = stats.reduce(
    (acc, c) => acc + (c.correct_count || 0),
    0
  );
  const totalIncorrect = stats.reduce(
    (acc, c) => acc + (c.incorrect_count || 0),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> Flashcard Statistics</h1>
      <div className="mb-6">
        <p>Total Correct: {totalCorrect}</p>
        <p>Total Incorrect: {totalIncorrect}</p>
      </div>
      <StatisticsList stats={stats} />
    </div>
  );
}
