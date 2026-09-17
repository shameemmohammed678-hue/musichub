import { useEffect, useRef, useState } from "react";

import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";

import songs from "../data/songs";
import { useMusic } from "../context/MusicContext";

function Player() {
  const { currentSong, setCurrentSong } = useMusic();

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Mobile Now Playing screen
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  // When a new song is selected
  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Open Now Playing screen on mobile
      setIsNowPlayingOpen(true);

      audioRef.current.load();

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });

      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentSong]);

  // Add/remove body class for mobile navigation
  useEffect(() => {
    if (isNowPlayingOpen) {
      document.body.classList.add("now-playing-active");
    } else {
      document.body.classList.remove("now-playing-active");
    }

    return () => {
      document.body.classList.remove("now-playing-active");
    };
  }, [isNowPlayingOpen]);

  // No song selected
  if (!currentSong) {
    return null;
  }

  // Play / Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });
    }
  };

  // Previous song
  const handlePrevious = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex > 0) {
      const previousSong = songs[currentIndex - 1];
      setCurrentSong(previousSong);
    }
  };

  // Next song
  const handleNext = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      setCurrentSong(nextSong);
    }
  };

  // Format seconds into M:SS
  const formatTime = (time) => {
    if (isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Mute / Unmute
  const handleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted =
      !audioRef.current.muted;

    setIsMuted(audioRef.current.muted);
  };

  // Automatically play next song
  const handleSongEnded = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];

      setCurrentSong(nextSong);
    } else {
      setIsPlaying(false);
    }
  };

  // Close mobile Now Playing screen
  const handleCloseNowPlaying = () => {
    setIsNowPlayingOpen(false);
  };

  return (
    <div
      className={`player ${
        isNowPlayingOpen
          ? "now-playing-open"
          : ""
      }`}
    >

      {/* Mobile close button */}

      <button
        className="now-playing-close"
        onClick={handleCloseNowPlaying}
        aria-label="Close now playing"
        title="Close"
      >
        <ChevronDown size={25} />
      </button>


      {/* Song information */}

      <div className="player-song">

        <img
          src={currentSong.cover}
          alt={currentSong.title}
        />

        <div>
          <h4>{currentSong.title}</h4>

          <p>{currentSong.artist}</p>
        </div>

      </div>


      {/* Player controls */}

      <div className="player-controls">

        {/* Previous */}

        <button
          onClick={handlePrevious}
          aria-label="Previous song"
          title="Previous song"
        >
          <SkipBack size={20} />
        </button>


        {/* Play / Pause */}

        <button
          onClick={handlePlayPause}
          className="main-play-button"
          aria-label={
            isPlaying
              ? "Pause"
              : "Play"
          }
          title={
            isPlaying
              ? "Pause"
              : "Play"
          }
        >
          {isPlaying ? (
            <Pause
              size={21}
              fill="currentColor"
            />
          ) : (
            <Play
              size={21}
              fill="currentColor"
            />
          )}
        </button>


        {/* Next */}

        <button
          onClick={handleNext}
          aria-label="Next song"
          title="Next song"
        >
          <SkipForward size={20} />
        </button>


        {/* Progress */}

        <div className="player-progress">

          <span>
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const value =
                Number(e.target.value);

              if (audioRef.current) {
                audioRef.current.currentTime =
                  value;
              }

              setCurrentTime(value);
            }}
          />

          <span>
            {formatTime(duration)}
          </span>

        </div>

      </div>


      {/* Volume */}

      <div className="player-volume">

        <button
          onClick={handleMute}
          aria-label={
            isMuted
              ? "Unmute"
              : "Mute"
          }
          title={
            isMuted
              ? "Unmute"
              : "Mute"
          }
        >
          {isMuted ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="1"
          onChange={(e) => {

            if (audioRef.current) {
              audioRef.current.volume =
                Number(e.target.value);
            }

          }}
        />

      </div>


      {/* HTML Audio */}

      <audio
        ref={audioRef}
        src={currentSong.audio}

        onTimeUpdate={() => {

          if (audioRef.current) {
            setCurrentTime(
              audioRef.current.currentTime
            );
          }

        }}

        onLoadedMetadata={() => {

          if (audioRef.current) {
            setDuration(
              audioRef.current.duration
            );
          }

        }}

        onEnded={handleSongEnded}
      />

    </div>
  );
}

export default Player;