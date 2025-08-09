# Timesheet Management App

A full-stack timesheet management system with **Node.js + Express** backend (`timesheet-backend`) and **React (Vite) + Tailwind CSS** frontend (`timesheet-frontend`).  
Managers can assign tasks and view summaries, while associates can log their work hours.

---

## 🚀 Features
- Manager: Assign tasks, track progress, view timesheet summaries.
- Associate: View tasks, submit timesheets.
- Auth Protected APIs with JWT.
- **Tech Stack**: React (Vite), Tailwind CSS, Axios, Node.js, Express, MongoDB.

---

## 🔧 Setup

### Backend (`timesheet-backend`)
cd timesheet-backend
npm install
npm run dev
Create .env:

Edit
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret


Frontend (timesheet-frontend)
Edit
cd timesheet-frontend
npm install
npm run dev
Create .env:

Edit
VITE_API_URL=http://localhost:5000/api
🔑 API Authentication
Use Bearer token from login API:

Edit
Authorization: Bearer <your_token>


System Architecture

Backend (timesheet-backend):
Built with Node.js and Express.
MongoDB for data storage.
JWT for authentication and route protection.
Endpoints for authentication, task management, and timesheet logging.

Frontend (timesheet-frontend):
Built with React (Vite) + Tailwind CSS.
Uses Axios for API communication.
Provides role-based UI for managers and associates.

Data Flow:
Frontend UI → Axios HTTP Request → Backend API (Express) → MongoDB  
              ↑                                              ↓  
       API Response  ←——————————— JSON Data ————————————
User Flows
1. Manager
Logs into the system.
Assigns tasks to associates.
Views all assigned tasks.
Checks the Timesheet Summary to compare estimated vs actual hours.

2. Associate
Logs into the system.
Views assigned tasks.
Submits actual work hours via timesheet entry.
reviews past submissions.



