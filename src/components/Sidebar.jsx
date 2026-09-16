import { NavLink } from "react-router-dom";
import { Home, Heart, ListMusic } from "lucide-react";

function Sidebar() {
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
      </ul>
    </aside>
  );
}

export default Sidebar;