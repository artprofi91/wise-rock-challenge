import Square from './Square.jsx';
import { ToastContainer } from 'react-toastify';
import { notify } from '../utils/Notify.js';
export default function Board({
  game,
  isX,
  userId,
  setGame,
  isOnMove,
  winner,
  socket
}) {
  const handleClick = (i) => {
    const newBoard = [...game.board];
    //Any player is not connected
    if (!(game.X || game.O)) {
      notify('You must wait for other player!');
      return;
    }
    if (isX === (game.next === 'X') && newBoard[i] === null) {
      newBoard[i] = game.next;
      socket.send(
        JSON.stringify({
          action: 'move',
          gameId: game.gameId,
          userId: userId,
          game: { ...game, board: newBoard }
        })
      );
      setGame({
        ...game,
        board: newBoard,
        next: game.next === 'X' ? 'O' : 'X'
      });
    } else {
      notify('Wrong move!');
    }
  };

  return (
    <div className="board">
      {new Array(3).fill(0).map((_, i) => (
        <div key={i} className="board-row">
          {new Array(3).fill(0).map((_, j) => {
            const index = i * 3 + j;
            return (
              <Square
                key={index}
                value={game.board[index]}
                onSquareClick={() => handleClick(index)}
                disabled={!(isOnMove || winner)}
              />
            );
          })}
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}
