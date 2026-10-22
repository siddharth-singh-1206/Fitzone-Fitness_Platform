# FitZone 🏋️‍♂️

> A full-stack MERN fitness and gym management platform

![FitZone Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop)

## ✨ Features

### Public
- Browse gym facilities with descriptions and images
- View trainer profiles with specializations and experience
- Compare membership plans side by side
- Submit contact/enquiry form

### Registered Users
- Secure registration and login (JWT)
- Select a membership plan
- View current membership details (status, days remaining)

### Admin Dashboard
- Full CRUD: Users, Trainers, Facilities, Plans, Memberships, Enquiries
- Dashboard with live statistics
- Toggle enquiry status (new ↔ resolved)
- Update membership status

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Security | Helmet, express-rate-limit |
| HTTP Client | Axios |
| UI | Tailwind CSS, Lucide React icons, react-hot-toast |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fitzone.git
cd fitzone
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Seed the database
```bash
# In the server directory
npm run seed
```

### 4. Setup the client
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/fitzone` |
| `JWT_SECRET` | Secret for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (`client/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🌱 Seed Accounts
After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fitzone.com | admin123 |
| User | john@example.com | user123 |

---

## 📡 API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Auth |
| GET | `/api/trainers` | Public |
| GET | `/api/facilities` | Public |
| GET | `/api/plans` | Public |
| POST | `/api/enquiries` | Public |
| POST | `/api/memberships` | User |
| GET | `/api/memberships/my` | User |
| GET | `/api/users` | Admin |
| ... | *(see PROJECT_SPEC.md for full list)* | ... |

---

## 📁 Project Structure

```
fitzone/
├── server/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, error handling, validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── utils/          # Token generation, seed script
│   └── server.js       # Entry point
├── client/
│   └── src/
│       ├── api/        # Axios instance
│       ├── components/ # Navbar, Footer, shared components
│       ├── context/    # AuthContext
│       └── pages/      # All page components
│           └── admin/  # Admin dashboard pages
├── PROJECT_SPEC.md
└── README.md
```

---

## 🚢 Deployment

### Backend → Render
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`

### Frontend → Vercel
1. Import project on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add environment variable: `VITE_API_URL` (your Render URL + `/api`)

---

## 📸 Screenshots

> *Coming soon — add screenshots here after deployment*

---

## 📝 License

MIT
