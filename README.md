# Star Wars Characters (Vanilla JS + Lit)

A minimal Vanilla JavaScript project using Lit web components. Data source: SWAPI.

- **API**: [`https://swapi.dev/`](https://swapi.dev/)
- **Components**: home page, character card, character list, character profile

## Quick start

```bash
# from the project root
npm install
# open index.html via a static server (recommended)
# for example using npx http-server (optional)
npx --yes http-server -c-1 -o
```

Alternatively, open `index.html` directly in your browser, but some features may require serving via HTTP.

## Project structure

```
/ (root)
  index.html            # entry HTML
  src/
    main.js             # simple hash router
    services/
      api.js            # SWAPI calls (stubbed for now)
    components/
      home-page.js
      character-card.js
      character-list.js
      character-profile.js
```

## Notes

- All server calls will be defined in `src/services/api.js`.
- Built with [Lit](https://lit.dev/). Install already handled via npm.
- Data courtesy of SWAPI [`https://swapi.dev/`](https://swapi.dev/).
