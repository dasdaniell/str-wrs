import './components/home-page.js';
import './components/character-list.js';
import './components/character-card.js';
import './components/character-profile.js';
import './components/skeleton-card.js';
import './components/skeleton-profile.js';

function renderRoute() {
  const main = document.querySelector('main');
  const hash = window.location.hash || '#/';

  console.log('renderRoute called', { main, hash });

  if (!main) {
    console.error('Main element not found!');
    return;
  }

  if (hash.startsWith('#/characters/')) {
    const id = hash.split('/')[2] || '';
    main.innerHTML = '<character-profile></character-profile>';
    const el = main.querySelector('character-profile');
    if (el) {
      el.setAttribute('person-id', id);
    }
    return;
  }

  switch (hash) {
    case '#/characters':
      console.log('Rendering character-list');
      main.innerHTML = '<character-list></character-list>';
      break;
    case '#/':
    default:
      console.log('Rendering home-page');
      main.innerHTML = '<home-page></home-page>';
  }
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);


