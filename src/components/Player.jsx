import { useEffect, useRef, useState } from "react";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import songs from "../data/songs";
import { useMusic } from "../context/MusicContext";

function Player() {
  const { currentSong, setCurrentSong } = useMusic();

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const[currentTime,setCurrentTime] = useState(0);
  const[duration,setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
  if (currentSong) {
    audioRef.current.load();
    audioRef.current.play();
    setIsPlaying(true);
  }
}, [currentSong]);

  if (!currentSong) {
    return (
      <div className="player">
        <p>No song selected</p>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const handlePrevious = () => {
  const currentIndex = songs.findIndex(
    (song) => song.id === currentSong.id
  );

  if (currentIndex > 0) {
    const previousSong = songs[currentIndex - 1];

    setCurrentSong(previousSong);
  }
};


const handleNext = () => {
  const currentIndex = songs.findIndex(
    (song) => song.id === currentSong.id
  );

  if (currentIndex < songs.length - 1) {
    const nextSong = songs[currentIndex + 1];

    setCurrentSong(nextSong);
  }
};

const formatTime = (time) => {
  if (isNaN(time)) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};


    const handleMute = () => {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };


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



  return (
  <div className="player">
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

    <div className="player-controls">
      <button
        onClick={handlePrevious}
        aria-label="Previous song"
        title="Previous song"
      >
        <SkipBack size={20} />
      </button>

      <button
        onClick={handlePlayPause}
        className="main-play-button"
        aria-label={isPlaying ? "Pause" : "Play"}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={21} fill="currentColor" />
        ) : (
          <Play size={21} fill="currentColor" />
        )}
      </button>

      <button
        onClick={handleNext}
        aria-label="Next song"
        title="Next song"
      >
        <SkipForward size={20} />
      </button>

      <div className="player-progress">
        <span>{formatTime(currentTime)}</span>

        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
          }}
        />

        <span>{formatTime(duration)}</span>
      </div>
    </div>

    <div className="player-volume">
      <button
        onClick={handleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute" : "Mute"}
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
          audioRef.current.volume = e.target.value;
        }}
      />
    </div>

    <audio
      ref={audioRef}
      src={currentSong.audio}
      onTimeUpdate={() =>
        setCurrentTime(audioRef.current.currentTime)
      }
      onLoadedMetadata={() =>
        setDuration(audioRef.current.duration)
      }
      onEnded={handleSongEnded}
    />
  </div>
);
}

export default Player;