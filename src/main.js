// Import all Lit web components
import './components/home-page.js';
import './components/character-list.js';
import './components/character-card.js';
import './components/character-profile.js';
import './components/loading-states/skeleton-card.js';
import './components/loading-states/skeleton-profile.js';

/**
 * Simple hash-based router for single-page application
 * Handles navigation between different views based on URL hash
 * Routes:
 * - #/ or default: Home page with character search and grid
 * - #/characters: Character list view (currently unused)
 * - #/characters/:id: Individual character profile view
 */
function renderRoute() {
  const main = document.querySelector('main');
  const hash = window.location.hash || '#/';

  // Ensure main container exists
  if (!main) {
    console.error('Main element not found!');
    return;
  }

  // Handle character profile routes (e.g., #/characters/1)
  if (hash.startsWith('#/characters/')) {
    const id = hash.split('/')[2] || '';
    main.innerHTML = '<character-profile></character-profile>';
    const el = main.querySelector('character-profile');
    if (el) {
      el.setAttribute('person-id', id);
    }
    return;
  }

  // Route to appropriate component based on hash
  switch (hash) {
    case '#/characters':
      // Character list view (currently redirects to home)
      main.innerHTML = '<character-list></character-list>';
      break;
    case '#/':
    default:
      // Default home page with search and character grid
      main.innerHTML = '<home-page></home-page>';
  }
}

// Set up event listeners for navigation
window.addEventListener('hashchange', renderRoute); // Handle browser back/forward
window.addEventListener('DOMContentLoaded', renderRoute); // Handle initial page load
