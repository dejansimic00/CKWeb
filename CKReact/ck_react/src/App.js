import "./App.css";
import NavBar from "./components/navigation/NavBar/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/common/Dashboard";
import Login from "./pages/common/Login";
import Archive from "./pages/common/Archive";
import Residents from "./pages/user/Residents";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useState, useEffect } from "react";

function App() {
  const { user, setUser } = useAuth();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="flex">
          <div className="w-60 h-screen bg-gray-200 fixed left-0 top-0">
            <NavBar />
          </div>
          <div className="ml-60 p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/residents" element={<Residents />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
