# GuideGo | AI-Powered Smart Tourism

GuideGo is a professional, production-level travel and tourism platform designed to provide a premium experience for tourists while empowering local guides. Built with a modern tech stack, it features smart AI itinerary planning, real-time geolocation tracking, immersive audio guides, and a robust role-based administrative ecosystem.

## 🌟 Key Features

### 🛡️ Core Authentication & Security
*   **Production-Ready Auth:** Secure login and registration with hashed passwords and JWT-based session management.
*   **OTP Email Verification:** Mandatory mobile/email OTP verification for all new users to ensure a verified community.
*   **Role-Based Access Control (RBAC):** Distinct permissions and UI dashboards for **Users**, **Guides**, and **Admins**.

### 🗺️ For Users (Travelers)
*   **Smart Discovery:** Explore destinations via an interactive map or list view (powered by Leaflet.js).
*   **Real-Time Booking:** Uber-style guide booking with live matching and status tracking.
*   **Audio Guides:** Immersive, AI-generated audio stories for landmarks.
*   **AI Itinerary:** Personalized travel planning based on preferences.

### 🏠 For Local Guides
*   **Professional Dashboard:** Manage your profile, expertise, and hourly rates.
*   **Live Connectivity:** Toggle "Go Live" to broadcast your real-time location to nearby users.
*   **Booking Management:** Seamlessly track and fulfill upcoming user bookings.
*   **Profile Customization:** Showcase expertise, languages, and pricing.

### ⚡ For Administrators
*   **User Management:** Oversee and manage the community of users and guides.
*   **Content Management:** Full CRUD capabilities for destination places with Cloudinary-hosted imagery.

## 🛠 Tech Stack

| Frontend | Backend | Infrastructure |
| :--- | :--- | :--- |
| **React.js** (Vite) | **Node.js** (Express) | **MongoDB Atlas** |
| **Tailwind CSS** | **Socket.io** | **Cloudinary** (Media) |
| **Framer Motion** | **Google Gemini AI** | **Vercel** (Frontend) |
| **Lucide React** | **JWT & Bcrypt** | **Render** (Backend) |

## 📂 Project Structure

```text
Guide Go/
├── frontend/             # React Client (Vite)
│   ├── src/
│   │   ├── pages/        # User, Guide, and Admin Views
│   │   ├── context/      # Auth & Global State
│   │   └── components/   # Reusable UI Elements
│   └── vercel.json       # Frontend deployment config
├── backend/              # Express Server
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   ├── controllers/      # Business Logic
│   └── middleware/       # Auth & Security Guards
├── package.json          # Root config with unified build scripts
└── DEPLOYMENT.md         # Detailed production guide
```

## 🚀 Getting Started

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
*   API Keys for **Google Gemini** and **Cloudinary**

### 2. Installation & Setup
1.  **Clone & Install Root:**
    ```bash
    git clone https://github.com/bhagyabratagantayat/Guide-Go.git
    cd Guide-Go
    npm install
    ```
2.  **Setup Environment Variables:**
    *   Create `backend/.env` using `backend/.env.example` as a template.
    *   Create `frontend/.env` and set `VITE_API_URL`.

### 3. Running Locally
*   **Development Mode:**
    Run these in separate terminals:
    ```bash
    # Backend
    cd backend && npm run dev
    
    # Frontend
    cd frontend && npm run dev
    ```
*   **Production Build (Root):**
    ```bash
    npm run build
    ```

## 🌐 API Overview
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User/Guide registration |
| `POST` | `/api/auth/verify-otp` | OTP Email verification |
| `GET` | `/api/places` | Fetch all tourist places |
| `GET` | `/api/admin/dashboard` | Admin analytics (Protected) |
| `POST` | `/api/ai/chat` | Gemini AI Travel Assistant |

## 📜 License
This project is licensed under the MIT License.

