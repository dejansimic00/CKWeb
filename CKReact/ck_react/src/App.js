import "./App.css";
import NavBar from "./components/navigation/NavBar/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/common/Dashboard";
import Archive from "./pages/common/Archive";
import Residents from "./pages/user/Residents";

function App() {
  return (
    <Router>
      <div className="flex">
        <div className="w-60 h-screen bg-gray-200 fixed left-0 top-0">
          <NavBar />
        </div>
        <div className="ml-60 p-4">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/residents" element={<Residents />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
