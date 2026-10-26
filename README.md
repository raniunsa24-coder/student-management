# Student Management System

A full-stack Student Management System built with the MERN stack as part of the **Devixo Solutions Web Development Internship — Task 03 (Option 2)**.

**Live Website:** https://student-management-system4.netlify.app  
**Backend API:** https://student-management1-pi.vercel.app/

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication & Security:** JWT, bcryptjs, CORS
- **Hosting:** Netlify (frontend), Vercel (backend)

## Features

- **Authentication:** User registration, login, and logout using JWT and hashed passwords
- **Student Management:** Add, edit, delete, search, and view student details
- **Dashboard:** Total students, students added this week, number of courses, recent registrations, and search
- **Database:** Persistent data storage using MongoDB
- **Responsive UI:** Professional dashboard, form validation, and loading indicators
- **Pagination:** Displays 8 students per page
- **Role-Based Access:** Separate permissions for Admin and User accounts

## User Roles

| Action | Admin | User |
|---|---|---|
| View and search students | Yes | Yes |
| View student details | Yes | Yes |
| Add students | Yes | Yes |
| Edit students | Yes | No |
| Delete students | Yes | No |

The first account registered becomes the Admin. All subsequently registered accounts receive the User role.

## Project Structure

```text
student-management/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Login
│       │   ├── Register
│       │   ├── Dashboard
│       │   ├── Students
│       │   ├── StudentForm
│       │   └── StudentDetails
│       ├── components/
│       │   ├── Layout
│       │   ├── Field
│       │   └── PageLoader
│       ├── AuthContext.jsx
│       └── api.js
├── server/
│   ├── models/
│   │   ├── User
│   │   └── Student
│   ├── routes/
│   │   ├── auth
│   │   └── students
│   ├── middleware/
│   │   └── auth
│   └── server.js
└── Dockerfile
```

## Run Locally

### Requirements

- Node.js 18 or later
- MongoDB Atlas account or a local MongoDB database

### 1. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 2. Set Up the Frontend

Open a separate terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open http://localhost:5173 in your browser and register an account to get started.

**Note:** The first registered account receives the Admin role.

## Deployment

### Backend — Vercel

The backend is deployed on Vercel.

Configure these environment variables in the Vercel project settings:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` — set to the deployed Netlify website URL
- `PORT` — if required by the deployment configuration

**Backend URL:** https://student-management1-pi.vercel.app/

### Frontend — Netlify

The frontend is deployed on Netlify.

- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (relative to the `client` base directory)
- **Environment variable:** `VITE_API_URL=https://student-management1-pi.vercel.app/api`

**Live Website:** https://student-management-system4.netlify.app

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/students?search=&page=&limit=` | Authenticated |
| GET | `/api/students/stats` | Authenticated |
| GET | `/api/students/:id` | Authenticated |
| POST | `/api/students` | Authenticated |
| PUT | `/api/students/:id` | Admin only |
| DELETE | `/api/students/:id` | Admin only |

## Author

**Unsa Rani**

Full Stack Developer | MERN Stack
