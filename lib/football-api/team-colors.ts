export const TEAM_COLORS: Record<number, string> = {
  57: "#EF0107",   // Arsenal
  58: "#670E36",   // Aston Villa
  61: "#034694",   // Chelsea
  62: "#003399",   // Everton
  63: "#7A263A",   // West Ham
  64: "#C8102E",   // Liverpool
  65: "#6CABDD",   // Man City
  66: "#DA291C",   // Man United
  67: "#241F20",   // Newcastle
  73: "#132257",   // Tottenham
  76: "#FDB913",   // Wolves
  328: "#6C1D45",  // Burnley
  338: "#003090",  // Leicester
  340: "#D71920",  // Southampton
  341: "#FFCD00",  // Leeds
  345: "#003082",  // Sheffield Wednesday
  351: "#DD0000",  // Nottingham Forest
  354: "#CC0000",  // Fulham
  356: "#EC2227",  // Sheffield United
  387: "#E30613",  // Bristol City
  397: "#0057B8",  // Brighton
  402: "#E30613",  // Brentford
  563: "#C4122E",  // Crystal Palace
  715: "#0070B5",  // Cardiff
  1044: "#DA291C", // Bournemouth
};

export function getTeamColor(teamId: number): string {
  return TEAM_COLORS[teamId] ?? "#FFFFFF";
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
