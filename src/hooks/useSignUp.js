import { useState } from "react"
import { supabase } from "../services/supabase"

export function useSignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const signUp = async ({email, password}) => {
        setIsLoading(true)
        const { data, error } = await supabase.auth.signUp({email, password})
        console.log(data)
        setError(error)
        setIsLoading(false)
    }

    return {isLoading, error, signUp}
}