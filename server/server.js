const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const wss = new WebSocketServer({ server });
/**
 * key: userId
 * value: websocket
 */
const clients = new Map();

/**games {
 X: userId,
 O: userId,
 board: new Array(9) filled with 0 or X,
 next: "X" | "O",
  }
  */
const games = new Map();

const connected = () => {
  this.isAlive = true;
};

wss.on('connection', function connection(ws) {
  const userID = crypto.randomUUID();
  clients.set(userID, ws);
  ws.isAlive = true;
  ws.on('error', console.error);
  ws.on('pong', connected);

  ws.on('message', function message(data) {
    const res = processData(JSON.parse(data));
    ws.send(JSON.stringify(res));
    if (res.type === 'move') {
      clients.get(res.sendTo).send(JSON.stringify(res));
    }
    if (res.type === 'joinedGame' && res.status === 'success') {
      //send to other player
      clients.get(findGameByPlayer(userID).X).send(
        JSON.stringify({
          status: 'success',
          message: 'Player joined',
          type: 'playerJoined',
          game: res.game
        })
      );
    }
    if (res.type === 'newGameAgain') {
      clients.get(res.sendTo).send(JSON.stringify(res));
    }
  });
  ws.on('close', () => {
    const game = findGameByPlayer(userID);
    const otherPlayer = game?.X === userID ? game?.O : game?.X;
    if (game && otherPlayer) {
      clients
        .get(otherPlayer)
        ?.send(JSON.stringify(processData({ action: 'playerDisconnected' })));
    }
    clients.delete(userID);
  });
  ws.send(
    JSON.stringify({
      userId: userID,
      status: 'success',
      message: 'Assigned user id',
      type: 'userId'
    })
  );
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

/** generates return message for client
 *
 * @param data data sent by client
 * @returns {{status: string,
 *            type: string,
 *            }}
 */
const processData = (data) => {
  let result = { status: 'success', type: '' };
  switch (data.action) {
    //Always is X and stars new game
    case 'newGame': {
      const gameId = crypto.randomUUID();
      games.set(gameId, {
        X: data.userId,
        O: null,
        board: new Array(9),
        next: 'X'
      });
      result.type = 'newGame';
      result.gameId = gameId;
      result.game = games.get(gameId);
      result.message = 'New game started';
      break;
    }
    //Always is O
    case 'joinToGame': {
      result.type = 'joinedGame';
      const game = games.get(data.gameId);
      if (game && !game.O) {
        games.set(data.gameId, { ...games.get(data.gameId), O: data.userId });
        result.game = {
          gameId: data.gameId,
          ...games.get(data.gameId)
        };
        result.gameId = data.gameId;
        result.message = 'Added to game';
      } else {
        result.status = 'error';
        result.message = 'Game does not exist or is in play.';
      }
      break;
    }
    case 'move': {
      result.type = 'move';
      const game = games.get(data.gameId);
      game.board = data.game.board;
      game.next = game.next === 'X' ? 'O' : 'X';
      games.set(data.gameId, game);
      result.game = { ...game, gameId: data.gameId };
      result.message = 'Player made a move';
      if (game[data.game.next]) {
        result.sendTo = game.next === 'X' ? game.X : game.O;
      } else {
        result.status = 'error';
        result.message = 'invalid move';
      }
      break;
    }
    case 'playerDisconnected': {
      result.type = 'playerDisconnected';
      result.message = 'Player disconnected!';
      break;
    }
    case 'newGameAgain': {
      // user sends gameId and userId
      result.type = 'newGameAgain';
      const game = games.get(data.gameId);
      //const playersSymbol = game.X === data.userId ? "X": "O";
      result.sendTo = game.X === data.userId ? game.O : game.X;
      game.next = 'X';
      game.board = new Array(9);
      games.set(game.gameId, game);
      result.game = { ...game, gameId: data.gameId };
      break;
    }
    default: {
      result.status = 'error';
      result.message = 'unknown error';
      break;
    }
  }
  return result;
};

const findGameByPlayer = (userId) => {
  for (const [gameId, game] of games) {
    if (game.X === userId || game.O === userId) {
      return games.get(gameId);
    }
  }
  return null;
};

app.get('/rankings', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, wins, losses FROM players ORDER BY wins DESC LIMIT 5'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
