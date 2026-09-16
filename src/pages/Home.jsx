import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import songs from "../data/songs";
import { Music2 } from "lucide-react";

function Home() {
  const { searchQuery } = useMusic();

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

        <h2>
          {searchQuery ? "Search Results" : "Popular Songs"}
        </h2>

        {filteredSongs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          <div className="songs-container">

            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default Home;