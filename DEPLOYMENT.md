# GuideGo Deployment Guide

Follow these steps to deploy the GuideGo platform to production.

## 1. Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and copy the connection string.
3. In Network Access, allow access from all IPs (`0.0.0.0/0`) for Render deployment compatibility.

## 2. Backend: Render
1. Push your code to a GitHub repository.
2. Sign in to [Render](https://render.com) and create a new **Web Service**.
3. Select your repository.
4. **Configuration**:
   - **Environment**: `Docker` (Render will automatically detect the `Dockerfile`).
   - **Instance Type**: `Free` or `Starter`.
5. **Environment Variables**:
   Add the following variables in the Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas string.
   - `JWT_SECRET`: A long random string.
   - `GEMINI_API_KEY`: Your Google AI key.
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
   - `NODE_ENV`: `production`

## 3. Frontend: Vercel
1. Sign in to [Vercel](https://vercel.com) and import your repository.
2. **Configuration**:
   - **Framework Preset**: `Vite`.
   - **Root Directory**: `frontend`.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
3. **Environment Variables**:
   - `VITE_API_URL`: The URL provided by Render (e.g., `https://guidego-backend.onrender.com`).

## 4. Final Verification
1. Once both are deployed, visit your Vercel URL.
2. Check if the login/register flows work.
3. Perform a test booking to verify Razorpay and Socket.io connectivity.

---
**Note**: For real-time location tracking, ensure your Render backend is not in 'Sleep' mode (Free tier limitation).
