import { useState } from "react"
import { supabase } from "../services/supabase"
import { validateEmailAndPassword, validateName, validatePhone } from "../utils/validateInputs"

export function useSignUp({ usertype }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const createUser = async ({email, password}) => {
        const { data, error } = await supabase.auth.signUp({email, password})

        if(error) console.log(error)

        return data.user.id
    }

    const validateProfileInputs = (email, password, name, phone) => {
        validateEmailAndPassword(email,password)
        validateName(name)
        validatePhone(phone)
    }

    const validatePassengerInputs = (emergencyPhone) => {
        validatePhone(emergencyPhone, 'emergencyPhone')
    }

    //const validateDriverAndVehicleInputs = (drivinglicense, city, model, brand, year, licenseplate) => {
    //    
    //}

    const signUpPassenger = async ({ email, password, name, phone, emergencyPhone }) => {
        validateProfileInputs(email, password, name, phone)
        validatePassengerInputs(emergencyPhone)

        setIsLoading(true)

        const id = await createUser({ email, password })

        const { data, error } = await supabase.rpc("completePassengerProfile", {
            profiletoupdate: id,
            newname: name,
            newphone: phone,
            newemergencyphone: emergencyPhone
        })

        if(error) {
            console.log(error)
            setError(error)
        }
        setIsLoading(false)
    }

    const signUpDriver = async ({ email, password, name, phone, drivinglicense, city, model, brand, year, licenseplate }) => {
        validateProfileInputs(email, password, name, phone)
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

        if(error) setError(error)
        setIsLoading(false)
    }

    if( usertype === 'passenger' ) return {isLoading, error, signUp: signUpPassenger}
    if( usertype === 'driver' ) return { isLoading, error, signUp:signUpDriver }
}