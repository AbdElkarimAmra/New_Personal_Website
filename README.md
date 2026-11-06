# Karim Amra — Portfolio (2026 refresh)

A personal engineering site, not a résumé. The featured work emphasizes robotics and computer vision research, AI/automation, and full-stack shipping—based on Karim's updated résumé, not the outdated portfolio content.

## Install and run on a Mac

1. Download `karim-portfolio-2026.zip` and locate it in Finder's Downloads folder.
2. Double-click it to extract **karim-portfolio-2026**. If Finder has named the folder differently, use that folder name instead.
3. Open Terminal and run:

```bash
cd ~/Downloads/karim-portfolio-2026
npm install
npm run dev
```

Then open the **Local** URL Vite prints, usually `http://127.0.0.1:5173/`.

If Terminal reports **no such file or directory**, use Finder to locate the extracted folder, type `cd ` (with a space) in Terminal, drag the folder onto the Terminal window, and press Enter. Then run `npm install` and `npm run dev`.

> `npm` commands must be run from the folder containing `package.json`, **not** from the `~` home directory.

## Deployment

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory on Netlify or another static host. The development entry point is **root `index.html`**, not `dist/index.html`.

## What to edit

- `index.html`: all content, project links, and contact info.
- `src/style.css`: responsive visual style, typography and colors.
- `src/main.js`: mobile navigation, reveal animations, and a conceptual localization canvas demo.
- `public/favicon.svg`: favicon.

## Notes on accuracy and attribution

- **Robotics research**: 242 observations, improvement in 181, and change in median error 7.55 m to 4.90 m refer to an **offline comparison** of full 271-class weighting and a top-3 method. They are not a deployed robot performance claim.
- The interactive localization panel is a **visual metaphor**, not the actual model, research data, simulation of the benchmark, or user's research code. Buttons change a synthetic grid and particle field.
- Automation internship systems were internal. The site doesn't imply their code is open source.
- SHAK Finance (GitHub: `Savings_React`, backend `SHAK_Node`) appears to be a work-in-progress repository; the project descriptions here are based on the latest résumé. Do not imply production rollout.
- SmartTasker's GitHub repository is linked; `smarttasker.tech` was included in the résumé as the deployed app, but its current availability could not be independently confirmed. Check the URL before publishing.
- The card artwork for SHAK, automation, and SmartTasker is custom illustrative HTML/CSS, not real screenshots or production data.
- Contact address is `kamra@macalester.edu` from the uploaded résumé. No phone number, GPA, awards, or personal contact-form backend included.
- Older projects have been moved to a small linked section, rather than being erased.

## Copy into your old project safely (optional)

If you want to use your existing `~/My-Portfolio` project:

```bash
cp -R ~/My-Portfolio ~/My-Portfolio-backup
```

Then copy this package's `index.html`, `src/main.js`, `src/style.css`, and `public/favicon.svg` into the corresponding paths of `~/My-Portfolio`. Confirm that the existing `package.json` includes `"dev": "vite"`. Restart Vite. **Do not copy `dist/index.html` to root** or use Vite-built assets as development sources.

You can also keep this as an entirely separate project and deploy it independently.
