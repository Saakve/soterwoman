import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useIsSignIn () {
  const [isSignIn, setIsSignIn] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') setIsSignIn(true)
      if (event === 'SIGNED_OUT') setIsSignIn(false)
    })
  }, [])

  return { isSignIn }
}
