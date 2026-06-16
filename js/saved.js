// js/saved.js
import { getSaved, setSaved } from './api.js';

//Auth Logic
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

//Render Logic 
function renderSaved() {
  const items = getSaved();
  const grid = document.getElementById('saved-grid');
  const empty = document.getElementById('saved-empty');

  grid.innerHTML = '';

  if (!items.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'movie-card';

    const poster = document.createElement('img');
    poster.className = 'movie-card__poster';
    poster.src = item.Poster !== "N/A" ? item.Poster : "https://placehold.co/200x300?text=No+Image";
    poster.alt = item.Title;

    const title = document.createElement('h3');
    title.className = 'movie-card__title';
    title.textContent = item.Title;

    const actions = document.createElement('div');
    actions.className = 'movie-card__actions';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'movie-card__btn movie-card__btn--remove';
    removeBtn.textContent = 'Remove';

    removeBtn.addEventListener('click', () => {
      const updated = getSaved().filter(saved => saved.imdbID !== item.imdbID);
      setSaved(updated);
      renderSaved();
    });

    actions.appendChild(removeBtn);
    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

renderSaved();