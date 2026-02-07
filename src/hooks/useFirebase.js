import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  limit,
  onSnapshot 
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Generic hook for Firestore operations
export function useFirestore(collectionName, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    orderBy: orderByField = 'createdAt',
    orderDirection = 'desc',
    where: whereClause = null,
    limit: limitCount = null,
    realtime = false
  } = options

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let q = collection(db, collectionName)
      
      if (whereClause) {
        q = query(q, where(whereClause.field, whereClause.operator, whereClause.value))
      }
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection))
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }
      
      const querySnapshot = await getDocs(q)
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setData(documents)
    } catch (err) {
      setError(err.message)
      console.error(`Error fetching ${collectionName}:`, err)
    } finally {
      setLoading(false)
    }
  }, [collectionName, orderByField, orderDirection, whereClause, limitCount])

  useEffect(() => {
    if (realtime) {
      // Real-time listener
      let q = collection(db, collectionName)
      
      if (whereClause) {
        q = query(q, where(whereClause.field, whereClause.operator, whereClause.value))
      }
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection))
      }
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(documents)
        setLoading(false)
      }, (err) => {
        setError(err.message)
        setLoading(false)
      })
      
      return () => unsubscribe()
    } else {
      fetchData()
    }
  }, [collectionName, fetchData, realtime, orderByField, orderDirection, whereClause])

  const addDocument = useCallback(async (documentData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      if (!realtime) {
        await fetchData()
      }
      
      return { success: true, id: docRef.id }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [collectionName, fetchData, realtime])

  const updateDocument = useCallback(async (id, documentData) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...documentData,
        updatedAt: new Date()
      })
      
      if (!realtime) {
        await fetchData()
      }
      
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [collectionName, fetchData, realtime])

  const deleteDocument = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id))
      
      if (!realtime) {
        await fetchData()
      }
      
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [collectionName, fetchData, realtime])

  const getDocument = useCallback(async (id) => {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
      } else {
        return { success: false, error: 'Document not found' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [collectionName])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument
  }
}

// Hook for real-time document subscription
export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docId) {
      setLoading(false)
      return
    }

    const docRef = doc(db, collectionName, docId)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() })
      } else {
        setData(null)
      }
      setLoading(false)
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}

// Hook for statistics
export function useStats(collectionName, groupBy = null) {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName))
        const documents = querySnapshot.docs.map(doc => doc.data())
        
        if (groupBy) {
          const grouped = documents.reduce((acc, doc) => {
            const key = doc[groupBy]
            acc[key] = (acc[key] || 0) + 1
            return acc
          }, {})
          setStats(grouped)
        } else {
          setStats({
            total: documents.length,
            // Add more stats as needed
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [collectionName, groupBy])

  return { stats, loading }
}

// Hook for search functionality
export function useSearch(collectionName, searchFields = []) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      const filtered = documents.filter(doc => {
        return searchFields.some(field => {
          const value = doc[field]
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
      
      setResults(filtered)
    } catch (error) {
      console.error('Error searching:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [collectionName, searchFields])

  return { results, loading, search }
}
