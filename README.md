# Requirements

- User can create a new game board
- Allow two (and only two) players to connect to a game board
- Persist game state on the server
- Follow standard rules for tic-tac-toe (or noughts and crosses)
- Display the game result and persist in the database at the end of the game
- Display a ranking of the top five players and allow players to start a new game

## How to start

### Server

1. In server folder add .env file with this data
   DATABASE_URL=postgres://username:password@localhost:5432/tic_tac_toe
   PORT=3001

make sure to use your own username, password, ports of your choice and name DB as tic_tac_toe of if want to change it then do not forget to change it in `database.sql` file as well

2. `npm install`
3. `node server.js` make sure that you see that `Server running on port`

### Client

1. In client folder run `npm install`
2. `npm run dev`
3. Navigate to the browser and see the app `http://localhost:4200/`

### Out of scope

1. Unit testing
2. Tailwind CSS or similar library for styling
3. Data persistence

#### Important note

- I did not persist the data - all what I did - created tables that defined in database.sql and add some hardcoded data for rankings - to show case that I can use API to retrieve that data in UI.
- Persist proper ranking involve refactoring UI to capture user name and store it.
- Persist moves will require quite a lot of logical changes as well.
- In total I already spent about 4ish hours on this exercise and think it is more than enough for now.

Enjoy reviewing current setup.

Thanks,
Artem
