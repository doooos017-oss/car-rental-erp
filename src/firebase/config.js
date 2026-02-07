import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Firebase configuration with defaults for development
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDummyKeyForTesting1234567890',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'test-project.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'test-project',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'test-project.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef1234567890'
}

let app
let auth
let db
let storage
let functions
const isDevelopment = process.env.NODE_ENV === 'development'

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  functions = getFunctions(app)

  // Use emulators in development if using test values
  if (isDevelopment && firebaseConfig.projectId === 'test-project') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectStorageEmulator(storage, 'localhost', 9199)
      connectFunctionsEmulator(functions, 'localhost', 5001)
    } catch (error) {
      // Emulators might not be running, which is fine for local development
      console.log('Firebase emulators not available - using development defaults')
    }
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error.message)
}

export { auth, db, storage, functions }
export default app
