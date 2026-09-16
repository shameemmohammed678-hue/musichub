import { Check, Heart, Play, Plus } from "lucide-react";

import { useMusic } from "../context/MusicContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SongCard({ song }) {
  const {
    setCurrentSong,
    favorites,
    toggleFavorite,
    playlist,
    togglePlaylist,
  } = useMusic();

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isFavorite = favorites.some(
    (favorite) => favorite.id === song.id
  );

  const isInPlaylist = playlist.some(
    (item) => item.id === song.id
  );

  return (
    <div className="song-card">
      <div className="song-image-container">
        <img
          src={song.cover}
          alt={song.title}
          className="song-image"
        />

        <button
          className="play-button"
          onClick={() => setCurrentSong(song)}
          aria-label={`Play ${song.title}`}
          title={`Play ${song.title}`}
        >
          <Play size={22} fill="currentColor" />
        </button>
      </div>

      <h3>{song.title}</h3>

      <p>{song.artist}</p>

      <button
        className="favorite-button"
        onClick={() => {
          if (!isLoggedIn) {
            navigate("/login");
            return;
          }

          toggleFavorite(song);
        }}
        aria-label={
          isFavorite
            ? `Remove ${song.title} from favorites`
            : `Add ${song.title} to favorites`
        }
        title={
          isFavorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        <Heart
          size={19}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>

      <button
        className="playlist-button"
        onClick={() => {
          if (!isLoggedIn) {
            navigate("/login");
            return;
          }

          togglePlaylist(song);
        }}
      >
        {isInPlaylist ? (
          <>
            <Check size={16} />
            <span>Added</span>
          </>
        ) : (
          <>
            <Plus size={16} />
            <span>Playlist</span>
          </>
        )}
      </button>
    </div>
  );
}

export default SongCard;