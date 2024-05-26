import "./App.css";
import NavBar from "./components/navigation/NavBar/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/common/Dashboard";
import Login from "./pages/common/Login";
import Archive from "./pages/common/Archive";
import Residents from "./pages/user/Residents";
import Settings from "./pages/common/Settings";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useState, useEffect } from "react";
import theme from "./styles/colors";
import AdminNavBar from "./components/navigation/NavBar/AdminNavBar";
import Volunteer from "./pages/admin/Volunteer";
import Notification from "./pages/admin/Notification";
import Camp from "./pages/admin/Camp";
import Place from "./pages/admin/Place";

function App() {
  const { user, setUser } = useAuth();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="flex">
          <AdminNavBar />

          <div className="w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/camp" element={<Camp />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/place" element={<Place />} />
            </Routes>
          </div>
          <div className="bg-red-100 w-96"></div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
