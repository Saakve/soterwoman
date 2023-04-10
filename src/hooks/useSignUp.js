import { useState } from "react"
import { supabase } from "../services/supabase"

export function useSignUp({ usertype }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const createUser = async ({email, password}) => {
        const { data, error } = await supabase.auth.signUp({email, password})

        console.log(data)
        if(error) console.log(error)

        return data.user.id
    }

    const signUpPassenger = async ({ email, password, name, phone, emergencyPhone }) => {
        setIsLoading(true)

        const id = await createUser({ email, password })

        const { data, error } = await supabase.rpc("completePassengerProfile", {
            profiletoupdate: id,
            newname: name,
            newphone: phone,
            newemergencyphone: emergencyPhone
        })

        console.log(data)
        if(error) {
            console.log(error)
            setError(error)
        }
        setIsLoading(false)
    }

    const signUpDriver = async ({ email, password, name, phone, drivinglicense, city, model, brand, year, licenseplate }) => {
        setIsLoading(true)

        const id = await createUser({ email, password })

        const { data, error } = await supabase.rpc("completeDriverProfile", {
            profiletoupdate: id,
            newname: name,
            newphone: phone,
            newdrivinglicense: drivinglicense,
            newcity: city,
            newmodel: model,
            newbrand: brand,
            newyear: year,
            newlicenseplate: licenseplate
        })

        console.log(data)
        if(error) {
            console.log(error)
            setError(error)
        }
        setIsLoading(false)
    }

    if( usertype === 'passenger' ) return {isLoading, error, signUp: signUpPassenger}
    if( usertype === 'driver' ) return { isLoading, error, signUp:signUpDriver }
}