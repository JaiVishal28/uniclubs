import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadForm from "./pages/UploadForm";
import Home from "./pages/Home";

function App() {
return (
<Router>
<nav className="p-4 bg-gray-200 flex gap-4">
<Link to="/">Home</Link>
<Link to="/upload">Upload Event</Link>
</nav>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/upload" element={<UploadForm />} />
</Routes>
</Router>
);
}

export default App;