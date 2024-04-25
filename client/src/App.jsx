import { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GameBoard } from './components/GameBoard.jsx';
import { Intro } from './components/Intro.jsx';
import Rankings from './components/Rankings.jsx';
import { processMessage } from './utils/ProcessMessage.js';
import { errorToast, notify } from './utils/Notify.js';

function App() {
  const [socket, setSocket] = useState(false);
  const [userId, setUserId] = useState(null);
  const [game, setGame] = useState(null);
  useEffect(() => {
    let check = true;
    const newSocket = new WebSocket('ws://localhost:3001');

    // Connection opened
    newSocket.addEventListener('open', () => {
      notify('Connected to Websocket!');
    });

    // Listen for messages
    newSocket.addEventListener('message', (event) => {
      const json = JSON.parse(event.data);
      if (json.status !== 'error') {
        processMessage(json, setUserId, setGame, game);
        if (json.type === 'move') {
          notify(json);
        }
        notify(json.message);
      } else {
        errorToast(json.message);
        console.log(json);
      }
    });

    if (check) {
      setSocket(newSocket);
    }

    return () => {
      check = false;
      console.log('Disconnected from server.');
      newSocket.close();
    };
  }, []);

  return (
    <>
      <h1>Wise Rock tic tac toe</h1>
      {!game && (
        <Intro socket={socket} userId={userId} game={game} setGame={setGame} />
      )}
      {game && (
        <GameBoard
          game={game}
          setGame={setGame}
          userId={userId}
          socket={socket}
        />
      )}
      <Rankings />
      <ToastContainer />
    </>
  );
}
//
export default App;
