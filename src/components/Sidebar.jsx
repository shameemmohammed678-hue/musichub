import { NavLink } from "react-router-dom";
import { Home, Heart, ListMusic, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <h3>MENU</h3>

      <ul>
        <li>
          <NavLink to="/">
            <Home size={18} />
            <span>Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/favorites">
            <Heart size={18} />
            <span>Favorites</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/playlist">
            <ListMusic size={18} />
            <span>Playlist</span>
          </NavLink>
        </li>

        {user?.is_staff && (
          <li>
            <NavLink to="/admin/upload">
              <PlusCircle size={18} />
              <span>Add Song</span>
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;