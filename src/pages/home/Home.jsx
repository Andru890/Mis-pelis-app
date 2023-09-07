import React, { useEffect, useState } from "react";
import axios from "axios";
import CardMovie from "../../common/cardMovie/CardMovie";
import styles from "./Home.module.css";
import Header from "../../common/header/Header";
import confetti from "canvas-confetti";
import { Button } from "@mui/material";
import CreateMovieModal from "../../common/createMovieModal/CreateMovieModal";




const Home = () => {
  const [movies, setMovies] = useState([]);
  const [dispatchLike, setDispatchLike] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMovieCreate, setIsMovieCreate] = useState(false)
  const [isMovieDelete, setIsMovieDelete] = useState(false)
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.log(err));
      setDispatchLike(false)
      setIsMovieCreate(false)
  }, [dispatchLike, isMovieCreate, isMovieDelete]);

  const handleLike = (movie) => {
    if (!movie.isLiked) {
      confetti({
        zIndex: 999,
        particleCount: 300,
        spread: 190,
        angle: -80,
        origin: {
          x: 1,
          y: 0,
        },
      });
    }

    axios
      .patch(`http://localhost:5000/movies/${movie.id}`, {
        isLiked: !movie.isLiked
      })
      .then((res) => setDispatchLike(true))
      .catch(err => console.log(err))
      
  }; 

  const moviesFiltered = movies.filter(movie => movie.isLiked);
  const deleteMovieById= (id)=> {
    axios.delete(`http://localhost:5000/movies/${id}`)
    .then(res => setIsMovieDelete(res))
    .catch(err => console.log(err))
  }

  return (
    <>
    <Header setFavorite={setFavorite}/>
    <Button onClick={handleOpen}>AGREGA TU PELICULA</Button>
    <CreateMovieModal open={open} handleClose={handleClose} setIsMovieCreate= {setIsMovieCreate} />
      <div className={styles.containerCards}>
        {
          !favorite ? (
            movies.map((movie) => {
              return (
                <CardMovie
                  movie={movie}
                  key={movie.id}
                  handleLike={handleLike}
                  deleteMovieById= {deleteMovieById}
                  />
                 
              )
            })
          ): (
            moviesFiltered.map((movie) => {
              return (
                <CardMovie
                  movie={movie}
                  key={movie.id}
                  handleLike={handleLike}
                  deleteMovieById= {deleteMovieById}
                  />
                 
              )
            })
          )
        }
      </div>
    </>
  );
};

export default Home;


/**
 * *CREATE (post) READ (get) UPDATE (put o patch) DELETE (delete) ---> CRUD ---> ABM (alta baja y modificación)
 */