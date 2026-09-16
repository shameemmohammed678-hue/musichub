import { Music2, Search, UserCircle, LogOut } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { searchQuery, setSearchQuery } = useMusic();
  const { user, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <Music2 size={24} />
        <span>MusicHub</span>
      </div>

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="profile">

        {isLoggedIn ? (
          <>
            <UserCircle size={25} />

            <span className="username">
              {user.username}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={19} />
            </button>
          </>
        ) : (
          <button
            className="login-nav-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;