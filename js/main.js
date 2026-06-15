// js/main.js
import { fetchData, getSaved, setSaved } from './api.js';

// --- Auth Logic ---
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

// --- State ---
// Holds the user's saved watchlist as an array of objects, loaded from localStorage.
// We'll put this to use in Phase 2.
let savedItems = getSaved();

// --- UI Helpers ---
function showLoading(isLoading) {
  document.getElementById('loading-msg').hidden = !isLoading;
}

function showError(message) {
  const errorMsg = document.getElementById('error-msg');
  if (message) {
    errorMsg.textContent = message;
    errorMsg.hidden = false;
  } else {
    errorMsg.hidden = true;
  }
}


function renderResults(items) {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  if (!items) return;

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'movie-card';

    const poster = document.createElement('img');
    poster.className = 'movie-card__poster';
    poster.src = item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/200x300?text=No+Image";
    poster.alt = item.Title;

    const title = document.createElement('h3');
    title.className = 'movie-card__title';
    title.textContent = item.Title;

    const actions = document.createElement('div');
    actions.className = 'movie-card__actions';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'movie-card__btn';

    const alreadySaved = savedItems.some(saved => saved.imdbID === item.imdbID);
    saveBtn.textContent = alreadySaved ? 'Saved!' : 'Add to Watchlist';
    saveBtn.disabled = alreadySaved;

    saveBtn.addEventListener('click', () => {
      savedItems.push(item);
      setSaved(savedItems);
      saveBtn.textContent = 'Saved!';
      saveBtn.disabled = true;
    });

    actions.appendChild(saveBtn);
    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

// --- Search Logic ---
document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchInput = document.getElementById('search-input').value.trim();
  const typeSelect = document.getElementById('type-select').value;
  const yearInput = document.getElementById('year-input').value.trim();

  if (!searchInput) return;

  showError('');
  showLoading(true);
  document.getElementById('results-grid').innerHTML = '';

  try {
    let endpoint = `s=${encodeURIComponent(searchInput)}`;
    if (typeSelect) endpoint += `&type=${typeSelect}`;
    if (yearInput) endpoint += `&y=${encodeURIComponent(yearInput)}`;

    const results = await fetchData(endpoint);
    renderResults(results);
  } catch (err) {
    showError(err.message || 'Failed to fetch data');
  } finally {
    showLoading(false);
  }
});