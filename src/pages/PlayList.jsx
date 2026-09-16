import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { ListMusic } from "lucide-react"

function Playlist() {
  const { playlist } = useMusic();

  return (
    <main className="main-content">

      <section className="hero">
        <h1>
             <ListMusic size={30} />
             <span>Your Playlist</span>
        </h1>
        <p>Songs you have added to your playlist.</p>
      </section>

      <section className="songs-section">

        <h2>My Playlist</h2>

        {playlist.length === 0 ? (
          <p>Your playlist is empty.</p>
        ) : (
          <div className="songs-container">

            {playlist.map((song) => (
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

export default Playlist;