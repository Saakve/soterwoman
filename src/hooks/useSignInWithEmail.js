import { useState } from "react"
import { supabase } from "../services/supabase"

export function useSignInWithEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const signIn = async ({email, password}) => {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithPassword({email, password})
        setError(error)
        setIsLoading(false)
    }

    return {isLoading, error, signIn}
}