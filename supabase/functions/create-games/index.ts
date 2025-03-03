// This script runs once daily to pull in all games from the next week and create any that are not currently in the database.
// TODO: How to programmatically remove postponed/canceled games

import { createClient } from "jsr:@supabase/supabase-js";
import {
  ACTIVE_LEAGUES,
  API_BASE_URLS,
  GAME_STATUS_MAP,
  LEAGUE_INFO_MAP,
} from "../_shared/constants.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

const API_SPORTS_API_KEY = Deno.env.get("API_SPORTS_API_KEY");

Deno.serve(async (_req: Request) => {
  if (!API_SPORTS_API_KEY) {
    return new Response("no environment vars", { status: 500 });
  }

  const headers = new Headers({
    "x-apisports-key": API_SPORTS_API_KEY,
    "Accept": "application/json",
  });

  const errors = [];
  const results = [];

  // Iterate through active sports to specify the endpoint
  for (const sport of Object.keys(ACTIVE_LEAGUES)) {
    const endpoint = API_BASE_URLS[sport];
    // Iterate through the currently active leagues (as far as we're concerned)
    for (const league of ACTIVE_LEAGUES[sport]) {
      const leagueId = LEAGUE_INFO_MAP[league].leagueId;
      const season = LEAGUE_INFO_MAP[league].season;
      const url =
        `${endpoint}/games?date=2025-03-03&league=${leagueId}&season=${season}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        results.push({ league, data });
      } catch (error) {
        errors.push(`Failed for league ${league}: ${error}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("errors: ", errors);
    return new Response(JSON.stringify({ errors }), { status: 500 });
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
