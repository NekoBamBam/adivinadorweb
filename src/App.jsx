import { useState } from "react";

const songs = [
  { id: "3JZ4pnNtyxQ", title: "Bad Bunny - Tití Me Preguntó" },
  { id: "CuklIb9d3fI", title: "Shakira - BZRP Music Sessions #53" },
  { id: "fJ9rUzIMcZQ", title: "Queen - Bohemian Rhapsody" },
  { id: "hTWKbfoikeg", title: "Nirvana - Smells Like Teen Spirit" },
  { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You" },
  { id: "9bZkp7q19f0", title: "PSY - Gangnam Style" },
];

async function getYoutubeViews(videoId) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();
  return parseInt(data.items[0].statistics.viewCount, 10);
}

export default function Game() {
  const [pair, setPair] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  async function startGame() {
    const randomPair = songs.sort(() => 0.5 - Math.random()).slice(0, 2);
    const views = await Promise.all(
      randomPair.map((song) => getYoutubeViews(song.id))
    );

    setPair([
      { ...randomPair[0], views: views[0] },
      { ...randomPair[1], views: views[1] },
    ]);
    setScore(0);
    setGameOver(false);
    setMessage("");
  }

  async function choose(song) {
    const [a, b] = pair;
    const correct =
      (song.id === a.id && a.views >= b.views) ||
      (song.id === b.id && b.views >= a.views);

    if (correct) {
      setScore(score + 1);
      const winner = a.views >= b.views ? a : b;
      const loser = a.views < b.views ? a : b;

      setMessage(
        `✅ ¡Acertaste! "${winner.title}" tiene ${winner.views.toLocaleString()} reproducciones vs ${loser.views.toLocaleString()}`
      );

      // nuevo retador
      const challenger = songs[Math.floor(Math.random() * songs.length)];
      const challengerViews = await getYoutubeViews(challenger.id);

      setPair([winner, { ...challenger, views: challengerViews }]);
    } else {
      setGameOver(true);
      const winner = a.views >= b.views ? a : b;
      const loser = a.views < b.views ? a : b;

      setMessage(
        `❌ Perdiste. "${winner.title}" tenía ${winner.views.toLocaleString()} y "${loser.title}" ${loser.views.toLocaleString()}`
      );
    }
  }

  return (
    <div className="h-screen flex flex-col text-center">
      {!pair.length && !gameOver && (
        <button
          onClick={startGame}
          className="m-auto px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Iniciar Juego
        </button>
      )}

      {pair.length > 0 && !gameOver && (
        <div className="flex flex-1">
          {pair.map((song) => (
            <button
              key={song.id}
              onClick={() => choose(song)}
              className="flex-1 flex items-center justify-center text-2xl font-bold bg-gray-200 hover:bg-gray-300 p-4"
            >
              {song.title}
            </button>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-lg">{message}</p>}

      {gameOver && (
        <div className="m-auto text-center">
          <h2 className="text-red-600 text-2xl font-bold">❌ ¡Juego terminado!</h2>
          <p className="text-xl mt-2">Tu puntaje final: {score}</p>
          <button
            onClick={startGame}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Jugar de nuevo
          </button>
        </div>
      )}

      {!gameOver && pair.length > 0 && (
        <div className="p-4 text-lg font-bold">Puntaje: {score}</div>
      )}
    </div>
  );
}
