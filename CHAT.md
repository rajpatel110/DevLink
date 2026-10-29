# Local chat

Start the backend from the project root with `npm.cmd start`.
Start the frontend from `DevLink-web` with `npm.cmd run dev -- --host localhost --port 5173 --strictPort`.
Open http://localhost:5173/login.

Sign in with two existing accounts in separate browser profiles (or one regular and one private window). They must have an accepted connection. Open Connections > Chat or the profile menu > Messages. Send a message from each account, then refresh to verify saved history. Incoming messages refresh every three seconds. Older history loads in pages of 50. Messages are limited to 2000 characters.

The feature adds a Message collection and authenticated GET/POST /chat/:userId routes. Both routes require an accepted connection and derive the sender from the login cookie. No new dependencies are required. Existing files have only route/navigation wiring, plus a missing opening anchor tag repaired in ForgotPassword.jsx because it prevented the entire frontend from building.

Validation: production frontend build, Chat.jsx ESLint, backend syntax checks, live frontend HTTP response, live unauthenticated chat rejection, MongoDB startup connection, and isolated API tests with mocked storage for permissions/validation/send/history. A real two-account browser exchange has not been performed.

A later live MongoDB integration test passed signup/login, feed, request acceptance, connections, two-way persistent chat, authorization and logout. See DEPLOYMENT.md for Vercel settings and remaining verification limits.

