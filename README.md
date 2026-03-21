# GuideGo | AI-Powered Smart Tourism Ecosystem

GuideGo is a high-performance, production-level travel and tourism platform. It bridges the gap between travelers and local experts through real-time geolocation, AI-driven planning, and a robust role-based operational framework.

---

## 🎭 The GuideGo Ecosystem (Role-Based Features)

### 🌍 1. For Users (Travelers)
The traveler experience is focused on discovery, immersion, and seamless logistics.

*   **Interactive Discovery Map**: Real-time Leaflet-based map to find nearby sacred sites, luxury hotels, and top-rated restaurants.
*   **GuideGo Voice (Audio Guides)**: Immersive, multi-language audio narration for heritage sites ("Hear the legends, feel the culture").
*   **AI Trip Planner**: Intelligent itinerary generation based on destination, duration, and budget (Powered by Google Gemini).
*   **WhatsApp-Style "Stories"**: Visual destination highlights using a modern, glowing-ring status interface.
*   **Smart Search & Filters**: Granular search across all categories (Heritage, Nature, Spiritual) with localized city filters.
*   **Digital Booking Receipts**: Instant, beautiful glassmorphic receipts for every guide booking.
*   **Weather Intelligence**: Live mini-weather widget tracking humidity, wind, and travel suggestions.
*   **Secure Payments**: Integrated booking workflow with pending/confirmed status tracking.

### 🛡️ 2. For Local Guides
The guide experience is designed for professional operations and live accessibility.

*   **Operations Dashboard**: Centralized hub for managing active booking requests and completed trips.
*   **"Go Live" Protocol**: A specialized toggle that broadcasts the guide's real-time GPS coordinates to nearby travelers.
*   **Package Management**: Capability to create and customize "Signature Tours" with specialized pricing and durations.
*   **Live Status Indicator**: Visual signal pulses (Pulsating Green) to indicate real-time availability on the global map.
*   **Profile Verification**: Professional onboarding flow requiring Admin approval before accepting bookings.
*   **Direct Communication**: Integrated message/call triggers for seamless traveler coordination.

### ⚡ 3. For Administrators
The admin layer provides full command-and-control over the platform's integrity and growth.

*   **Command Hub (Dashboard)**: Real-time analytics tracking total revenue, active users, and pending guide verifications.
*   **User & Guide Orchestration**: Full visibility into the user database with the ability to toggle roles or remove accounts.
*   **Verification Engine**: Dedicated vetting interface to approve or reject new guide applications based on credentials.
*   **Analytics Visualization**: Stat-card grid for immediate operational awareness (Total bookings, places, and growth).
*   **Content Management**: Control over the global destination database, including categories and atmospheric imagery.

---

## 🚀 Speed Run: One-Click Demo Access
We have implemented a specialized **Demo Portal** for instant evaluation without registration:
1.  Navigate to the **Login Page**.
2.  Use the **Demo Login Buttons** at the bottom.
3.  Choose **User**, **Guide**, or **Admin** to instantly enter their respective dashboards.

---

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Leaflet.js.
- **Backend**: Node.js, Express, MongoDB, Socket.IO (Real-time), JWT & Bcrypt.
- **AI/Cloud**: Google Gemini AI (Itineraries), Brevo (Transactional Emails), Cloudinary (Media).

---

## 📂 Project Structure
```text
Guide Go/
├── frontend/             # React Client (Vite + Glassmorphism)
│   ├── src/pages/        # Specialized dashboards (Admin, Guide, Discovery)
│   ├── src/context/      # Auth & Theme (Dark/Light) logic
│   └── src/components/   # Premium UI components (Sidebar, Receipt, Map)
├── backend/              # Express Server (RBAC + Socket.IO)
│   ├── controllers/      # Role-based business logic
│   ├── middleware/       # Auth & Security Guards
│   └── models/           # Mongoose Schemas (User, Booking, Place)
└── README.md             # Project Roadmap & Feature List
```

---

## 📜 License
This project is licensed under the MIT License - 2026 GuideGo Team.
