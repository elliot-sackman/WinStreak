import Link from "next/link";
export default function Rules() {
  return (
    <div className="w-full max-w-sm">
      <p className="my-6 text-left">
        <strong>The rules are simple: pick teams to win their games!</strong>
      </p>
      <ul className="mx-2 text-left text-sm">
        <li className="my-4">
          • You can make as many (or as few) picks as you want each day
        </li>
        <li className="my-4">
          • Each correct pick increases your WinStreak by +1
        </li>
        <li className="my-4">
          • An incorrect pick eliminates you from the contest, and all pending
          picks will be cancelled
        </li>
        <li className="my-4">
          • If you are eliminated, you can re-enter the contest at any time
        </li>
        <li className="my-4">
          • The first person to reach the target WinStreak wins the prize
        </li>
        <li className="my-4">
          • Tiebreaker will be the start time of the winning pick
        </li>
      </ul>
      <p className="my-6 text-left">
        View detailed contest rules{" "}
        <Link href="/contest-rules" className="text-green-600">
          here
        </Link>
        .
      </p>
    </div>
  );
}
