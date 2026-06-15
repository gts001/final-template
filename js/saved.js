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

    const title = document.createElement('h3');
    title.textContent = item.Title;

    const poster = document.createElement('img');
    poster.src = item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/200x300?text=No+Image";
    poster.alt = item.Title;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    
    // Remove item from array and re-render
    removeBtn.addEventListener('click', () => {
      const updated = getSaved().filter(saved => saved.imdbID !== item.imdbID);
      setSaved(updated);
      renderSaved();
    });

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(removeBtn);
    grid.appendChild(card);
  });
}

renderSaved();