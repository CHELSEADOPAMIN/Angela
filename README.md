# Whimsy Bees (from scratch)

An interactive garden with a mesh/airbrush vibe: move your cursor and the character walks to the nearest flower. Click flowers to learn about different bees.

## Run it locally

Because this is a plain static site, you can use any local server.

### Option A: Python

```bash
cd "/Users/angelaoria/Cursor event/whimsywebsite"
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

### Option B: Node (if you already have it)

```bash
npx --yes serve .
```

## Customize

- **Colors/background**: tweak CSS variables + the layers in `styles.css` (`.bg__mesh`, `.bg__airbrush`, `.bg__halftone`).
- **Flowers**: edit `window.FLOWERS` in `bees.js` (names + which bees appear).
- **Bees**: edit `window.BEE_DATA` in `bees.js` (type / what it is / where it’s from).


