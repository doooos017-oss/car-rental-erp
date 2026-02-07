import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'

// Mock users for development
const mockUsers = {
  'admin@test.com': {
    id: 'admin-1',
    email: 'admin@test.com',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin',
    uid: 'admin-1'
  },
  'user@test.com': {
    id: 'user-1',
    email: 'user@test.com',
    password: 'user123',
    displayName: 'Test User',
    role: 'customer',
    uid: 'user-1'
  }
}

export const loginUser = async (email, password) => {
  try {
    // Try Firebase first if configured with real values
    if (auth && auth.app && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      return { user: userCredential.user, userData: userDoc.data() }
    }

    // Fall back to mock login for development
    const mockUser = mockUsers[email]
    if (!mockUser || mockUser.password !== password) {
      throw new Error('بيانات دخول غير صحيحة')
    }

    return {
      user: {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        emailVerified: true
      },
      userData: {
        uid: mockUser.uid,
        email: mockUser.email,
        fullName: mockUser.displayName,
        role: mockUser.role,
        createdAt: new Date()
      }
    }
  } catch (error) {
    throw new Error(error.message || 'فشل تسجيل الدخول')
  }
}

export const registerUser = async (email, password, userData) => {
  try {
    // Try Firebase first if configured with real values
    if (auth && auth.app && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: userData.fullName
      })

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        role: userData.role || 'customer'
      })

      return { user: userCredential.user, userData }
    }

    // Mock registration for development
    const newUser = {
      uid: 'user-' + Date.now(),
      email,
      password,
      displayName: userData.fullName,
      role: userData.role || 'customer',
      createdAt: new Date()
    }

    mockUsers[email] = newUser

    return {
      user: {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        emailVerified: false
      },
      userData: {
        uid: newUser.uid,
        email: newUser.email,
        fullName: newUser.displayName,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    }
  } catch (error) {
    throw new Error(error.message || 'فشل التسجيل')
  }
}

export const logoutUser = async () => {
  try {
    if (auth && auth.currentUser) {
      await signOut(auth)
    }
  } catch (error) {
    throw new Error(error.message || 'فشل تسجيل الخروج')
  }
}

export const resetPassword = async (email) => {
  try {
    if (auth && auth.app && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
      await sendPasswordResetEmail(auth, email)
    } else {
      console.log('Password reset not available in development mode')
    }
  } catch (error) {
    throw new Error(error.message || 'فشل إرسال رابط إعادة تعيين كلمة المرور')
  }
}

export const signInWithGoogle = async () => {
  try {
    if (auth && auth.app && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          fullName: userCredential.user.displayName,
          uid: userCredential.user.uid,
          createdAt: new Date(),
          role: 'customer',
          photoURL: userCredential.user.photoURL
        })
      }

      return { user: userCredential.user, userData: userDoc.data() }
    }

    throw new Error('Google Sign-In not available in development mode')
  } catch (error) {
    throw new Error(error.message || 'فشل تسجيل الدخول عبر Google')
  }
}

export const signInWithFacebook = async () => {
  try {
    if (auth && auth.app && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
      const provider = new FacebookAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          fullName: userCredential.user.displayName,
          uid: userCredential.user.uid,
          createdAt: new Date(),
          role: 'customer',
          photoURL: userCredential.user.photoURL
        })
      }

      return { user: userCredential.user, userData: userDoc.data() }
    }

    throw new Error('Facebook Sign-In not available in development mode')
  } catch (error) {
    throw new Error(error.message || 'فشل تسجيل الدخول عبر Facebook')
  }
}
