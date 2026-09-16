import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { Heart } from "lucide-react";

function Favorites() {
  const { favorites } = useMusic();

  return (
    <main className="main-content">

      <section className="hero">
        <h1>
             <Heart size={30} />
                <span>Your Favorites</span>
        </h1>
        <p>Songs you have added to your favorites.</p>
      </section>

      <section className="songs-section">

        <h2>Favorite Songs</h2>

        {favorites.length === 0 ? (
          <p>No favorite songs yet.</p>
        ) : (
          <div className="songs-container">

            {favorites.map((song) => (
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

export default Favorites;