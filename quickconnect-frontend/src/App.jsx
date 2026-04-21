import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateNeedPage from "./pages/CreateNeedPage/CreateNeedPage";

import "./App.css";

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-need" element={<CreateNeedPage />} />
    </Routes>
  </Router>;
}

export default App;