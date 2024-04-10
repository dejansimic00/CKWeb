import React from "react";
import './App.css';
import {  BrowserRouter as Router,  Routes,  Route,} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Teams from "./pages/team";
function App() {
  return (
    <Router>
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
                
                
            </Routes>
        </Router>
  );
}

export default App;
