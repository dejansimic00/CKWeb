import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/common/Dashboard";
import Login from "./pages/common/Login";
import Archive from "./pages/common/Archive";
import Residents from "./pages/user/Residents";
import Settings from "./pages/common/Settings";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/navigation/NavBar/NavBar";
import Volunteer from "./pages/admin/Volunteer";
import Notification from "./pages/common/Notification";
import Camp from "./pages/admin/Camp";
import Place from "./pages/admin/Place";
import { useEffect } from "react";
import { useSessionStorage } from "./hooks/useSessionStorage";

function MainLayout() {
  const location = useLocation();
  const { getItem } = useSessionStorage();
  const navigate = useNavigate();

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (!getItem("token") && location.pathname !== "/login") {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex">
      {/* Conditionally render NavBar based on the current path */}
      {location.pathname !== "/login" && <NavBar />}

      <div className="w-full ">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/camp" element={<Camp />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/place" element={<Place />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const { user, setUser } = useAuth();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <MainLayout />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
