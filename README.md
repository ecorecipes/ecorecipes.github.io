# ecorecipes.github.io

The landing page for the [ecorecipes](https://github.com/ecorecipes) organization: a guide to the packages in the ecosystem, grouped by family and searchable by task.

It is a static site with no build step. GitHub Pages serves the repository root as is.

## Layout

| File | Purpose |
|------|---------|
| `index.html` | Page structure and static copy |
| `assets/packages.js` | **The catalogue**: families, roles, packages and the "What do you want to do?" entries |
| `assets/app.js` | Rendering, search and filters, hero animation |
| `assets/style.css` | Styles, including light and dark themes |

## Adding or editing a package

Edit `assets/packages.js` and add an entry to `PACKAGES`:

```js
{
  name: "MyPackage.jl",      // repository name under github.com/ecorecipes
  family: "population",      // an id from FAMILIES
  role: "method",            // an id from ROLES
  docs: true,                // true once https://ecorecipes.github.io/MyPackage.jl/ is live
  blurb: "One or two sentences for someone deciding whether this is the package they need.",
  tags: "extra search keywords",
},
```

Optionally add a line to `TASKS` so it appears in the task guide. Counts, filter chips and statistics update themselves.

Public repositories that exist in the organization but are missing from the catalogue are detected in the browser and listed under "New on GitHub" at the bottom of the page, so nothing is invisible while the catalogue catches up.

## Previewing locally

```sh
python3 -m http.server 8000
```

then open <http://localhost:8000>.

## Deploying

This repository must be named `ecorecipes.github.io` for GitHub to serve it at <https://ecorecipes.github.io/>. Pushing to `main` publishes the site (Settings → Pages → Deploy from a branch → `main` / root).
