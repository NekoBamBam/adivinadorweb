import { useState } from "react";

// Componente principal
export default function App() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [videos, setVideos] = useState([]); // acá se guardarán los dos videos de la ronda
  const [selected, setSelected] = useState(null);

  // TODO: función para traer 2 videos desde la API de YouTube
  const fetchVideos = async () => {
    // por ahora simulo con datos dummy
    const dummyVideos = [
      {
        id: "1",
        title: "Canción A",
        thumbnail: "https://via.placeholder.com/150",
        views: 1000,
      },
      {
        id: "2",
        title: "Canción B",
        thumbnail: "https://via.placeholder.com/150",
        views: 5000,
      },
    ];
    setVideos(dummyVideos);
    setSelected(null);
  };

  // inicializar primera ronda
  const startGame = () => {
    setScore(0);
    setRound(1);
    fetchVideos();
  };

  // cuando el usuario elige una canción
  const handleChoice = (choiceId) => {
    setSelected(choiceId);
    const [a, b] = videos;
    const winner = a.views > b.views ? a.id : b.id;
    if (choiceId === winner) {
      setScore((prev) => prev + 1);
    }
  };

  // pasar a la siguiente ronda
  const nextRound = () => {
    setRound((prev) => prev + 1);
    fetchVideos();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">🎵 Adivina la más vista</h1>
      {videos.length === 0 ? (
        <button
          onClick={startGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
        >
          Iniciar juego
        </button>
      ) : (
        <div className="w-full max-w-md">
          <p className="mb-2">Ronda: {round} | Puntaje: {score}</p>
          <div className="grid grid-cols-2 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`p-2 border rounded-xl shadow cursor-pointer hover:scale-105 transition ${
                  selected === video.id ? "border-green-500" : ""
                }`}
                onClick={() => handleChoice(video.id)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="rounded mb-2"
                />
                <p className="text-sm font-semibold text-center">{video.title}</p>
                {selected && (
                  <p className="text-xs text-center mt-1">
                    👁 {video.views.toLocaleString()} views
                  </p>
                )}
              </div>
            ))}
          </div>
          {selected && (
            <button
              onClick={nextRound}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow"
            >
              Siguiente ronda
            </button>
          )}
        </div>
      )}
    </div>
  );
}
