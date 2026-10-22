# FitZone 🏋️

A full-stack MERN fitness and gym management platform.

![FitZone Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop)

## About the Project

FitZone is a modern fitness and gym management web application built using MongoDB, Express.js, React.js, and Node.js. It allows visitors to explore gym facilities, view trainers, compare membership plans, and submit enquiries.

Registered users can securely create accounts, log in, select membership plans, and view their membership details. Administrators can manage users, trainers, facilities, plans, memberships, and customer enquiries through a dedicated dashboard.

## Features

### Public
- Browse gym facilities and descriptions
- View trainer profiles and specializations
- Compare membership plans
- Submit contact enquiries

### Registered Users
- Secure registration and login using JWT
- Select membership plans
- View membership status and days remaining

### Admin Dashboard
- CRUD operations for users, trainers, facilities, plans, memberships, and enquiries
- Dashboard statistics
- Manage enquiry status
- Update membership status

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Security | Helmet, express-rate-limit |
| HTTP Client | Axios |
| UI | Lucide React, react-hot-toast |
| Testing | Postman |

## Project Structure

```text
fitzone/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
│           └── admin/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── PROJECT_SPEC.md
├── fitzone.postman_collection.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18 or later
- MongoDB local installation or MongoDB Atlas

### 1. Clone the Repository

```bash
git clone https://github.com/siddharth-singh-1206/Fitzone-Fitness_Platform.git
cd Fitzone-Fitness_Platform
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env`, then configure your environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env` and configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend is typically available at `http://localhost:5173`.

### 4. Seed the Database

If your backend provides a seed script, run it from the `server` directory using the script configured in `server/package.json`.

## Environment Variables

### Backend — `server/.env`

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `PORT` | Backend server port |
| `CLIENT_URL` | Frontend URL for CORS |

### Front