export type Contest = {
    contest_id: number;
    league_id: number | null;
    league_name: string | null;
    sport: string;
    target_stat: string;
    streak_length: number;
    contest_prize: number;
    reentries_allowed: boolean;
    contest_start_datetime: string;
    contest_end_datetime: string | null;
    is_public: boolean;
    contest_name: string;
    contest_description: string | null;
    contest_status: string; 
    contest_winner_user_id: string | null;
    contest_winner_display_name: string | null;
  };
  
export type Entry = {
    entry_id: number;
    contest_id: number;
    user_id: string;
    display_name: string;
    entry_number: number;
    created_at: string;
    is_complete: boolean;
    current_streak: number;
    contest_streak_length: number;
}