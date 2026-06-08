# ACT Math Prep 📐

A fully offline, adaptive ACT Math practice app. No internet required after initial setup. No accounts, no subscriptions — completely free forever.

## Features

- **20 ACT Math topics** with all major skills covered
- **Infinite unique questions** — numbers are randomized every time, same problem never repeats
- **Adaptive difficulty** — wrong topics appear more often; mastered topics appear occasionally
- **3 practice modes**: Adaptive, Problem Areas, Easy Wins
- **Skill-level filtering** — drill a specific skill within a topic
- **Stopwatch** — track how long each question takes
- **Step-by-step explanations** for every answer
- **Progress dashboard** — daily timeline charts, topic & skill breakdowns
- **Auto-saves** — progress saves to your browser automatically

## Topics Covered

1. Functions (notation, transformations, domain/range, composite, operations, inverse)
2. Statistics (mean/median/mode, Venn diagrams, standard deviation, expected value)
3. Probability
4. Triangle Properties (similar triangles, angle sums, inequality theorem, isosceles/equilateral)
5. Solve for Variable (equations and inequalities)
6. Fractions & Decimals
7. Factoring (quadratics, zeros/roots, quadratic formula)
8. Systems of Equations
9. Circles (sector area, arc length, equation, central/inscribed angles)
10. Lines (slope, equation forms, parallel & perpendicular)
11. Number Properties (rational/irrational, multiples, factors, divisibility, integers)
12. Polynomials (FOIL, arithmetic, special expansions)
13. Trig: SOH CAH TOA
14. Complex Numbers
15. Coordinate Plane
16. Unit Conversion
17. Ratios
18. Sequences (notation, sum, nth term)
19. Area (triangle, rectangle, circle, trapezoid)
20. Advanced Trigonometry (unit circle, graph vocabulary, identities)

---

## Setup Instructions

### Step 1 — Download the files

**Option A: Download ZIP**
1. Click the green **Code** button on GitHub
2. Click **Download ZIP**
3. Extract the ZIP to any folder on your laptop (e.g. `Documents/ACT-Prep`)

### Step 2 — Open the app

1. Navigate to the folder where you extracted/cloned the files
2. Double-click **`index.html`**
3. It opens in your web browser — that's it! No install needed.

> **Tip:** Use Chrome or Firefox for best results. Safari works too.

### Step 3 — Bookmark it

Drag the `index.html` file to your bookmarks bar so you can open it in one click each time.

---

## How Progress Saves

Your progress is stored in your browser's **localStorage** — it stays there between sessions automatically. You don't need to hit Save.

> ⚠️ **Important:** Progress is tied to the browser you use. If you open `index.html` in Chrome today and Firefox tomorrow, you'll see different progress histories. Always use the same browser.
>
> ⚠️ Clearing browser data/cache will erase your progress. To back it up, use your browser's export feature or take a screenshot of your stats page periodically.

---

## File Structure

```
act-math-prep/
├── index.html          ← Open this to run the app
├── README.md           ← This file
├── css/
│   └── styles.css      ← All styling
└── js/
    ├── questions.js    ← Question generators for all 20 topics
    ├── progress.js     ← Progress tracking & localStorage
    └── app.js          ← App logic, routing, charts
```

---

*Built with plain HTML, CSS, and JavaScript. No frameworks, no dependencies, no internet required.*
