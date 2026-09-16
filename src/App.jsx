import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Playlist from "./pages/PlayList";
import Login from "./pages/Login";
import Register from "./pages/Register";



function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}



function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Navbar />

        <div className="app-body">

          <Sidebar />

          <Routes>
          <Route path="/" element={<Home />} />

        <Route
              path="/favorites"
                         element={
                          <ProtectedRoute>
                                   <Favorites />
                               </ProtectedRoute>
                                }
          />

  <Route
    path="/playlist"
    element={
      <ProtectedRoute>
        <Playlist />
      </ProtectedRoute>
    }
  />

       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
        </div>

        <Player />

      </div>

    </BrowserRouter>
  );
}

export default App;