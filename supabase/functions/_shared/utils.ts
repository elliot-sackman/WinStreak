import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { ACTIVE_LEAGUES, API_BASE_URLS, LEAGUE_INFO_MAP } from "./constants.ts";
import { ApiSportsGamesResponse } from "./types.d.ts";

const getSportToLeagueApiIdToLeagueIdMap = async (supabase: SupabaseClient) => {
  const { data: leagues, error } = await supabase.from("leagues").select(
    "league_id,league_api_id,sport",
  );

  if (error) {
    console.error(
      `Error fetching leagues: ${error}`,
    );
  }
  const sportToLeagueApiIdToLeagueIdMap: {
    [key: string]: { [key: number]: number };
  } = {};

  leagues?.forEach((league) => {
    const {
      league_id,
      league_api_id,
      sport,
    } = league;

    if (!(sport in sportToLeagueApiIdToLeagueIdMap)) {
      sportToLeagueApiIdToLeagueIdMap[sport.toLowerCase()] = {};
    }

    sportToLeagueApiIdToLeagueIdMap[sport.toLowerCase()][league_api_id] =
      league_id;
  });

  return sportToLeagueApiIdToLeagueIdMap;
};

const getActiveLeagueIds = (sportToLeagueApiIdToLeagueIdMap: {
  [key: string]: { [key: number]: number };
}) => {
  const activeLeagueIds: number[] = [];
  Object.keys(ACTIVE_LEAGUES).forEach((sport: string) => {
    const activeLeagueAbbreviations = ACTIVE_LEAGUES[sport];
    activeLeagueAbbreviations.forEach((leagueAbbreviation: string) => {
      const leagueApiId = LEAGUE_INFO_MAP[leagueAbbreviation].leagueApiId;
      activeLeagueIds.push(sportToLeagueApiIdToLeagueIdMap[sport][leagueApiId]);
    });
  });

  return activeLeagueIds;
};

const getLeagueIdToTeamApiIdToTeamIdMap = async (
  activeLeagueIds: number[],
  supabase: SupabaseClient,
) => {
  const { data: teams, error } = await supabase.from("teams").select(
    "team_id,team_api_id,league_id",
  ).in("league_id", activeLeagueIds);

  if (error) {
    console.error(
      `Error fetching teams for league IDs ${activeLeagueIds}: ${error.message}`,
    );
  }

  const leagueIdToTeamApiIdToTeamIdMap: {
    [key: number]: { [key: number]: number };
  } = {};
  teams?.forEach((team) => {
    const {
      team_id,
      team_api_id,
      league_id,
    } = team;

    if (!(league_id in leagueIdToTeamApiIdToTeamIdMap)) {
      leagueIdToTeamApiIdToTeamIdMap[league_id] = {};
    }

    leagueIdToTeamApiIdToTeamIdMap[league_id][team_api_id] = team_id;
  });

  return leagueIdToTeamApiIdToTeamIdMap;
};

const getLeagueToExistingGameApiIdToGameIdMap = async (
  activeLeagueIds: number[],
  supabase: SupabaseClient,
  incompleteOnly?: boolean | undefined,
) => {
  const { data: games, error } = await supabase.from("games")
    .select("game_id,game_api_id,league_id,status")
    .in(
      "league_id",
      activeLeagueIds,
    )
    .or("status.eq.scheduled,status.eq.in_progress");

  if (error) {
    console.error(
      `Error fetching games for league IDs ${activeLeagueIds}: ${error.message}`,
    );
  }

  // Object maps leagueId: {gameApiId: gameId}
  const leagueToExistingGameApiIdToGameIdMap: {
    [key: number]: { [key: number]: number };
  } = {};

  activeLeagueIds.forEach((leagueId) =>
    leagueToExistingGameApiIdToGameIdMap[leagueId] = {}
  );

  games?.forEach((game) => {
    const {
      league_id,
      game_api_id,
      game_id,
      status,
    } = game;

    // If we're don't care about the status, or the status is not complete, then we can include it in the map
    // This ensures that when we're updating statuses and picks, we're only doing so for games we haven't already processed
    if (!(status === "completed") || !incompleteOnly) {
      leagueToExistingGameApiIdToGameIdMap[league_id][game_api_id] = game_id;
    }
  });

  return leagueToExistingGameApiIdToGameIdMap;
};

const buildRequestUrls = (
  baseApiUrl: string,
  leagueApiId: number,
  checkCompleted: boolean,
  daysInAdvance: number,
  season: string,
) => {
  const currentDate = new Date();
  const urls = [];

  // If we're looking for completed games, we'll want to check
  //  yesterday's and today's games UTC and get the final scores
  if (checkCompleted) {
    currentDate.setDate(currentDate.getDate() - 2);
    // Push the url for yesterday
    urls.push(
      `${baseApiUrl}/games?date=${
        currentDate.toISOString().split("T")[0]
      }&league=${leagueApiId}&season=${season}`,
    );

    // Update the date to yesterday
    currentDate.setDate(currentDate.getDate() + 1);
    // Push the url for yesterday
    urls.push(
      `${baseApiUrl}/games?date=${
        currentDate.toISOString().split("T")[0]
      }&league=${leagueApiId}&season=${season}`,
    );

    // Update the date to today
    currentDate.setDate(currentDate.getDate() + 1);

    // Push the url for today
    urls.push(
      `${baseApiUrl}/games?date=${
        currentDate.toISOString().split("T")[0]
      }&league=${leagueApiId}&season=${season}`,
    );
  } else {
    // Else we use the daysInAdvance var to determine how many days of games we want to get.
    for (let i = 0; i < daysInAdvance; i++) {
      const dateFilter = currentDate.toISOString().split("T")[0];
      urls.push(
        `${baseApiUrl}/games?date=${dateFilter}&league=${leagueApiId}&season=${season}`,
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return urls;
};

const fetchGames = async (headers: Headers, checkCompleted: boolean) => {
  const errors = [];
  const results = [];

  // Iterate through active sports to specify the baseApiUrl
  for (const sport of Object.keys(ACTIVE_LEAGUES)) {
    const baseApiUrl = API_BASE_URLS[sport];
    // Iterate through the currently active leagues (as far as we're concerned)
    for (const leagueAbbreviation of ACTIVE_LEAGUES[sport]) {
      const {
        leagueApiId,
        season,
        daysInAdvance,
      } = LEAGUE_INFO_MAP[leagueAbbreviation];

      const requestUrls = buildRequestUrls(
        baseApiUrl,
        leagueApiId,
        checkCompleted, // This is hardcoded to false for this script
        daysInAdvance,
        season,
      );

      for (const url of requestUrls) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
          }

          const data: ApiSportsGamesResponse = await response.json();
          results.push({ sport, data });
        } catch (error) {
          errors.push(`Failed for league ${leagueAbbreviation}: ${error}`);
        }
      }
    }
  }

  // Log the results for debugging purposes
  results.forEach((result) => {
    result.data.response.forEach((game) => console.log(game));
  });

  return { results, errors };
};

export {
  buildRequestUrls,
  fetchGames,
  getActiveLeagueIds,
  getLeagueIdToTeamApiIdToTeamIdMap,
  getLeagueToExistingGameApiIdToGameIdMap,
  getSportToLeagueApiIdToLeagueIdMap,
};
