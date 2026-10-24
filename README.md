# Student Management System (MERN)

React + Node.js + Express + MongoDB. Built for Devixo Solutions Web Development Internship, Task 03.

## Features
- Register, login, logout (JWT + bcrypt)
- Add, edit, delete, search and view students
- Dashboard: total students, added this week, courses, recent registrations, search bar
- Responsive layout, form validation, loading indicators
- Bonus: pagination (8 per page) and role-based access
  - Admin: full access (add, edit, delete)
  - User: view, search and add only
  - The first account registered becomes the Admin

## Setup

Requirements: Node.js 18+ and MongoDB (local, or a free MongoDB Atlas URI).

### 1. Backend
```
cd server
npm install
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### 2. Frontend
```
cd client
npm install
npm run dev
```
Opens on http://localhost:5173 (API calls are proxied to port 5000).

For deployment, set `VITE_API_URL` (frontend) to your backend URL + `/api`, and `CLIENT_URL` (backend) to your frontend URL.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/students?search=&page=&limit= | logged in |
| GET | /api/students/stats | logged in |
| GET | /api/students/:id | logged in |
| POST | /api/students | logged in |
| PUT | /api/students/:id | admin |
| DELETE | /api/students/:id | admin |
