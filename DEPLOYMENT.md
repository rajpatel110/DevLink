# Deploy DevLink on Vercel

Import the GitHub repository as ONE Vercel project. Use the repository root (not DevLink-web), Framework Preset Other, and Node.js 22.x. vercel.json supplies install/build/output settings, the /api serverless function, and frontend route fallback.

Set these environment variables in Vercel before deploying:

- DB_CONNECTION_SECRET: your MongoDB connection URI (same variable used locally).
- JWT_SECRET: a strong randomly generated secret, kept only in Vercel settings.
- CLIENT_URL: the final https:// URL of your Vercel project.
- NODE_ENV: production (normally supplied by Vercel).

Do not add .env or credentials to GitHub. Configure MongoDB Atlas network access to permit connections from your Vercel deployment. Do not set VITE_API_URL for this setup: the frontend uses /api on its own domain, and login cookies stay on that domain.

After deploying, check /signup and /login directly, then use two accounts to send/accept a connection request, exchange messages, and reload the chat to verify persistence. Chat refreshes every three seconds; it does not require a persistent WebSocket server. Password reset is deliberately unavailable in production until a real email delivery flow is implemented; the development-only reset-link response must not be exposed publicly.

Local commands:

- Backend: npm start
- Frontend: npm run dev --prefix DevLink-web
- Build: npm run build --prefix DevLink-web
- Chat lint: npx --prefix DevLink-web eslint DevLink-web/src/components/Chat.jsx (or run npx eslint src/components/Chat.jsx inside DevLink-web)
- Live integration check: node tests/live-chat.cjs (requires configured MongoDB; creates three temporary accounts and removes their records in finally).

Verified locally: real MongoDB signup/login/profile/feed, request inbox and acceptance, connection lists, two-way saved chat messages, unauthorized chat rejection, and logout. Temporary test records were removed. Production build passes. The repository-wide lint command still reports four existing set-state-in-effect errors in Feed, Connections, NavBar and Requests, plus existing warnings. The new Chat component passes ESLint. A full browser UI walkthrough and an actual Vercel deployment are not verified by these API checks.
