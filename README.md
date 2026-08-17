# Ruth Manuela Pérez Hernández — Personal Site

Minimalist personal/academic site for Dr. Ruth Manuela Pérez Hernández — health economics and AI applied to public health surveillance, Instituto Mexicano del Seguro Social (IMSS). Built for the **ALASS 2026 congress in Montreal**, where she and Javier Rebull present the EpiForecast‑MX project.

## Structure

Static site, no build step, no dependencies:

```
index.html        Spanish (default)
en/index.html      English
fr/index.html      French
styles.css
script.js
assets/            profile photo
netlify.toml
```

All three language versions share the same CSS/JS and the same section `id`s, so in-page navigation, the scroll-triggered "active section" highlight, and the language switcher all work consistently across languages.

## Running locally

No build step — just serve the directory statically, e.g.:

```
python3 -m http.server 8934
```

Then open `http://localhost:8934/`.

## Deployment

Deploys as a static site to [Netlify](https://www.netlify.com/) — `netlify.toml` sets `publish = "."`. No build command required.

## Content

Profile, research lines, and publications are drawn from Ruth's official academic CV. Only public-facing professional information is included on the site (bio, research, publications, ORCID, Google Scholar, professional email).
