function renderSaved() {
  const items = getSaved();
  const grid = document.getElementById('saved-grid');
  const empty = document.getElementById('saved-empty');

  grid.innerHTML = '';
  document.getElementById('saved-count').textContent = items.length;

  if (!items.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = item.watched ? 'movie-card movie-card--watched' : 'movie-card';

    const poster = document.createElement('img');
    poster.className = 'movie-card__poster';
    poster.src = item.Poster !== "N/A" ? item.Poster : "https://placehold.co/200x300?text=No+Image";
    poster.alt = item.Title;

    const title = document.createElement('h3');
    title.className = 'movie-card__title';
    title.textContent = item.Title;

    const actions = document.createElement('div');
    actions.className = 'movie-card__actions';

    // Watched toggle — closes over `item`, so it knows which saved
    // entry to update when the checkbox changes
    const watchedLabel = document.createElement('label');
    watchedLabel.className = 'movie-card__watched-label';

    const watchedCheckbox = document.createElement('input');
    watchedCheckbox.type = 'checkbox';
    watchedCheckbox.checked = Boolean(item.watched);

    watchedCheckbox.addEventListener('change', () => {
      const all = getSaved();
      const target = all.find(saved => saved.imdbID === item.imdbID);
      if (target) {
        target.watched = watchedCheckbox.checked;
        setSaved(all);
        renderSaved();
      }
    });

    watchedLabel.appendChild(watchedCheckbox);
    watchedLabel.append('Watched');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'movie-card__btn movie-card__btn--remove';
    removeBtn.textContent = 'Remove';

    removeBtn.addEventListener('click', () => {
      const updated = getSaved().filter(saved => saved.imdbID !== item.imdbID);
      setSaved(updated);
      renderSaved();
    });

    actions.appendChild(watchedLabel);
    actions.appendChild(removeBtn);
    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}
renderSaved();