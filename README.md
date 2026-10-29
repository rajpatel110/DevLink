# DevLink

**Discover developers. Build connections. Start conversations.**

DevLink is a full-stack developer networking application built with React, Express, and MongoDB. Create a profile, explore other developers, manage connection requests, and exchange private messages once a connection is accepted.

[Getting started](#getting-started) · [How it works](#how-it-works) · [API reference](#api-reference) · [Deployment](#deployment) · [Testing](#testing)

## Features

- **Accounts and authentication** — sign up, log in, and log out with JWT cookie authentication and bcrypt password hashing.
- **Developer profiles** — view and edit your name, photo URL, age, gender, bio, and skills.
- **Discovery feed** — browse developer cards; the feed API supports pagination and excludes yourself and users with existing connection requests.
- **Connection requests** — express interest or ignore a profile, review incoming requests, and accept or reject them.
- **Connections** — view accepted connections and open a conversation from a connection card.
- **Private messaging** — exchange text messages with accepted connections, revisit saved history, and load older messages.

Chat refreshes every **three seconds**, supports messages up to **2,000 characters**, and loads history in pages of **50**. Both chat endpoints check that the users have an accepted connection.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Axios |
| Styling | Tailwind CSS, daisyUI |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, HTTP-only cookies, bcrypt |
| Validation | validator.js, Mongoose schemas |
| Deployment | Vercel static frontend and Node.js API function |

## How it works

1. Create an account and log in.
2. Update your developer profile.
3. Explore the feed and send a connection request.
4. The recipient accepts the request from their requests page.
5. Open **Connections → Chat**, or select **Messages** from the profile menu.
6. Exchange messages and return later to continue the conversation.

For a local two-account walkthrough, see [CHAT.md](CHAT.md).

## Getting started

### Prerequisites

- Node.js 22.x and npm.
- A MongoDB database, either local or hosted on MongoDB Atlas.
- Git.

### 1. Clone and install

```bash
git clone https://github.com/rajpatel110/DevLink.git
cd DevLink
npm ci
npm ci --prefix DevLink-web
```

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

### 2. Configure the backend

Create a `.env` file in the repository root:

```dotenv
PORT=3000
DB_CONNECTION_SECRET=mongodb://127.0.0.1:27017/devlink
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

| Variable | Purpose |
| --- | --- |
| `PORT` | Local API port; defaults to `3000`. |
| `DB_CONNECTION_SECRET` | MongoDB connection URI. Replace the example with your Atlas URI if using Atlas. |
| `JWT_SECRET` | Secret used to sign and verify login tokens. |
| `CLIENT_URL` | Frontend origin for CORS and development password-reset links. |
| `NODE_ENV` | Set to `production` in production to enable secure login cookies and disable development reset-link responses. |

Keep credentials in local environment files or hosting settings. `.env` is ignored by Git.

### 3. Start both servers

In the first terminal, from the repository root:

```bash
npm start
```

In a second terminal, from the repository root:

```bash
npm run dev --prefix DevLink-web -- --port 5173 --strictPort
```

Open **[http://localhost:5173/login](http://localhost:5173/login)**. The backend listens on `http://localhost:3000` after MongoDB connects.

The frontend uses `http://localhost:3000` in development and `/api` in production. An optional frontend `VITE_API_URL` environment variable overrides that default at build time.

## Project structure

```text
DevLink/
├── DevLink-web/              # React frontend
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # Authentication, feed, profile, connections, chat
│       ├── utils/            # Redux store, slices, API configuration
│       ├── App.jsx           # Client-side routes
│       └── main.jsx          # Frontend entry point
├── api/
│   └── index.js              # Vercel API entry point
├── src/
│   ├── config/               # Cached MongoDB connection
│   ├── middlewares/          # Authentication middleware
│   ├── models/               # User, ConnectionRequest, Message
│   ├── routes/               # Authentication, profiles, requests, feed, chat
│   ├── utils/                # Input validation
│   └── app.js                # Express app and local server startup
├── tests/
│   └── live-chat.cjs         # Live MongoDB integration test
├── CHAT.md                   # Local chat walkthrough
├── DEPLOYMENT.md             # Vercel configuration and verification notes
├── package.json              # Backend dependencies and scripts
└── vercel.json               # Build settings and routing
```

## API reference

Use `http://localhost:3000` as the base URL locally. On Vercel, prefix these paths with `/api`; for example, `/api/login`. Protected routes require the login cookie.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/signup` | Create an account. |
| `POST` | `/login` | Authenticate and set the login cookie. |
| `POST` | `/logout` | Clear the login cookie. |
| `GET` | `/profile/view` | Fetch the signed-in user's profile. |
| `PATCH` | `/profile/edit` | Update supported profile fields. |
| `GET` | `/feed?page=1&limit=10` | Fetch developer profiles; limit is capped at 40. |
| `POST` | `/request/send/:status/:toUserId` | Send an `interested` or `ignore` request. |
| `POST` | `/request/review/:status/:requestId` | Mark an incoming request `accepted` or `rejected`. |
| `GET` | `/user/requests/received` | Fetch pending incoming requests. |
| `GET` | `/user/connections` | Fetch accepted connections. |
| `GET` | `/chat/:userId` | Fetch the latest conversation messages. |
| `POST` | `/chat/:userId` | Send a message using a JSON body such as `{ "text": "Hello!" }`. |
| `POST` | `/forgotPassword` | Generate a reset link in development only. |
| `POST` | `/resetPassword/:token` | Reset a password using a valid, unexpired token. |

To fetch older chat messages, pass the oldest loaded message ID as `?before=<messageId>`. History responses include `data` and `hasMore`.

## Deployment

The repository includes configuration for deploying the frontend and backend together as one Vercel project:

1. Import this GitHub repository into Vercel.
2. Keep the **Root Directory** at the repository root (`./`) and select **Other** as the framework preset.
3. Let `vercel.json` supply the install command, build command, output directory, and routing.
4. Set `DB_CONNECTION_SECRET`, `JWT_SECRET`, and `CLIENT_URL` in Vercel's environment settings. Use your deployed HTTPS frontend origin for `CLIENT_URL`.
5. Ensure MongoDB Atlas network access permits connections from the deployment.
6. Deploy, then check signup, login, connection acceptance, and messaging with two accounts.

Leave `VITE_API_URL` unset for this setup so browser requests use the same-origin `/api` endpoint. Redeploy after changing environment variables.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the detailed deployment notes.

## Testing

Run commands from the repository root unless otherwise noted.

| Command | Purpose |
| --- | --- |
| `npm run build --prefix DevLink-web` | Build the production frontend. |
| `npm run lint --prefix DevLink-web` | Run the frontend ESLint checks. |
| `node tests/live-chat.cjs` | Exercise the account, connection, and chat flow against MongoDB. |

The integration test requires the backend environment variables. It creates three temporary accounts and removes their accounts, requests, and messages in its cleanup step. It checks signup/login, profile access, feed discovery, request creation and acceptance, connection lists, two-way saved chat history, access restrictions, and logout.

These API checks do not replace a browser walkthrough or verification of the deployed environment.

## Current limitations

- Password-reset email delivery is not connected. The development endpoint returns a reset link directly; production reset-link generation is disabled until email delivery is implemented.
- Incoming chat messages use polling. Typing indicators, read receipts, attachments, and push notifications are not implemented.
- The most recent full frontend lint run reported four existing `set-state-in-effect` errors and additional warnings. The new Chat component passed its focused lint check; see [DEPLOYMENT.md](DEPLOYMENT.md) for context.

## Author

Built by **[Raj Patel](https://github.com/rajpatel110)**.
