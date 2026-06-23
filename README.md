# Surprise Birthday Website for BILLI

A personalized surprise website for **Aynanin Fatima** (nickname: **BILLI**), featuring a countdown to July 8, anime and drama references, and a romantic proposal.

## Before You Send It

1. **Add photos** — Copy your images into `assets/photos/billi/` and `assets/photos/me/` using the filenames in [`assets/photos/PHOTOS_SETUP.md`](assets/photos/PHOTOS_SETUP.md).
2. Open `index.html` in a text editor.
3. Find `[Your Name]` near the bottom and replace it with your actual name.
4. Optionally tweak the proposal text to sound more like you.

## Open Locally (on your laptop)

**Option A — Double-click**

1. Navigate to the `billi-birthday` folder.
2. Double-click `index.html` to open it in your browser.

**Option B — Local server (smoother animations)**

```bash
cd billi-birthday
npx serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

## Share as a Link

### GitHub Pages (free)

1. Create a new repository on GitHub (e.g. `billi-birthday`).
2. Upload all files from this folder to the repo.
3. Go to **Settings → Pages**.
4. Under **Source**, select `main` branch and `/ (root)`.
5. Save. Your site will be live at `https://YOUR_USERNAME.github.io/billi-birthday/`.

### Netlify Drop (instant, no Git needed)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `billi-birthday` folder onto the page.
3. Copy the link Netlify gives you and send it to her.

## What's Inside

- Surprise landing screen ("Open your surprise")
- Countdown to July 8, 2026
- Birthday message + confetti on July 8 (or belated message after)
- Preview password for ASH to unlock early
- Anime cards (Demon Slayer, Spy x Family)
- Red velvet cake section
- Hidden Love drama quote
- Fun facts (sleeping, Instagram, white colour)
- Romantic confession finale
- Photo gallery with all your pictures
- Full proposal section with Yes/No buttons

## Files

```
billi-birthday/
├── index.html
├── css/style.css
├── js/main.js
└── README.md
```

No build step, no dependencies, no backend required.
