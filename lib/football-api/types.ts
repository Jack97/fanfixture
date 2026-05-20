export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  slug: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem?: string;
}

export interface FanPub {
  name: string;
  walkMins: number;
  description: string;
  awayFriendly?: boolean;
}

export interface LocalHighlight {
  name: string;
  category: "attraction" | "museum" | "park" | "food" | "experience" | "shopping";
  description: string;
  walkMins?: number;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  citySlug: string;
  address: string;
  lat: number;
  lng: number;
  capacity?: number;
  nearestStation?: string;
  transportNote?: string;
  pubArea?: string;
  airportCode?: string;
  fanPubs?: FanPub[];
  highlights?: LocalHighlight[];
  awayStand?: string;
  awayCapacity?: number;
  ticketOfficeUrl?: string;
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "SUSPENDED"
  | "CANCELLED";

export interface Match {
  id: number;
  slug: string;
  utcDate: string;
  status: MatchStatus;
  matchday?: number;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  venue: Venue;
}

/** Shape returned by football-data.org /v4/matches */
export interface RawMatch {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  competition: {
    id: number;
    name: string;
    code: string;
    emblem?: string;
  };
  score?: {
    winner?: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    fullTime?: { home: number | null; away: number | null };
  };
}

export interface RawMatchesResponse {
  matches: RawMatch[];
  resultSet?: {
    count: number;
    first: string;
    last: string;
    played: number;
  };
}
