# Notes App

A full-stack note-taking application with passwordless email OTP and Google OAuth authentication, built with React (Vite) frontend and Node.js/Express/MongoDB backend.

## Features
- Email + OTP authentication (passwordless)
- Google OAuth login
- Notes CRUD (Create, Read, Update, Delete)
- JWT-based authentication
- Responsive UI (Tailwind CSS)
- Deployed on Railway (backend) and Vercel (frontend)
- Email sending via SendGrid

## Live Frontend
- [https://notesapp-kappa-dusky.vercel.app/](https://notesapp-kappa-dusky.vercel.app/)

## Getting Started

### 1. Clone the repository
```
git clone https://github.com/Aryan16032004/NotesApp.git
cd NotesApp
```

### 2. Setup Backend
```
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url/auth/google/callback
FRONTEND_URL=https://your-frontend-url
```

Build and start backend (for production):
```
npm run build
npm start
```
For development:
```
npm run dev
```

### 3. Setup Frontend
```
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=https://your-backend-url
```

Start frontend (for development):
```
npm run dev
```
For production build:
```
npm run build
```

## Deployment
- Backend: Deploy to Railway (set environment variables in Railway dashboard)
- Frontend: Deploy to Vercel (set VITE_API_URL in Vercel dashboard)

## Environment Variables

### Backend `.env` example
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url/auth/google/callback
FRONTEND_URL=https://your-frontend-url
```

### Frontend `.env` example
```env
VITE_API_URL=https://your-backend-url
```

## Project Notes

- This app supports passwordless login using email OTP and Google OAuth.
- OTPs are sent to the user's email using SendGrid.
- **Important:** OTPs are stored in the `OTP` collection in your database for verification.
- For development and debugging, you can view OTPs directly in the database (e.g., MongoDB Atlas dashboard).
- The backend is built with Node.js/Express/TypeScript and deployed on Railway.
- The frontend is built with React (Vite) and deployed on Vercel.
- All environment variables must be set correctly for both backend and frontend to work.
- For any issues with email delivery, check your SendGrid sender verification and API key.
- Check spam folder for OTP

## License
MIT