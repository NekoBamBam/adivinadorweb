import { useState } from "react";

const songs = [
  { id: "3JZ4pnNtyxQ", title: "Bad Bunny - Tití Me Preguntó" },
  { id: "CuklIb9d3fI", title: "Shakira - BZRP Music Sessions #53" },
  { id: "fJ9rUzIMcZQ", title: "Queen - Bohemian Rhapsody" },
  { id: "hTWKbfoikeg", title: "Nirvana - Smells Like Teen Spirit" },
  { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You" },
  { id: "9bZkp7q19f0", title: "PSY - Gangnam Style" },
];

async function getVideoData(videoId) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items.length) return null;

  const video = data.items[0];

  return {
    id: videoId,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    views: parseInt(video.statistics.viewCount, 10),
  };
}

function VideoCard({ video, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-white shadow-md rounded-xl p-4 m-2 hover:scale-105 transition"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="rounded-lg mb-2 w-full"
      />
      <h3 className="font-bold text-lg">{video.title}</h3>
      <p className="text-gray-600 text-sm">
        Publicado: {new Date(video.publishedAt).toLocaleDateString()}
      </p>
    </button>
  );
}

export default function Game() {
  const [pair, setPair] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  async function startGame() {
    const randomPair = songs.sort(() => 0.5 - Math.random()).slice(0, 2);
    const videos = await Promise.all(randomPair.map((s) => getVideoData(s.id)));

    setPair(videos);
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
        `✅ ¡Acertaste! "${winner.title}" tiene ${winner.views.toLocaleString()} vs ${loser.views.toLocaleString()}`
      );

      // Buscar un retador distinto al ganador
      let challenger;
      do {
        challenger = songs[Math.floor(Math.random() * songs.length)];
      } while (challenger.id === winner.id);

      const challengerData = await getVideoData(challenger.id);

      setPair([winner, challengerData]);
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
    <div className="h-screen flex flex-col text-center p-4">
      {/* Puntaje siempre visible */}
      <div className="text-lg font-bold mb-2">Puntaje: {score}</div>

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
          {pair.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => choose(video)}
            />
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
    </div>
  );
}
