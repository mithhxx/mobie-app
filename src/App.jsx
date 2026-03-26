import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Dashboard from "./dashboard";
import MovieDetails from "./MovieDetails";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* 🔐 Login Page */}
        <Route path="/" element={<Login />} />

        {/* 🎬 Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🎥 Movie Details */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* 🔄 Unknown URL → redirect to Login */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </HashRouter>
  );
}

export default App;