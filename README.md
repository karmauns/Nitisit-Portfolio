# Nitisit Senaharn — Portfolio

Static portfolio site. No build step, no dependencies to install — open `index.html` in a browser, or serve the folder.

```
python -m http.server 8000     # then visit http://localhost:8000
```

> Serving over `http://` (rather than opening the file directly) is recommended — the clipboard API and image loading both behave more predictably.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content and section markup |
| `style.css` | Design tokens + all styling (see the table of contents at the top) |
| `script.js` | Project data, nav, scroll reveal, modal, lightbox, filters |
| `assets/` | Images |

## Adding your images

### Profile photo
Save your photo as **`assets/profile.jpg`**. Until it exists, the hero shows an "NS" monogram fallback — nothing breaks.

### DC-1 gallery — already working
All 7 screenshots are present in **`assets/projects/dc1/`** and wired up:

```
01-target-overview.jpg            05-suid-enumeration.jpg
02-attack-chain-summary.jpg       06-privilege-escalation-root.jpg
03-nmap-recon.jpg                 07-root-proof-verification.jpg
04-drupalgeddon2-exploit.jpg
```

To change a caption, edit the `gallery` array under `dc1` in `script.js`. Any file that goes missing degrades to a labelled placeholder tile rather than a broken image.

### AEGIS gallery
1. Put the photos in `assets/projects/aegis/`.
2. Open `script.js`, find the `aegis` entry's `gallery: []` array (near the top, section 01) and list them:

```js
gallery: [
  { file: "01-architecture.jpg", caption: "System architecture" },
  { file: "02-presentation.jpg", caption: "IT Empowering Day 2026" }
]
```

Captions appear on the tile and in the lightbox.

## Re-theming

Every colour, radius, shadow and timing value is a CSS custom property in the `:root` block at the top of `style.css` (section 01). Changing `--accent`, `--accent-2` and `--bg` re-skins the whole site.

## Notes

- Icons come from [Lucide](https://lucide.dev) via CDN; fonts from Google Fonts. Both need an internet connection.
- Text colours are checked against WCAG AA on the dark background (body text ≥ 8:1, dimmed labels ≥ 4.5:1).
- Respects `prefers-reduced-motion` — animations are disabled and all content stays visible.
- Keyboard support: project cards open with Enter/Space, `Esc` closes overlays, `←`/`→` navigate the lightbox.
