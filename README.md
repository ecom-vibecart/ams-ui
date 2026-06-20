# ams-ui

Admin dashboard for Account Management — manage users, customers, roles, and account activity.

**Port:** `3000` (default — set `PORT` in `.env` to avoid conflict with app-ui)  
**React:** 19.2.7 | **React Router:** 7.18.0 | **Framework:** Create React App

---

## Features

- User and customer list with search and filter
- Create, edit, and deactivate accounts
- Role assignment (ROLE_CUSTOMER, ROLE_ADMIN)
- Customer address management
- Alert dialogs for destructive actions (SweetAlert2)

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | 19.2.7 | UI framework |
| `react-router-dom` | 7.18.0 | Client-side routing (React Router v7) |
| `@reduxjs/toolkit` | 2.12.0 | State management |
| `react-redux` | 9.3.0 | React–Redux bindings |
| `axios` | 1.18.0 | HTTP client |
| `bootstrap` | 5.3.8 | CSS framework |
| `react-icons` | 5.6.0 | Icon set |
| `sweetalert2` | 11.26.25 | Alert/confirmation dialogs |

> **Note:** This app uses React Router **v7** (vs v6 in the other UIs). The routing API is largely compatible but has some changes to loader/action patterns.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Production build
npm run build
```

---

## Environment Variables

Create a `.env` file in this directory:

```
PORT=3003
REACT_APP_API_URL=http://localhost:5001
```

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | API Gateway base URL |
| `PORT` | Dev server port (set to 3003 to avoid conflict with app-ui on 3000) |

---

## API Integration

```
Base URL: REACT_APP_API_URL
Accounts: /api/v1/vibe-cart/accounts/**
```

---

## Project Structure

```
src/
├── App.js
├── index.js
└── components/
    ├── Users/      # Admin user management
    ├── Customers/  # Customer account management
    └── common/     # Shared layout, nav, alerts
```
