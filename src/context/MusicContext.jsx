import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { API_URL } from "../api";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const { isLoggedIn } = useAuth();

  const [currentSong, setCurrentSong] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  /*
   * Load Favorites + Playlist
   */
  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites([]);
      setPlaylist([]);
      return;
    }

    const token = localStorage.getItem(
      "musichub-access-token"
    );

    if (!token) return;

    // Load Favorites
    fetch(`${API_URL}/api/music/favorites/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        }
      })
      .catch((error) => {
        console.error(
          "Error loading favorites:",
          error
        );
      });

    // Load Playlist
    fetch(`${API_URL}/api/music/playlists/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlaylist(data);
        }
      })
      .catch((error) => {
        console.error(
          "Error loading playlist:",
          error
        );
      });

  }, [isLoggedIn]);

  /*
   * Toggle Favorite
   */
  const toggleFavorite = async (song) => {
    if (!isLoggedIn) {
      return;
    }

    const token = localStorage.getItem(
      "musichub-access-token"
    );

    try {
      const response = await fetch(
        `${API_URL}/api/music/favorites/`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            song_id: song.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setFavorites((prevFavorites) => {
        const alreadyFavorite = prevFavorites.some(
          (favorite) => favorite.id === song.id
        );

        if (alreadyFavorite) {
          return prevFavorites.filter(
            (favorite) => favorite.id !== song.id
          );
        }

        return [...prevFavorites, song];
      });

    } catch (error) {
      console.error(
        "Error updating favorite:",
        error
      );
    }
  };

  /*
   * Toggle Playlist
   */
  const togglePlaylist = async (song) => {
    if (!isLoggedIn) {
      return;
    }

    const token = localStorage.getItem(
      "musichub-access-token"
    );

    try {
      const response = await fetch(
        `${API_URL}/api/music/playlists/`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            song_id: song.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setPlaylist((prevPlaylist) => {
        const alreadyInPlaylist = prevPlaylist.some(
          (item) => item.id === song.id
        );

        if (alreadyInPlaylist) {
          return prevPlaylist.filter(
            (item) => item.id !== song.id
          );
        }

        return [...prevPlaylist, song];
      });

    } catch (error) {
      console.error(
        "Error updating playlist:",
        error
      );
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,

        favorites,
        toggleFavorite,

        playlist,
        togglePlaylist,

        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}

export default MusicProvider;