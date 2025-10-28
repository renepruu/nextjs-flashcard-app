"use client";

type CardStats = {
  id: string;
  question: string;
  correct_count: number;
  incorrect_count: number;
};

interface StatisticsListProps {
  stats: CardStats[];
}

export default function StatisticsList({ stats }: StatisticsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((card) => (
        <div key={card.id} className="p-4 border rounded-lg shadow">
          <h2 className="font-semibold">{card.question}</h2>
          <p> Correct: {card.correct_count}</p>
          <p> Incorrect: {card.incorrect_count}</p>
        </div>
      ))}
    </div>
  );
}
