// this function will receive a request with IDs for completed games
// It will then query the database for those games, and use the scores to determine the winners.
// This function will also query the database for the picks associated with the game ID's in order to determine if they were correct or not.
// And finally, it will query for the entries associated with those picks.
// it will then parse all the data and determine how to update the games, entries, and picks
// And finally send them to the DB, where a function will handle the updates in a single transaction.
// That way, if this function fails for whatever reason, then the next update to games will resend the IDs and try again.
