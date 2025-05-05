import { Separator } from "@/components/ui/separator";
import { Entry } from "@/lib/types";
import { User } from "@supabase/supabase-js";

export default function WinnerDisplay({
  winningEntries,
  user,
}: {
  winningEntries: Entry[];
  user: User;
}) {
  const isUserWinner = winningEntries.some(
    (entry) => entry.user_id === user.id
  );

  if (!winningEntries.length) {
    return (
      <>
        {" "}
        <div className="text-center text-lg">
          😢 No winners this time. Nobody had what it takes to build the winning
          streak.
        </div>
        <Separator className="my-4" />
      </>
    );
  }

  if (winningEntries.length === 1) {
    const winner = winningEntries[0];
    const isCurrentUser = winner.user_id === user.id;
    return (
      <div className="text-center text-xl mb-4">
        <div className="text-xl mb-4">Congratulations to the winner!</div>
        <div className="flex items-center flex-row justify-between">
          <div className="text-3xl mx-2">🏆</div>
          <div
            className={`my-2 ${
              isCurrentUser
                ? "font-bold text-green-600"
                : "font-normal text-white"
            }`}
          >
            {winner.display_name}
          </div>
          <div className="text-3xl mx-2">🏆</div>
        </div>
        <div className="flex flex-row items-center my-4 justify-between w-full max-w-sm">
          <span className="text-xl italic">The winning streak</span>
          <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800 mx-4"></div>
          <div className="text-xl">
            🔥<span className="italic">{winner.current_streak}</span>
          </div>
        </div>
        {isCurrentUser && null /* Eventually add some confetti effect */}
        <Separator />
      </div>
    );
  }

  // Multiple winners
  return (
    <div className="text-center">
      <div className="text-xl mb-4">Congratulations to our winners!</div>
      <ul className="list-none p-0 text-xl">
        {winningEntries.map((entry) => (
          <div
            className="flex items-center flex-row justify-between"
            key={entry.user_id}
          >
            <div className="text-3xl mx-2">🏆</div>
            <li
              key={entry.user_id}
              className={`my-2 ${
                entry.user_id === user.id
                  ? "font-bold text-green-600"
                  : "font-normal text-white"
              }`}
            >
              {entry.display_name}
            </li>
            <div className="text-3xl mx-2">🏆</div>
          </div>
        ))}
      </ul>
      <div className="flex flex-row items-center my-4 justify-between w-full max-w-sm">
        <span className="text-xl italic">The winning streak</span>
        <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800 mx-4"></div>
        <div className="text-xl">
          🔥<span className="italic">{winningEntries[0].current_streak}</span>
        </div>
      </div>
      {isUserWinner && null /* Eventually add some confetti effect */}
      <Separator />
    </div>
  );
}
