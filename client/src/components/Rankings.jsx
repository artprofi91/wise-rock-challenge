import React, { useEffect, useState } from 'react';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/rankings')
      .then((response) => response.json())
      .then((data) => setRankings(data))
      .catch((error) => console.error('Error fetching rankings:', error));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-2">Top Players</h2>
      <ul>
        {rankings.map((player, index) => (
          <li key={index} className="bg-white rounded shadow p-2 mb-2">
            {player.name}: {player.wins} Wins, {player.losses} Losses
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rankings;
