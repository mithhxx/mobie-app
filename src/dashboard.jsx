import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./dashboard.css";

const Dashboard = () => {

  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [banner, setBanner] = useState(null);

  const API_KEY = "5c935d576c2794b06647ddfa8fe90c49";

  // 🎬 FETCH ALL DATA
  useEffect(() => {

    let url = "";

    if (search) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}`;
    } else if (language === "all") {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${language}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let sorted = (data.results || []).sort(
          (a, b) => new Date(b.release_date || "2000") - new Date(a.release_date || "2000")
        );

        setMovies(sorted);

        if (sorted.length > 0) {
          setBanner(sorted[0]);
        }
      })
      .catch(err => console.log("Movie fetch error:", err));

    // 🔥 Trending
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setTrending(data.results || []))
      .catch(err => console.log("Trending error:", err));

    // ⭐ Top Rated
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setTopRated(data.results || []))
      .catch(err => console.log("Top rated error:", err));

  }, [search, language]);

  // 🎥 CLICK FUNCTION
  const handleClick = (movie) => {

    // toggle close
    if (selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(null);
      setTrailerUrl("");
      setCast([]);
      return;
    }

    setSelectedMovie(movie);

    // 🎬 Trailer
    movieTrailer(movie.title || "")
      .then(url => {
        if (!url) return;
        const params = new URLSearchParams(new URL(url).search);
        setTrailerUrl(params.get("v"));
      })
      .catch(() => setTrailerUrl(""));

    // 🎭 Cast
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast((data.cast || []).slice(0, 10)))
      .catch(err => console.log("Cast error:", err));
  };

  const opts = {
    height: "350",
    width: "100%",
    playerVars: { autoplay: 1 }
  };

  return (
    <div className="container">

      {/* 🔝 NAVBAR */}
      <div className="navbar">
        <h2 className="logo">🎬 MOVIFY</h2>

        <input
          className="search"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="nav-links">
          <span onClick={() => setLanguage("all")}>All</span>
          <span onClick={() => setLanguage("kn")}>Kannada</span>
          <span onClick={() => setLanguage("hi")}>Hindi</span>
          <span onClick={() => setLanguage("te")}>Telugu</span>
          <span onClick={() => setLanguage("ml")}>Malayalam</span>
          <span onClick={() => setLanguage("en")}>Hollywood</span>
        </div>
      </div>

      {/* 🎬 BANNER */}
      {banner && banner.backdrop_path && (
        <div
          className="banner"
          style={{
            background: `url(https://image.tmdb.org/t/p/original${banner.backdrop_path}) center/cover`
          }}
        >
          <div className="banner-content">
            <h1>{banner.title}</h1>
            <button className="play-btn" onClick={() => handleClick(banner)}>▶ Play</button>
          </div>
        </div>
      )}

      {/* 🎥 TRAILER */}
      {trailerUrl && (
        <div className="trailer-box">
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}

      {/* 🔥 LATEST */}
      <h2>🔥 Latest Movies</h2>
      <div className="row">
        {movies.map(movie => (
          movie.poster_path && (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              onClick={() => handleClick(movie)}
            />
          )
        ))}
      </div>

      {/* 🔥 TRENDING */}
      <h2>🔥 Trending</h2>
      <div className="row">
        {trending.map(movie => (
          movie.poster_path && (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              onClick={() => handleClick(movie)}
            />
          )
        ))}
      </div>

      {/* ⭐ TOP RATED */}
      <h2>⭐ Top Rated</h2>
      <div className="row">
        {topRated.map(movie => (
          movie.poster_path && (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              onClick={() => handleClick(movie)}
            />
          )
        ))}
      </div>

      {/* 📄 DETAILS */}
      {selectedMovie && (
        <div className="movie-details">

          <h2>🎬 Movie Details</h2>

          <div className="details-box">
            <img src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`} alt="" />
            <div className="info">
              <h1>{selectedMovie.title}</h1>
              <p>{selectedMovie.overview}</p>
            </div>
          </div>

          {/* 🎭 CAST */}
          <h2>🎭 Cast</h2>
          <div className="cast-row">
            {cast.map(actor => (
              <div key={actor.id} className="cast-card">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={actor.name}
                />
                <p className="actor-name">{actor.name}</p>
                <p className="actor-role">{actor.character}</p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;