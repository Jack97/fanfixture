import { NextRequest, NextResponse } from "next/server";
import { getMatchesByCity } from "@/lib/football-api/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = searchParams.get("city");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!city || !from || !to) {
    return NextResponse.json({ error: "city, from, and to are required" }, { status: 400 });
  }

  const matches = await getMatchesByCity(city, from, to);
  return NextResponse.json({ matches });
}
