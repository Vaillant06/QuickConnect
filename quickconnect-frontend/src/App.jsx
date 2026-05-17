import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateNeedPage from "./pages/CreateNeedPage/CreateNeedPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import VolunteerPage from "./pages/VolunteersPage/VolunteersPage"

import "./App.css";

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-need" element={<CreateNeedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/volunteers" element={<VolunteerPage />} />
    </Routes>
  </Router>;
}

export default App;