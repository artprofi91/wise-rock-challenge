CREATE DATABASE tic_tac_toe;

-- This table stores information about each player, including their total number of wins and losses
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0
);

-- This table keeps track of each game's state, including the IDs of the two participating players, the current status of the game, and the ID of the winning player (if the game is concluded).
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    player2_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL, -- Values could be 'waiting', 'in_progress', 'completed'
    winner_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- This table records each move in the games. Each move is linked to a game and a player, and records the position of the move on the board.
CREATE TABLE moves (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    position INTEGER NOT NULL, -- Position can be 0-8 for a 3x3 grid
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);