import { useEffect, useState } from "react";
import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { Music2 } from "lucide-react";
import { API_URL } from "../api";

function Home() {
  const { searchQuery } = useMusic();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/music/songs/`);
        const data = await response.json();

        if (response.ok) {
          setSongs(data);
        } else {
          console.error("Failed to fetch songs:", data);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="main-content">
      <section className="hero">
        <h1>
          <Music2 size={30} />
          <span>Welcome to MusicHub</span>
        </h1>

        <p>Discover music and enjoy your favorite songs.</p>
      </section>

      <section className="songs-section">
        <h2>{searchQuery ? "Search Results" : "Popular Songs"}</h2>

        {loading ? (
          <p>Loading songs...</p>
        ) : filteredSongs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          <div className="songs-container">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;