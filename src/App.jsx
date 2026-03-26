import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Dashboard from "./dashboard";
import MovieDetails from "./MovieDetails";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;