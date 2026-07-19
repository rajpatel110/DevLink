# DevLink Backend

A RESTful backend API for **DevLink**, a social networking platform where users can create profiles, connect with other users, and manage connection requests securely.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- Cookie Parser
- Validator.js

---

## ✨ Features

- User Registration
- User Login & Logout
- JWT Authentication
- Password Hashing using bcrypt
- Profile View
- Profile Edit
- Send Connection Requests
- Accept / Reject Connection Requests
- View Pending Connection Requests
- View Accepted Connections
- User Feed API
- Pagination Support
- MongoDB Schema Validation
- Authentication Middleware

---

## 📁 Project Structure

```
backend/
│── src/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── database.js
│
├── package.json
├── README.md
└── .env
```

---

## 🔐 Authentication

Authentication is implemented using **JWT**.

After successful login, a JWT token is generated and stored in cookies. Protected routes are accessed using authentication middleware.

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |

---

### Profile

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/profile/view` | View logged-in user profile |
| PATCH | `/profile/edit` | Update profile |
| PATCH | `/profile/password` | Change password |

---

### Connection Requests

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/request/send/:status/:toUserId` | Send connection request |
| POST | `/request/review/:status/:requestId` | Accept or Reject request |

---

### User

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/user/requests/received` | View pending requests |
| GET | `/user/connections` | View accepted connections |
| GET | `/feed?page=1&limit=10` | View user feed |

---

## 📦 Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the project directory

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## ▶️ Run the Server

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## 📄 Database Collections

- Users
- Connection Requests

---

## 🛠️ Packages Used

- express
- mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- validator
- dotenv

---

## 📚 Concepts Used

- REST API
- MVC Architecture
- JWT Authentication
- Password Hashing
- Middleware
- MongoDB Relationships
- Mongoose Populate
- Pagination
- Input Validation
- Error Handling

---

## 👨‍💻 Author

**Raj Patel**

B.Tech Computer Science Student

GitHub: https://github.com/rajpatel110