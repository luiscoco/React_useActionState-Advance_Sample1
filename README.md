# useActionState Learning Lab

An interactive React 19 playground to teach `useActionState` across three progressive levels:

- **Level 1 – Beginner:** Simple greeting form to introduce `[state, action, isPending]`.
- **Level 2 – Intermediate:** Idea + tone + steps form with validation and a rolling log.
- **Level 3 – Advanced:** Full playground with presets, sliders, success/error states, and history.

<img width="1304" height="962" alt="image" src="https://github.com/user-attachments/assets/bb73df5d-2467-45d3-a825-a871bbd4d9c7" />

## Prerequisites

- Node.js 18+ recommended

## Quick start

```bash
cd my-react-app
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Build and preview

```bash
npm run build
npm run preview
```

## What to explore

- `useActionState` returns `[state, action, isPending]`; no manual loading toggles needed.
- Forms are wired with `<form action={action}>`, so React feeds `FormData` into your action.
- Returning new state objects drives the UI: success/error messaging, chips, and history/logs.
- Quick-submit buttons call the action programmatically with a `FormData` instance.

## Key files

- `src/App.tsx` — tabbed layout for the three levels.
- `src/components/BasicScreen.tsx` — beginner demo.
- `src/components/IntermediateScreen.tsx` — intermediate demo with mini log.
- `src/components/AdvancedScreen.tsx` — advanced playground and concept map.
- `src/components/TiltCard.tsx` — card wrapper with hover highlight.
- `src/App.css` — main styling and hover highlights.

## Teaching notes

- Start with the hook signature and the form wiring in Level 1.
- Show validation and state shaping (including logs) in Level 2.
- Highlight pending/success/error flows, history, and programmatic submits in Level 3.
