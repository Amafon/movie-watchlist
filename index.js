const addBtn = document.getElementById("add-btn");
const searchContainerResults = document.getElementById(
  "search-container-results",
);
const searchBtn = document.getElementById("search-btn");
const movieForm = document.getElementById("movie-form");
const movieInput = document.getElementById("movie-input");

// movieForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   alert(movieInput.value);
// });

const searchMovie = async function (url) {
  const response = await fetch(url);
  const movie = await response.json();
  //   console.log(movie);
  return movie;
};

const renderMovie = function (movie) {
  let movieHtml = `
        <div class="search-movie">
            <div class="movie-img">
              <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
              />
            </div>
            <div class="movie-content">
              <div class="movie-content-heading">
                <p class="title">${movie.Title}</p>
                <p class="rating">
                  <i></i
                  ><span class="rating-score"
                    ><i class="fa-solid fa-star"></i>${movie.imdbRating}</span
                  >
                </p>
              </div>
              <div class="movie-content-details">
                <p class="runtime">${movie.Runtime}</p>
                <p class="genre">${movie.Genre}</p>
              </div>
              <p class="description">
                ${movie.Plot}
              </p>
              <button class="add-btn" id="add-btn" data-uuid="${crypto.randomUUID()}">
                <i class="fa-solid fa-circle-plus"></i>Watchlist
              </button>
            </div>
          </div>
    `;
  return movieHtml;
};

movieForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  /* Get Movie Data */
  const movie = await searchMovie(
    `http://www.omdbapi.com/?apikey=bea04c0d&t=${movieInput.value}`,
  );

  console.log(movie);

  /* Render Movie to DOM */
  searchContainerResults.innerHTML = renderMovie(movie);
});
