import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Music2, Image, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";

function AdminUpload() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Only logged-in staff users can access this page
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (!user?.is_staff) {
    return (
      <main className="main-content">
        <div className="admin-upload-page">
          <h2>Access Denied</h2>
          <p>Only administrators can add songs.</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title || !artist || !audio || !cover) {
      setError("Please fill in all fields.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("cover", cover);

    try {
      setLoading(true);

      const token = localStorage.getItem("musichub-access-token");

      const response = await fetch(
        `${API_URL}/api/music/songs/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setMessage("Song uploaded successfully!");

      setTitle("");
      setArtist("");
      setAudio(null);
      setCover(null);

      document.getElementById("audio-input").value = "";
      document.getElementById("cover-input").value = "";
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="admin-upload-page">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="admin-upload-header">
          <Music2 size={28} />
          <div>
            <h1>Add New Song</h1>
            <p>Upload a song to MusicHub</p>
          </div>
        </div>

        <form
          className="admin-upload-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Song Title</label>
            <input
              type="text"
              placeholder="Enter song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Artist</label>
            <input
              type="text"
              placeholder="Enter artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <Music2 size={16} />
              MP3 File
            </label>

            <input
              id="audio-input"
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={(e) => setAudio(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>
              <Image size={16} />
              Cover Image
            </label>

            <input
              id="cover-input"
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files[0])}
            />
          </div>

          {error && (
            <p className="upload-error">
              {error}
            </p>
          )}

          {message && (
            <p className="upload-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="upload-song-button"
            disabled={loading}
          >
            <Upload size={18} />

            {loading ? "Uploading..." : "Upload Song"}
          </button>
        </form>

      </div>
    </main>
  );
}

export default AdminUpload;