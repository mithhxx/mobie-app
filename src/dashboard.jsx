import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const Dashboard = () => {

  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [search, setSearch] = useState("");
  const [banner, setBanner] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");

  const API_KEY = "5c935d576c2794b06647ddfa8fe90c49";
  const navigate = useNavigate();

  const clickTimeout = useRef(null); // 🔥 NEW

  // 🎬 FETCH
  useEffect(() => {

    if (search) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}`)
        .then(res => res.json())
        .then(data => {
          setTrending(data.results || []);
          setBanner(data.results?.[0]);
        });
    } else {

      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          setTrending(data.results);
          setBanner(data.results[0]);
        });

      fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => setTopRated(data.results));
    }

  }, [search]);

  // 🎥 TRAILER
  const handleTrailer = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie.title || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        });
    }
  };

  // 🖱 SINGLE CLICK
  const handleClick = (movie) => {
    clickTimeout.current = setTimeout(() => {
      handleTrailer(movie);
    }, 250);
  };

  // 🖱🖱 DOUBLE CLICK
  const handleDoubleClick = (movie) => {
    clearTimeout(clickTimeout.current);
    navigate(`/movie/${movie.id}`);
  };

  const opts = {
    height: "400",
    width: "100%",
    playerVars: { autoplay: 1 }
  };

  return (
    <div className="container">

      {/* 🔝 NAVBAR */}
      <div className="navbar">
        <h2 className="logo">🎬 MOVIFY</h2>

        <div className="nav-links">
          <span>Movies</span>
        
        </div>

        <input
          placeholder="Search..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🎬 BANNER */}
      {banner && (
        <div
          className="banner"
          style={{
            background:`url(https://image.tmdb.org/t/p/original${banner.backdrop_path}) center/cover`
          }}
        >
          <div className="banner-content">
            <h1>{banner.title}</h1>
            <p>{banner.overview?.slice(0,120)}...</p>

            <button className="play-btn" onClick={() => handleTrailer(banner)}>
              ▶ Play
            </button>
          </div>
        </div>
      )}

      {/* 🎥 TRAILER */}
      {trailerUrl && (
        <div className="trailer-box">
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}

      {/* 🎞 TRENDING */}
      <h2>🔥 Trending</h2>
      <div className="row">
        {trending.map(movie => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}

            onClick={() => handleClick(movie)}         // 🔥 updated
            onDoubleClick={() => handleDoubleClick(movie)} // 🔥 updated
          />
        ))}
      </div>

      {/* ⭐ TOP RATED */}
      {!search && (
        <>
          <h2>⭐ Top Rated</h2>
          <div className="row">
            {topRated.map(movie => (
              <img
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}

                onClick={() => handleClick(movie)}         // 🔥 updated
                onDoubleClick={() => handleDoubleClick(movie)} // 🔥 updated
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;