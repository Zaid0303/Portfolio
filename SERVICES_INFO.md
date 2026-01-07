# Services Section Information

## 📋 Services Section - Dynamic Content

The **Services** section is **dynamic** and loads data from Firebase Firestore.

## 🔍 How It Works

1. **Loads from Firestore**: The component tries to load services from `services` collection
2. **Default Services**: If no data in Firestore, it shows 4 default services:
   - Graphic Designing
   - Web Development
   - App Development
   - Video Editing

## ✅ Services Should Show By Default

Even if you haven't added services to Firestore yet, **default services will show** on the website. 

If services are NOT showing:

1. **Check browser console** for errors
2. **Check Firebase connection** - make sure Firebase config is correct
3. **Check Firestore** - make sure Firestore is enabled in Firebase Console

## 📝 Adding Services (Admin Dashboard)

1. Login to dashboard: `/login`
2. Go to **Services** section in sidebar
3. Click **Add Service**
4. Fill in:
   - Title (e.g., "Web Development")
   - Description
   - Icon (select from dropdown)
5. Click **Save**

Services will appear on the website automatically!

## 🎯 Default Services

If Firestore has no services, these default services will show:

1. **Graphic Designing**
   - Icon: Palette
   - Description: "Creating stunning visual designs, logos, and brand identities that make your business stand out."

2. **Web Development**
   - Icon: Code
   - Description: "Building responsive, modern web applications with the latest technologies and best practices."

3. **App Development**
   - Icon: Smartphone
   - Description: "Developing native and cross-platform mobile applications for iOS and Android devices."

4. **Video Editing**
   - Icon: Video
   - Description: "Professional video editing, motion graphics, and post-production services for your content."

## 🔧 Troubleshooting

### Services not showing?
- Check browser console for errors
- Make sure Firebase is connected
- Refresh the page
- Check Firestore collection: `services`

### Want to customize services?
- Use Admin Dashboard > Services section
- Add, edit, or delete services
- Changes appear immediately on website

## 💡 Note

Services section is **fully dynamic** - you can manage it from the admin dashboard without editing code!




