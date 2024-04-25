import { useEffect, useState } from 'react';

export function Intro({ socket, userId }) {
  const [showInput, setShowInput] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [loadingText, setLoadingText] = useState('Connecting to server.');

  useEffect(() => {
    const updateLoadingText = () => {
      setLoadingText((prevText) => {
        const numberOfDots = (prevText.match(/\./g) || []).length + 1;
        if (numberOfDots < 4) {
          return prevText.concat('.');
        }
        return `Connecting to server.`;
      });
    };

    const intervalId = setInterval(updateLoadingText, 500);

    return () => clearInterval(intervalId);
  }, []);
  const handleNewGame = () => {
    socket.send(JSON.stringify({ action: 'newGame', userId: userId }));
  };
  const handleJoinGame = (e) => {
    e.preventDefault();
    socket.send(
      JSON.stringify({
        action: 'joinToGame',
        userId: userId,
        gameId: gameCode
      })
    );
  };

  return (
    <>
      <div className="intro">
        <button
          className="intro-button"
          onClick={handleNewGame}
          disabled={socket.readyState === WebSocket.CONNECTING}
        >
          Start New Game
        </button>
        <button
          className="intro-button"
          onClick={() => {
            setShowInput(true);
          }}
          disabled={!socket || socket.readyState === WebSocket.CONNECTING}
        >
          Join Game
        </button>
      </div>
      {!socket ||
        (socket.readyState === WebSocket.CONNECTING && <p>{loadingText}</p>)}
      {showInput && (
        <>
          <label>Game code:</label>
          <form onSubmit={handleJoinGame}>
            <input onChange={(e) => setGameCode(e.target.value)} />
          </form>
        </>
      )}
    </>
  );
}
