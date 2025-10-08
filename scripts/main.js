// ---------- Mock data (replace with your API) ----------
const slides = [
  {
    title: "Late winner stuns champions in dramatic finish",
    excerpt:
      "A stoppage-time strike secures a stunning victory in front of 70k fans.",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=60",
  },
  {
    title: "Star batter reaches century in record chase",
    excerpt:
      "A masterclass with bat sees the home side chase down a big total.",
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1600&q=60",
  },
  {
    title: "Tennis ace withdraws through injury before semis",
    excerpt:
      "An ankle injury forces a last-minute withdrawal, reshaping the draw.",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=60",
  },
];

const headlines = [
  "Man City 3-0 Newcastle — Sterling brace",
  "England name squad for summer tour",
  "Formula 1: New aero rules confirmed",
  "Wimbledon: young qualifier headlines upset",
  "Olympics: track trials set to start next month",
];

const news = [
  {
    title: "Extra-time chaos as derby explodes into drama",
    excerpt: "Refereeing controversies mar a heated encounter.",
    img: "https://images.unsplash.com/photo-1505672678657-cc7037095e2c?w=1200&q=60",
  },
  {
    title: "Transfer window: big money moves expected",
    excerpt: "Clubs prepare record deals before deadline.",
    img: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&q=60",
  },
  {
    title: "Coach outlines youth pathway plan",
    excerpt: "A new academy strategy aims to nurture talent.",
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=60",
  },
  {
    title: "Rugby: late tackle sparks review",
    excerpt: "Disciplinary panel to examine on-field incident.",
    img: "https://images.unsplash.com/photo-1520975910009-2a2dbc8f4f23?w=1200&q=60",
  },
  {
    title: "Cricket notes: star spinner returns",
    excerpt: "The squad welcomes back its veteran spinner.",
    img: "https://images.unsplash.com/photo-1508371951953-9a72c0b7c4b9?w=1200&q=60",
  },
  {
    title: "Exclusive: Player opens up on comeback",
    excerpt: "An intimate profile on resilience and recovery.",
    img: "https://images.unsplash.com/photo-1520975910009-2a2dbc8f4f23?w=1200&q=60",
  },
];

// ---------- Utilities ----------
function el(tag, options = {}) {
  const e = document.createElement(tag);
  if (typeof options === "string") {
    e.className = options;
  } else {
    Object.entries(options).forEach(([key, value]) => {
      if (key === "className") e.className = value;
      else if (key === "textContent") e.textContent = value;
      else e.setAttribute(key, value);
    });
  }
  return e;
}

// ---------- Ticker ----------
const tickerEl = document.getElementById("ticker-content");
tickerEl.textContent = headlines.concat(headlines).join(" • ");

// ---------- Carousel ----------
const carousel = document.getElementById("carousel");
let current = 0;
function renderSlides() {
  carousel.querySelectorAll(".slide").forEach((n) => n.remove());
  slides.forEach((s, idx) => {
    const slide = el("div", "slide");
    if (idx === current) slide.classList.add("active");
    const img = document.createElement("img");
    img.setAttribute("loading", "lazy");
    img.src = s.img;
    img.alt = s.title;
    slide.appendChild(img);

    const meta = el("div", "meta");
    const h = el("h2");
    h.textContent = s.title;
    const p = el("p");
    p.textContent = s.excerpt;
    meta.appendChild(h);
    meta.appendChild(p);
    slide.appendChild(meta);
    carousel.insertBefore(slide, carousel.querySelector(".controls"));
  });
}
function showNext(dir = 1) {
  current = (current + dir + slides.length) % slides.length;
  renderSlides();
}
document
  .getElementById("prevBtn")
  .addEventListener("click", () => showNext(-1));
document.getElementById("nextBtn").addEventListener("click", () => showNext(1));
renderSlides();
// auto cycle
setInterval(() => showNext(1), 7000);

// ---------- News grid ----------
const grid = document.getElementById("news-grid");
function renderNews() {
  grid.innerHTML = "";
  news.forEach((n) => {
    const card = el("article", "card");
    card.setAttribute("role", "article");
    const img = document.createElement("img");
    img.src = n.img;
    img.alt = n.title;
    img.loading = "lazy";
    card.appendChild(img);
    const body = el("div", "cbody");
    const h = el("h3");
    h.textContent = n.title;
    const p = el("p");
    p.textContent = n.excerpt;
    body.appendChild(h);
    body.appendChild(p);
    card.appendChild(body);
    // demo click
    card.addEventListener("click", () => alert("Open article: " + n.title));
    grid.appendChild(card);
  });
}
renderNews();

// ---------- Live scores (API version) ----------
const scoresList = document.getElementById("scores-list");

// Fetch live data from TheSportsDB
async function fetchScores() {
  try {
    scoresList.textContent = "Loading live scores...";
// Fetch live scores with error handling
async function fetchScores(apiUrl = "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328") {
  try {
    scoresList.textContent = "Loading live scores...";
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    renderScores(data.events || []);
  } catch (error) {
    console.error("Error fetching live scores:", error);
    scoresList.textContent = "Unable to load live scores ⚠️";
  }
}
  scoresList.innerHTML = "";
  events.forEach((s) => {
    const row = el("div", "score");
    const left = el("div", "team");
    const right = el("div", "team");

    const home = el("div", "name");
    home.textContent = s.strHomeTeam;
    const away = el("div", "name");
    away.textContent = s.strAwayTeam;

    left.appendChild(home);
    right.textContent = `${s.intHomeScore || "-"} - ${s.intAwayScore || "-"}`;

    row.appendChild(left);
    row.appendChild(right);

    const meta = el("div");
    meta.style.color = "var(--muted)";
    meta.style.fontSize = "12px";
    meta.textContent = `${s.strLeague} · ${s.dateEvent}`;

    const wrapper = el("div");
    wrapper.appendChild(row);
    wrapper.appendChild(meta);
    scoresList.appendChild(wrapper);
  });
}

// Call the function to fetch live data
fetchScores();

// ---------- Accessibility & small helpers ----------
fetchScores(); // Default API URL is used

// Keyboard carousel controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showNext(-1);
  if (e.key === "ArrowRight") showNext(1);
});

// Simple simulated live update (demo)
setInterval(() => {
  // rotate ticker quickly
  const txt = tickerEl.textContent;
  tickerEl.textContent = txt.slice(2) + txt.slice(0, 2);
}, 3000);

// Toggle mobile menu visibility
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector('nav[aria-label="Main navigation"]');

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}
