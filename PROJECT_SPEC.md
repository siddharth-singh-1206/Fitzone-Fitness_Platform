# FitZone — Project Specification

## Overview
FitZone is a responsive full-stack web application for a fitness startup. Visitors explore facilities, trainers, services, and membership plans. Registered users log in, select a plan, and view their membership. Admins manage everything through a dashboard.

**Stack:** MongoDB · Express.js · React.js (Vite) · Node.js · REST APIs · JWT auth · bcrypt · Tailwind CSS

---

## Roles
| Role | Capabilities |
|------|-------------|
| Visitor | Browse public pages, submit enquiry |
| User | Everything above + register/login, select plan, view membership |
| Admin | Full CRUD on all resources, view all users/memberships/enquiries |

---

## Data Models

| Model | Key Fields |
|-------|-----------|
| User | name, email (unique), password (hashed, select:false), role (user\|admin) |
| Trainer | name, specialization, experience, bio, image, isActive |
| Facility | name, description, image, isActive |
| Plan | name, price, durationInDays, features[], isPopular |
| Membership | user (ref), plan (ref), startDate, endDate, status (active\|expired\|cancelled) |
| Enquiry | name, email, phone, message, status (new\|resolved) |

All models include `timestamps: true`.

---

## API Routes

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/trainers | Public |
| GET | /api/trainers/:id | Public |
| POST | /api/trainers | Admin |
| PUT | /api/trainers/:id | Admin |
| DELETE | /api/trainers/:id | Admin |
| GET | /api/facilities | Public |
| GET | /api/facilities/:id | Public |
| POST | /api/facilities | Admin |
| PUT | /api/facilities/:id | Admin |
| DELETE | /api/facilities/:id | Admin |
| GET | /api/plans | Public |
| GET | /api/plans/:id | Public |
| POST | /api/plans | Admin |
| PUT | /api/plans/:id | Admin |
| DELETE | /api/plans/:id | Admin |
| POST | /api/enquiries | Public |
| GET | /api/enquiries | Admin |
| PUT | /api/enquiries/:id | Admin |
| DELETE | /api/enquiries/:id | Admin |
| POST | /api/memberships | User |
| GET | /api/memberships/my | User |
| GET | /api/memberships | Admin |
| PUT | /api/memberships/:id | Admin |
| DELETE | /api/memberships/:id | Admin |
| GET | /api/users | Admin |
| GET | /api/users/:id | Admin |
| PUT | /api/users/:id | Admin |
| DELETE | /api/users/:id | Admin |

---

## Pages

| Path | Page | Access |
|------|------|--------|
| / | Home | Public |
| /facilities | Facilities | Public |
| /trainers | Trainers | Public |
| /plans | Plans | Public |
| /contact | Contact | Public |
| /login | Login | Public |
| /register | Register | Public |
| /my-membership | My Membership | User |
| /admin | Admin Dashboard | Admin |
| /admin/users | Admin Users | Admin |
| /admin/trainers | Admin Trainers | Admin |
| /admin/facilities | Admin Facilities | Admin |
| /admin/plans | Admin Plans | Admin |
| /admin/memberships | Admin Memberships | Admin |
| /admin/enquiries | Admin Enquiries | Admin |
| * | 404 | Public |

---

## Seed Data (npm run seed in /server)
- Admin: admin@fitzone.com / admin123
- User: john@example.com / user123
- 4 Trainers, 4 Facilities, 3 Plans (Basic $29, Pro $59, Elite $99)

---

## Non-Functional Requirements
- Responsive on mobile, tablet, desktop
- Passwords hashed with bcrypt (10 rounds); JWT on protected routes; input validation on all writes
- Consistent error responses: `{ success: false, message: '...' }`
- Consistent success responses: `{ success: true, data: ... }`
- Helmet + rate limiting on auth routes
- No secrets in repo; all env vars in .env (gitignored)
- Modular folder structure; clean, readable code
