# Professional Portfolio Website with Admin Dashboard

A complete professional portfolio website built with ReactJS (JSX), Firebase, and Tailwind CSS.

## Features

- **Public Portfolio**: Showcase your work, skills, and services
- **Admin Dashboard**: Full CRUD operations for managing portfolio content
- **Firebase Integration**: Firestore Database and Storage
- **Theme Toggle**: Light/Dark mode support
- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Framer Motion integration

## Tech Stack

- ReactJS (JSX)
- Tailwind CSS
- Firebase (Firestore & Storage)
- Framer Motion
- React Router
- React-Typed

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage
6. Copy your Firebase config
7. Update `src/firebase/firebaseConfig.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firestore Collections Structure

#### Projects Collection
```
projects/
  {projectId}/
    title: string
    category: string (Graphic Designing | Web Projects | App Development | Video Editing)
    description: string
    techStack: array
    imageUrl: string
    videoUrl: string (optional)
    createdAt: timestamp
```

#### About Collection
```
about/
  profile/
    text: string
    skills: array
    profileImageUrl: string
    experience: object
```

#### Services Collection
```
services/
  {serviceId}/
    title: string
    description: string
    icon: string
```

#### Contact Messages Collection
```
messages/
  {messageId}/
    name: string
    email: string
    message: string
    createdAt: timestamp
```

#### Settings Collection
```
settings/
  theme/
    defaultTheme: string (light | dark)
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Usage

### Admin Dashboard

1. Navigate to `/login`
2. Login with Firebase Auth credentials
3. Manage projects, about section, services, CV, and messages

### Public Portfolio

- View projects by category
- Download CV
- Contact form
- Responsive design for all devices

## Project Structure

```
src/
├── components/        # Public portfolio components
├── pages/            # Main pages (Home, ProjectDetail, Login)
├── dashboard/        # Admin dashboard components
├── firebase/         # Firebase configuration and services
├── context/          # React contexts (Theme)
├── App.jsx           # Main app component with routing
└── main.jsx          # Entry point
```

## License

MIT

