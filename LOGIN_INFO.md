# Dashboard Login Information

## 🔐 Firebase Authentication Login

This portfolio uses **Firebase Authentication** for admin login. You need to create a user account in Firebase Console.

## 📝 How to Create Login Credentials

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **portfolio-71526**
3. Go to **Authentication** in left sidebar
4. Click **Get started** (if first time)
5. Go to **Sign-in method** tab
6. Click on **Email/Password**
7. Enable **Email/Password** provider
8. Click **Save**

### Step 2: Create Admin User

1. In Firebase Console, go to **Authentication** > **Users** tab
2. Click **Add user** button
3. Enter:
   - **Email**: Your email (e.g., `admin@example.com`)
   - **Password**: Your password (at least 6 characters)
4. Click **Add user**

### Step 3: Login to Dashboard

1. Open your app: `http://localhost:5173/login`
2. Enter the email and password you just created
3. Click **Sign In**
4. You'll be redirected to `/dashboard`

## 🔑 Login Credentials

After creating user in Firebase Console, use:
- **Email**: The email you entered in Firebase Console
- **Password**: The password you entered in Firebase Console

**Note:** There's no default password. You must create a user in Firebase Console first.

## 🆘 Troubleshooting

### Can't login?
- Make sure Email/Password provider is enabled
- Make sure you created a user in Firebase Console > Authentication > Users
- Check email and password are correct
- Check browser console for errors

### "auth/user-not-found" error?
- User doesn't exist in Firebase Authentication
- Create user in Firebase Console > Authentication > Users

### "auth/wrong-password" error?
- Wrong password entered
- Reset password in Firebase Console or create new user

## 🔄 Google Login (Optional)

Google login is also available:
1. Enable Google provider in Firebase Console > Authentication > Sign-in method
2. Follow `GOOGLE_AUTH_SETUP.md` for detailed setup
3. Click "Continue with Google" button on login page

## ✅ Quick Setup

1. Firebase Console > Authentication > Sign-in method > Enable Email/Password
2. Firebase Console > Authentication > Users > Add user
3. Login with those credentials

That's it! 🎉




