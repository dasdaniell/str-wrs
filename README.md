# Profile Searcher (Vanilla JS + Lit)

Quick start:

```bash
npm install
npm run start
```

Then open http://127.0.0.1:5173 in your browser.

This is a minimal Vanilla JavaScript project using Lit web components. Data source: SWAPI.

- **API**: [`https://swapi.dev/`](https://swapi.dev/)
- **Components**: home page, character card, character list, character profile

## Quick start (details)

The `start` script runs a simple static server on port 5173.

## Project structure

```
/ (root)
  index.html            # entry HTML
  src/
    main.js             # simple hash router
    services/
      api.js            # SWAPI calls
    components/
      home-page.js
      character-card.js
      character-list.js
      character-profile.js
      loading-states/
        skeleton-card.js
        skeleton-profile.js
```

## Notes

- All server calls will be defined in `src/services/api.js`.
- Built with [Lit](https://lit.dev/). Install already handled via npm.
- Data courtesy of SWAPI [`https://swapi.dev/`](https://swapi.dev/).
