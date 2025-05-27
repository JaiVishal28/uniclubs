import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadForm from "./pages/UploadForm";
import './App.css';
import './index.css';
import Home from "./pages/Home";
import CreatePoster from "./pages/CreatePoster";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>🎓 UniClubs</h1>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/upload">Upload Event</Link>
            <Link to="/poster">Create Poster</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/poster" element={<CreatePoster />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} UniClubs. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
