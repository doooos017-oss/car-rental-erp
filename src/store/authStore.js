import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userData: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      setUser: (user, userData) => set({
        user,
        userData,
        isAuthenticated: !!user,
        isLoading: false,
        error: null
      }),

      logout: () => set({
        user: null,
        userData: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      initializeAuth: () => {
        try {
          if (!auth || !onAuthStateChanged) {
            // Firebase not properly configured, set loading to false
            set({ isLoading: false })
            return () => { }
          }

          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null
              })
            } else {
              set({
                user: null,
                userData: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              })
            }
          }, (error) => {
            // Handle auth errors
            console.warn('Auth error:', error.message)
            set({
              isLoading: false,
              isAuthenticated: false,
              error: error.message
            })
          })

          return unsubscribe
        } catch (error) {
          console.warn('Failed to initialize auth:', error.message)
          set({ isLoading: false, error: error.message })
          return () => { }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        userData: state.userData,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
