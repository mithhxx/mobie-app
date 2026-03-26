import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  const API_KEY = "5c935d576c2794b06647ddfa8fe90c49";

  useEffect(() => {

    // 🎬 Movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovie(data));

    // 👨‍🎤 Cast details
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast(data.cast || []));

  }, [id]);

  if (!movie) return <h2 style={{color:"white"}}>Loading...</h2>;

  return (
    <div style={{
      background:"#111",
      color:"white",
      minHeight:"100vh",
      padding:"20px"
    }}>

      {/* 🔙 Back */}
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h1>{movie.title}</h1>

      <p>⭐ {movie.vote_average}</p>
      <p>📅 {movie.release_date}</p>

      <p style={{maxWidth:"600px"}}>{movie.overview}</p>

      {/* 🎭 CAST SECTION */}
      <h2>Actors</h2>

      <div style={{
        display:"flex",
        gap:"15px",
        overflowX:"scroll"
      }}>

        {cast.slice(0, 10).map(actor => (

          <div key={actor.id} style={{textAlign:"center"}}>

            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/100"
              }
              alt={actor.name}
              style={{borderRadius:"10px"}}
            />

            <p>{actor.name}</p>
            <small>{actor.character}</small>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MovieDetails;