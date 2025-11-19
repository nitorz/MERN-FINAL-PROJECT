# SDG Tracker - MERN Stack Application Documentation

## 1. Overview

**SDG Tracker** is a web application designed to help users monitor and track their sustainable development habits. The app focuses on promoting activities aligned with **Sustainable Development Goals (SDGs)**, such as planting trees, saving energy, and practicing eco-friendly habits.  

The app is built using the **MERN stack**:

- **MongoDB**: Database for storing users and habits  
- **Express.js**: Backend API for handling requests  
- **React.js**: Frontend user interface  
- **Node.js**: Backend server runtime  

It is fully **responsive** and mobile-friendly, making it usable on both desktop and mobile devices.

---

## 2. Features

1. **User Authentication**  
   - Registration and Login with email and password  
   - Passwords are hashed with **bcrypt**  
   - JWT tokens are used for authentication and authorization  

2. **Dashboard**  
   - Overview of user progress  
   - Shows completed and pending SDG-aligned habits  

3. **Habits Tracking**  
   - Users can view their personal habit list  
   - Each habit can be marked as completed  
   - Responsive card layout for mobile and desktop  

4. **Navigation**  
   - Header dynamically shows links based on login state  
   - Mobile-friendly design  

5. **Mobile-Friendly UI**  
   - Tailwind CSS for responsive design  
   - Forms and buttons optimized for touch devices  

---

## 3. Installation Instructions

### Prerequisites
- Node.js (v18 or higher recommended)  
- npm (comes with Node.js)  
- MongoDB account (Cloud Atlas recommended)  

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/sdg-tracker.git
cd sdg-tracker
Step 2: Set Up Backend
bash
Copy code
cd server
npm install
Create a .env file in the server folder:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Replace your_mongodb_connection_string with your MongoDB Atlas URI.

Start the backend server:

bash
Copy code
npm run dev
The backend runs on http://localhost:5000.

Step 3: Set Up Frontend
Open a new terminal window/tab:

bash
Copy code
cd client
npm install
npm start
The frontend will run on http://localhost:3000.

Step 4: Using the App
Open http://localhost:3000 in a browser.

Navigate to Register to create a new account.

Log in to access the Dashboard and Habits pages.

Track your SDG-related habits.

Log out when done.

4. Project Structure
pgsql
Copy code
sdg-tracker/
│
├── client/             # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Habits.jsx
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   └── api.js       # Axios API instance
│   └── package.json
│
├── server/             # Node/Express backend
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── README.md           # Documentation
5. Backend Routes
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and return JWT token

All routes are JSON-based and communicate via Axios from the frontend.

6. Frontend Components
Header.jsx: Mobile-responsive navigation bar with conditional links

Home.jsx: Landing page with welcome message

Login.jsx: Login form with token storage and redirect

Register.jsx: Registration form with redirect

Dashboard.jsx: Displays user’s SDG progress

Habits.jsx: Shows habit cards with completion status

7. Technologies Used
React.js + React Router

Tailwind CSS for responsive UI

Node.js + Express.js

MongoDB Atlas

Axios for API requests

bcrypt for password hashing

JSON Web Tokens (JWT) for authentication

8. Notes & Recommendations
For production, use HTTPS and a secure JWT secret.

Consider adding habit creation/editing for a more complete tracker.

Mobile-friendly features include responsive forms, buttons, and grid layouts.

You can deploy the frontend on Netlify/Vercel and backend on Railway/Render for cloud access.



For production build (single host):
- `cd client && npm run build`
- Serve build from server (see server/README.md)

