import { useState } from "react"
import { supabase } from "../services/supabase"
import { validateEmailAndPassword } from "../utils/validateInputs"

export function useSignInWithEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const signIn = async ({email, password}) => {
        validateEmailAndPassword(email, password)
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithPassword({email, password})
        setError(error)
        setIsLoading(false)
    }

    return {isLoading, error, signIn}
}