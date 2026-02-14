# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# miro-horizon

## Miro Horizon – Running the app

1. **Phase 1 (one-time):** Create a Miro app at [Miro app settings](https://miro.com/app/settings/user-profile/apps) with scopes `boards:read` and `boards:write`, then install it and copy the **access token**.

2. **Env:** Copy `.env.example` to `.env` and set `MIRO_ACCESS_TOKEN` to your token.

3. **Create board (one-time):** Run `node scripts/create-miro-board.js`, then set `MIRO_BOARD_ID` in `.env` to the printed board ID.

4. **Run:**
   - **Backend:** `npm run server` (API at http://localhost:3001)
   - **Frontend:** `npm run dev` (Vite at http://localhost:5173, proxies `/api` to the backend)

Open the app in the browser; the Board screen loads items from your Miro board.

## Vercel deployment

For Vercel, the backend is provided by serverless functions in the `api/` folder. Set these environment variables in your Vercel project (Settings → Environment Variables):

- `MIRO_ACCESS_TOKEN` – your Miro access token
- `MIRO_BOARD_ID` – your Miro board ID

Without these, the API returns 503 and voting will fail.
