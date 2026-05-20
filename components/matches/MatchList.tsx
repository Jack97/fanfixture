import type { Match } from "@/lib/football-api/types";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  return (
    <div className="flex flex-col gap-3">
      {matches.map((match, i) => (
        <MatchCard key={match.id} match={match} animationDelay={i * 60} />
      ))}
    </div>
  );
}
