const searchContainerResults = document.getElementById(
  "search-container-results",
);
const searchContainerInner = document.getElementById("search-container-inner");

const searchBtn = document.getElementById("search-btn");
const movieForm = document.getElementById("movie-form");
const movieInput = document.getElementById("movie-input");

const checkImageUrl = async function (url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Fonction pour rechercher des films en fonction du titre
const fetchMoviesId = async function (input) {
  const inputSearch = input.trim();
  searchContainerResults.innerHTML = `
    <img class="loading" src="loading.gif" />
  `;

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=bea04c0d&s=${inputSearch}`,
    );

    if (res.status === 404) {
      throw new Error(`Something went wrong - Response Status: ${res.status}`);
    }

    const data = await res.json();

    if (data.Response === "False") {
      throw new Error(
        `Unable to find what you're looking for. Please try another search.`,
      );
    }

    const moviesId = data.Search.map((movie) => movie.imdbID);

    return moviesId;
  } catch (err) {
    if (err.message.includes("fetch") || err.name === "TypeError") {
      searchContainerResults.innerHTML = `
       <div class="search-container" id="search-container">
          <div
            class="container search-container-inner"
            id="search-container-inner"
          >
            <p>Impossible de joindre le serveur  - Vérifier votre connexion internet</p>
          </div>
        </div>
      `;
    } else {
      searchContainerResults.innerHTML = `
        <div class="search-container" id="search-container">
          <div
            class="container search-container-inner"
            id="search-container-inner"
          >
            <p>${err.message}</p>
          </div>
        </div>
      `;
    }

    return null;
  }
};

const fetchMovies = async function (arr) {
  //
  if (!arr) return;

  const res = (
    await Promise.allSettled(
      arr.map((id) => {
        return fetch(`https://www.omdbapi.com/?apikey=bea04c0d&i=${id}`);
      }),
    )
  ).filter((res) => res.status === "fulfilled");

  const data = (
    await Promise.allSettled(res.map((res) => res.value.json()))
  ).map((res) => res.value);

  const movies = (
    await Promise.all(
      data.map(async (movie) => {
        const isValid = await checkImageUrl(movie.Poster);
        return isValid ? movie : null;
      }),
    )
  ).filter((mov) => mov !== null);

  return movies;
};

const createMovies = function (movies) {
  //
  if (!movies) return;
  return movies
    .map((movie) => {
      return `
            <div class="search-movie">
              <div class="movie-img">
                <img src="${movie.Poster}" alt="Poster of ${movie.title}">
              </div>

              <div class="movie-content">
                <div class="movie-content-heading">
                  <p class="title">${movie.Title}</p>
                  <p class="rating">
                    <i class="fa-solid fa-star"></i>
                    ${movie.imdbRating}
                  </p>
                </div>

                <div class="movie-content-details">
                  <p>${movie.Runtime}</p>
                  <p>${movie.Genre}</p>
                </div>

                <p class="description">${movie.Plot}</p>

                <button class="add-btn" data-imdbID="${movie.imdbID}">
                  <i class="fa-solid fa-circle-plus"></i>
                  Watchlist
                </button>
              </div>
            </div>
          `;
    })
    .join("");
};

const renderMovies = function (movies) {
  if (!movies) return;
  searchContainerResults.innerHTML = createMovies(movies);
};

const saveImdbid = function (id) {
  // Récupérer les données dans localStorage
  const movies = JSON.parse(localStorage.getItem("movies"));

  // Vérifier si l'array movies existe
  if (movies) {
    // S'il existe, vérifier si l'id fait partie de la liste
    const movieId = movies.includes(id);

    // S'il n'existe pas, l'ajouter
    if (!movieId) movies.push(id);

    // Sauvegarder le nouveau tableau movies
    localStorage.setItem("movies", JSON.stringify(movies));
  } else {
    // S'il n'existe pas le créer
    const movies = [];

    // Enregistre l'id du film
    movies.push(id);

    // Sauvegarder le nouveau tableau movies
    localStorage.setItem("movies", JSON.stringify(movies));
  }
};

movieForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const ids = await fetchMoviesId(movieInput.value);

  if (!ids) return;

  const movies = await fetchMovies(ids);

  renderMovies(movies);
});

searchContainerResults.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-btn");

  if (!btn) return;

  const id = btn.dataset.imdbid;

  saveImdbid(id);
});
