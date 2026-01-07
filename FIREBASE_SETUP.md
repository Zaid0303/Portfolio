# Firebase Setup Guide - Complete Instructions

## Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "My Portfolio")
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" switch
   - Click "Save"
4. Create your admin user:
   - Go to "Users" tab
   - Click "Add user"
   - Enter email and password
   - Save credentials (you'll need them to login)

### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose production mode (or test mode for development)
4. Select location (choose closest to your users)
5. Click "Enable"

### 4. Set Firestore Security Rules

Go to **Firestore Database** > **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Messages collection - anyone can create, only authenticated can read
    match /messages/{messageId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

Click "Publish" to save rules.

### 5. Enable Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Start in production mode
4. Click "Next"
5. Use default storage location or choose custom
6. Click "Done"

### 6. Set Storage Security Rules

Go to **Storage** > **Rules** tab and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click "Publish" to save rules.

### 7. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on Web icon (`</>`) to add web app
4. Register app:
   - App nickname: "Portfolio Web App"
   - Don't check "Firebase Hosting" (unless you want it)
   - Click "Register app"
5. Copy the Firebase configuration object
6. It will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 8. Update Firebase Config in Project

1. Open `src/firebase/firebaseConfig.js`
2. Replace the placeholder values with your actual Firebase config:
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

### 9. Firestore Collections Structure

Your Firestore will automatically create these collections when you use the app:

- **projects** - Portfolio projects
- **about** - About section data (single document: `profile`)
- **services** - Services offered
- **messages** - Contact form messages
- **settings** - App settings (single document: `theme`)

No need to create them manually - they'll be created automatically when you add data.

## Testing Your Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Test authentication:
   - Go to `/login`
   - Login with your Firebase credentials
   - You should be redirected to `/dashboard`

4. Test Firestore:
   - In dashboard, try adding a project
   - Check Firebase Console > Firestore to see the data

5. Test Storage:
   - Try uploading an image for a project
   - Check Firebase Console > Storage to see uploaded files

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains

### Issue: "Missing or insufficient permissions"
**Solution**: Check Firestore security rules and make sure they allow read/write as needed

### Issue: "Storage rules violation"
**Solution**: Check Storage security rules in Firebase Console > Storage > Rules

### Issue: Can't login
**Solution**: 
- Make sure Email/Password provider is enabled
- Check that you created a user in Authentication > Users
- Verify Firebase config is correct

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Install dependencies: `npm install`
3. ✅ Update Firebase config
4. ✅ Start app: `npm run dev`
5. ✅ Login to dashboard
6. ✅ Add your first project
7. ✅ Upload profile image
8. ✅ Add services
9. ✅ Customize content

Your portfolio is ready to use! 🎉




