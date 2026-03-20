# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Uber-Style Booking & Discovery System
Implement a real-time, on-demand booking system for guides and a budget stay finder for tourists.

User Review Required
IMPORTANT

The "Book Now" feature will initiate a real-time request to nearby guides. Users will see a "Searching..." state until a guide accepts.

Proposed Changes
Backend
[NEW] 
Hotel.js
Define schema for budget hotels and homestays.
[NEW] 
hotelController.js
 & 
hotelRoutes.js
Implement endpoints for fetching all and nearby hotels.
[MODIFY] 
bookingController.js
Ensure socket notifications include correct payloads for on-demand booking.
Frontend
[MODIFY] 
ExploreMap.jsx
Replace mock data with real API calls to /api/hotels, /api/restaurants, and /api/guides/nearby.
Implement real-time createBooking and socket-based status tracking.
Sync bookingStage with server-sent updates.
[MODIFY] 
Home.jsx
Update "Hotels" and "Find Guide" actions to link to filtered states in 
ExploreMap
.
Verification Plan
Automated Tests
 Use browser_subagent to verify:
Login as Tourist -> Book a Guide on Map.
Verify "Searching..." state appears.
Login as Guide in another session -> Accept Booking.
Verify Tourist UI updates to "Guide Assigned".
Manual Verification
 Verify hotel markers show up correctly on the map in Odisha.
 Verify audio guide triggers for real locations.
Agent
Guide Go





AI may make mistakes. Double-check all generated code.