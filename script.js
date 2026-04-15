// ✅ API CONFIG
const API_KEY = "0116eadbeb85dd7ca5aec701cbf704e1";
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

let currentTrailer = "";
let currentTitle = "";

// ================= LOGIN =================
function showLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

// ================= LOAD MOVIES =================
async function loadMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();

  displayMovies(data.results);
}

// ================= DISPLAY =================
function displayMovies(movies) {
  const container = document.getElementById("movieList");
  container.innerHTML = "";

  movies.slice(0, 12).forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("poster");

    const img = movie.poster_path
      ? POSTER_BASE + movie.poster_path
      : "https://via.placeholder.com/150";

    const title = movie.title.replace(/'/g, "");
    const overview = (movie.overview || "").replace(/'/g, "");

    div.setAttribute("data-title", title.toLowerCase());

    div.innerHTML = `
      <img src="${img}">
      <div class="overlay">
        <button onclick="event.stopPropagation(); openMovie(${movie.id}, '${title}', '${movie.vote_average}', '${overview}')">▶</button>
      </div>
    `;

    // 🔥 CLICK
    div.onclick = () => {
      openMovie(movie.id, title, movie.vote_average, overview);
    };

    // 🔥 HOVER PREVIEW
    div.onmouseenter = () => {
      showPreview(title, movie.vote_average);
    };

    div.onmouseleave = () => {
      hidePreview();
    };

    container.appendChild(div);
  });
}

// ================= HOVER PREVIEW =================
function showPreview(title, rating) {
  document.getElementById("hoverTitle").innerText = title;
  document.getElementById("hoverRating").innerText = "⭐ " + rating;

  document.getElementById("hoverPreview").style.display = "block";
}

function hidePreview() {
  document.getElementById("hoverPreview").style.display = "none";
}

// ================= GET TRAILER =================
async function getTrailer(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  const trailer = data.results.find(
    vid => vid.type === "Trailer" && vid.site === "YouTube"
  );

  return trailer ? trailer.key : null;
}

// ================= OPEN MOVIE =================
async function openMovie(id, title, rating, overview) {
  currentTitle = title;

  document.getElementById("movieTitle").innerText = title;
  document.getElementById("movieGenre").innerText =
    overview.slice(0, 120) + "...";
  document.getElementById("movieRating").innerText = "⭐ " + rating;

  document.getElementById("infoModal").style.display = "flex";

  currentTrailer = await getTrailer(id);
}

// ================= PLAY =================
function playFromInfo() {
  if (!currentTrailer) {
    window.open(`https://www.youtube.com/results?search_query=${currentTitle}+trailer`);
    return;
  }

  window.open(`https://www.youtube.com/watch?v=${currentTrailer}`);
}

// ================= CLOSE =================
function closeInfo() {
  document.getElementById("infoModal").style.display = "none";
}

// ================= SEARCH =================
function searchMovies() {
  let input = document.getElementById("searchBar").value.toLowerCase();
  let movies = document.querySelectorAll(".poster");

  movies.forEach(movie => {
    let title = movie.getAttribute("data-title");
    movie.style.display = title.includes(input) ? "block" : "none";
  });
}

// ================= INIT =================
loadMovies();