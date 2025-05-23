# MERN Project

## Project Overview
This project is a full-stack MERN (MongoDB, Express, React, Node.js) application consisting of a backend API server and a frontend React application. The backend handles authentication, agent management, and list management, while the frontend provides a user interface to interact with these features.

---

## Backend Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB instance (local or cloud)

### Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET=your_admin_secret_key
FRONTEND_URL=https://task-distributer.onrender.com  # URL of the deployed frontend app
PORT=5000  # Optional, port for backend server (default is 5000)
```

### Install Dependencies
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### Run Backend Server
Start the backend server with:

```bash
npm start
```

The server will start on the port specified in the `.env` file or default to port 5000.

---

## Frontend Setup

### Prerequisites
- Node.js (v16 or higher recommended)

### Environment Variables
Create a `.env` file in the `frontend` directory with the following variable:

```
VITE_API_URL=https://task-distributer-backend.onrender.com
```

This configures the frontend to use the deployed backend API.

### Install Dependencies
Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

### Run Frontend Development Server
Start the frontend development server with:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

---

## Running the Full Project

1. Start the backend server first (`npm start` in `backend` directory).
2. Start the frontend development server (`npm run dev` in `frontend` directory).
3. Access the frontend app in your browser at `http://localhost:5173`.

---

## Build and Preview Frontend

To build the frontend for production:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Notes

- Ensure MongoDB is running and accessible via the connection string in `MONGO_URI`.
- The backend uses JWT for authentication; keep `JWT_SECRET` secure.
- The `ADMIN_SECRET` is used for admin-level operations; keep it secure.
- CORS is configured in the backend to allow requests from the deployed frontend URL `https://task-distributer.onrender.com` and local development URLs.
- The backend API endpoints are prefixed with `/api` (e.g., `/api/auth`, `/api/agents`, `/api/lists`).

---

## Project Structure

- backend/
  - package.json, package-lock.json
  - server.js
  - config/ (e.g., db.js)
  - middleware/ (e.g., auth.js, authMiddleware.js)
  - models/ (e.g., Agent.js, List.js, ListGroup.js, User.js)
  - routes/ (e.g., agent.js, auth.js, lists.js)
  - uploads/

- frontend/
  - package.json, package-lock.json
  - vite.config.js
  - public/
  - src/
    - components/ (e.g., AddAgent.jsx, Dashboard.jsx, Home.jsx, Login.jsx, Register.jsx, UploadList.jsx)
    - assets/
    - App.jsx, main.jsx, index.css, App.css

- README.md (root and frontend)
