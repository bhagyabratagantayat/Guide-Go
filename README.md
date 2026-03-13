# GuideGo | AI-Powered Smart Tourism

GuideGo is a comprehensive, modern travel and tourism platform that bridges the gap between tourists and verified local guides. Designed with a premium tech stack, it features smart AI itinerary planning, real-time geolocation tracking, immersive audio guides, and a complete admin management ecosystem.

## 🌟 Key Features

### For Tourists
* **Smart Discovery:** Explore tourist spots via an interactive map or list view (powered by Leaflet.js and OpenStreetMap).
* **AI Travel Assistant:** Plan trips, get local insights, and ask travel-related questions using our Google Gemini-powered AI chatbot.
* **Smart Audio Guides:** Listen to rich, auto-generated historic narratives and descriptions of places using the browser's Text-to-Speech synthesis.
* **Guide Booking:** Browse verified local guides, view their languages/skills, and securely book them with our built-in demo payment system (Cash on Service & UPI).
* **Real-Time Tracking:** Watch your booked guide move towards you in real-time on the map using Socket.io telemetry.

### For Guides
* **Professional Profile:** Create a profile showcasing expertise, languages, experience, and hourly rates.
* **Live Broadcasting:** Toggle "Go Live" to broadcast your real-time location to nearby tourists, increasing booking chances.
* **Booking Management:** Receive and fulfill tourist bookings.

### For Administrators
* **Centralized Dashboard:** Monitor platform metrics like total revenue, active users, and booking statuses.
* **Guide Verification Pipeline:** Review, approve, or reject pending guide applications to maintain a premium ecosystem.
* **Location Management (CRUD):** Add and manage tourist places with rich descriptions, categories, and Cloudinary-hosted images.
* **User Oversight:** Moderate the tourist network and assign administrative privileges via role-based access control.

## 🛠 Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js, Vite
* **Styling:** Tailwind CSS, custom premium animations
* **Routing:** React Router v6
* **Maps:** React-Leaflet, Leaflet.js
* **Icons & UI:** Lucide React
* **Real-time:** Socket.io-client
* **HTTP Client:** Axios

### Backend (Server-Side)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Real-time:** Socket.io
* **AI Engine:** @google/generative-ai (Gemini API)
* **Cloud Storage:** Cloudinary (for images)
* **Payments:** Internal Demo System (Cash & UPI)

## 🚀 Getting Started

### Prerequisites
Make sure you have installed the following on your local machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/guide-go.git
   cd guide-go
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` directory based on the `.env.example` file.

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_super_secret_key

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the `frontend` directory (if you want to override the default API URL, though Vite defaults `localhost:3000` inside your Axios setup):
```env
VITE_API_URL=http://localhost:3000
```

### Running the Application

1. **Start the Backend Server (Terminal 1)**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open in Browser**
   * Navigate to `http://localhost:5173` to view the app.

## 🔒 Security & Architecture
* **Role-Based Access Control (RBAC):** Middleware protects admin and guide-specific routes preventing unauthorized actions.
* **XSS Sanitization & Rate Limiting:** Global rate limiting is applied through Express, and cross-site scripting vulnerabilities are patched with Helmet & express-xss-sanitizer.
* **Scalable Data Fetching:** Optimized React component life cycles alongside context-driven global state management.

## 📜 License
This project is licensed under the MIT License.
