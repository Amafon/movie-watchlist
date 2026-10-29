const searchContainerResults = document.getElementById(
  "search-container-results",
);
const searchBtn = document.getElementById("search-btn");
const movieForm = document.getElementById("movie-form");
const movieInput = document.getElementById("movie-input");
let moviesArr = [];

movieForm.addEventListener("submit", function (e) {
  e.preventDefault();

  fetch(`https://www.omdbapi.com/?apikey=bea04c0d&s=${movieInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      data.Search.forEach((mov) => {
        // Récupérer l'imdbID du premier résultat
        let searchResultID = mov.imdbID;
        // Récupérer les informations de ce film
        fetch(`https://www.omdbapi.com/?apikey=bea04c0d&i=${searchResultID}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.Poster != "N/A") {
              moviesArr.push({
                poster: data.Poster,
                title: data.Title,
                imdbRating: data.imdbRating,
                runtime: data.Runtime,
                genre: data.Genre,
                plot: data.Plot,
                imdbID: data.imdbID,
              });
            }
          });
      });
    });
  console.log(moviesArr);

  const moviesArrHTML = moviesArr
    .map((movie) => {
      return `
      <div class="search-movie">
        <div class="movie-img">
          <img
            src="${movie.poster}"
            alt="Poster of ${movie.title}"
          />
        </div>
        <div class="movie-content">
          <div class="movie-content-heading">
            <p class="title">${movie.title}</p>
            <p class="rating">
              <i></i
              ><span class="rating-score"
                ><i class="fa-solid fa-star"></i>${movie.imdbRating}</span
              >
            </p>
          </div>
          <div class="movie-content-details">
            <p class="runtime">${movie.runtime}</p>
            <p class="genre">${movie.genre}</p>
          </div>
          <p class="description">
            ${movie.plot}
          </p>
          <button class="add-btn" id="add-btn" data-imdbID="${movie.imdbID}">
            <i class="fa-solid fa-circle-plus"></i>Watchlist
          </button>
        </div>
      </div>
    `;
    })
    .join("");
  searchContainerResults.innerHTML = moviesArrHTML;
});
// ${movie.Poster}
// ${movie.Title}
// ${movie.imdbRating}
// ${movie.Runtime}
// ${movie.Genre}
// ${movie.Plot}
// ${movie.imdbID}

// const searchMovie = async function (url) {
//   const response = await fetch(url);
//   const movie = await response.json();
//   return movie;
// };

// const renderMovie = function (htmlData) {
//   searchContainerResults.innerHTML = htmlData;
// };

// const storeMovieData = function (movie) {
//   // Check if Local Storage "movies" exist
//   if (localStorage.getItem("movies")) {
//     // Get Local Storage Movies Data
//     const movies = JSON.parse(localStorage.getItem("movies"));
//     // Check if the movie we are about to add already exist in the movies array
//     const results = movies.filter((arr) => arr.imdbID === movie.imdbID);
//     if (results.length === 0) movies.push(movie);
//     // Update LocalStorage
//     localStorage.setItem("movies", JSON.stringify(movies));
//   } else {
//     // Create movies array
//     const movies = [];
//     // Save movie to movies
//     movies.push(movie);
//     // Save the key value movies in local storage
//     localStorage.setItem("movies", JSON.stringify(movies));
//   }
// };

// movieForm.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   /* Get Movie Data */
//   foundMovies = await searchMovie(
//     `https://www.omdbapi.com/?apikey=bea04c0d&s=${movieInput.value}`,
//   );

//   console.log(foundMovies);

//   /* Render Movie to DOM */
//   const foundMoviesHTML = foundMovies.Search.map((movie) => {
//     return `
//       <div class="search-movie">
//         <div class="movie-img">
//           <img
//             src="${movie.Poster}"
//             alt="Poster of ${movie.Title}"
//           />
//         </div>
//         <div class="movie-content">
//           <div class="movie-content-heading">
//             <p class="title">${movie.Title}</p>
//             <p class="rating">
//               <i></i
//               ><span class="rating-score"
//                 ><i class="fa-solid fa-star"></i>${movie.imdbRating}</span
//               >
//             </p>
//           </div>
//           <div class="movie-content-details">
//             <p class="runtime">${movie.Runtime}</p>
//             <p class="genre">${movie.Genre}</p>
//           </div>
//           <p class="description">
//             ${movie.Plot}
//           </p>
//           <button class="add-btn" id="add-btn" data-imdbID="${movie.imdbID}">
//             <i class="fa-solid fa-circle-plus"></i>Watchlist
//           </button>
//         </div>
//       </div>
//     `;
//   }).join("");

//   renderMovie(foundMoviesHTML);
// });

// searchContainerResults.addEventListener("click", function (e) {
//   e.preventDefault();
//   const btn = e.target.closest(".add-btn");
//   if (btn) {
//     /* Save Movie to localStorage*/
//     storeMovieData(movie);
//   }
// });
