# Student Management System

A full stack Student Management System built with the MERN stack for **Devixo Solutions Web Development Internship, Task 03 (Option 2)**.

**Live site:** https://student-management-system4.netlify.app
**Backend API:** https://studentmanagement-4mb98xvn.b4a.run

## Tech Stack
- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth and security:** JWT, bcryptjs, CORS
- **Hosting:** Netlify (frontend), Back4app Containers (backend)

## Features
- **Authentication:** register, login and logout with JWT and hashed passwords
- **Student module:** add, edit, delete, search and view details
- **Dashboard:** total students, students added this week, number of courses, recent registrations and a search bar
- **Database:** all records stored permanently in MongoDB
- **UI:** responsive design, professional dashboard, form validation (browser and server) and loading indicators
- **Bonus:** pagination (8 per page) and role-based login

### Roles
| Action | Admin | User |
|---|---|---|
| View, search, see details | Yes | Yes |
| Add student | Yes | Yes |
| Edit student | Yes | No |
| Delete student | Yes | No |

The first account registered becomes the Admin. Everyone after that is a User.

## Project Structure
```
student-management/
├── client/            React app (Vite)
│   └── src/
│       ├── pages/         Login, Register, Dashboard, Students, StudentForm, StudentDetails
│       ├── components/    Layout, Field, PageLoader
│       ├── AuthContext.jsx
│       └── api.js
├── server/            Express API
│   ├── models/        User, Student
│   ├── routes/        auth, students
│   ├── middleware/    auth (JWT and admin check)
│   └── server.js
└── Dockerfile         Used to deploy the backend
```

## Run Locally

Requirements: Node.js 18+ and a MongoDB connection string (MongoDB Atlas or local).

**1. Backend**
```bash
cd server
npm install
```
Create a `server/.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```
Then start it:
```bash
npm run dev
```

**2. Frontend**
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173 and register. The first account is the Admin.

## Deployment
- **Backend:** Back4app Containers, built from the `Dockerfile`. Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (the Netlify address).
- **Frontend:** Netlify with base directory `client`, build command `npm run build` and publish directory `client/dist`. Environment variable: `VITE_API_URL` (the backend address plus `/api`).

## API Endpoints
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/students?search=&page=&limit= | Logged in |
| GET | /api/students/stats | Logged in |
| GET | /api/students/:id | Logged in |
| POST | /api/students | Logged in |
| PUT | /api/students/:id | Admin only |
| DELETE | /api/students/:id | Admin only |

## Author
Unsa Rani