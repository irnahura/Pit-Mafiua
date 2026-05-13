// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Check if Firebase config is available
const hasFirebaseConfig = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Initialize Firebase (client-side only)
const initializeFirebase = (): Auth | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if Firebase config is available
  if (!hasFirebaseConfig) {
    console.warn('⚠️ Firebase configuration not found. Please set up your .env.local file.');
    console.warn('📝 Copy .env.example to .env.local and add your Firebase config.');
    return null;
  }

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');
    return auth;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('📝 Please check your .env.local file and ensure all Firebase config values are correct.');
    return null;
  }
};

// Get Firebase Auth instance
export const getFirebaseAuth = (): Auth | null => {
  if (!auth && typeof window !== 'undefined') {
    return initializeFirebase();
  }
  return auth;
};

// Export app for Firestore
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!app && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return app;
};

export { app, auth };
