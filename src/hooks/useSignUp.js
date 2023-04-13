import { useState } from "react"
import { supabase } from "../services/supabase"
import { validateProfileInputs, validatePhone, validateDriverAndVehicleInputs, validateEmail, validatePassengerInputs } from "../utils/validateInputs"

export function useSignUp({ usertype }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const createUser = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) console.log(error)

        return data.user.id
    }

    const signUpPassenger = async ({ email, password, name, phone, emergencyPhone }) => {
        validatePassengerInputs(name, email, phone, emergencyPhone, password)
        setIsLoading(true)

        const id = await createUser({ email, password })

        const { data, error } = await supabase.rpc("completePassengerProfile", {
            profiletoupdate: id,
            newname: name,
            newphone: phone,
            newemergencyphone: emergencyPhone
        })

        if (error) {
            console.log(error)
            setError(error)
        }
        setIsLoading(false)
    }

    const signUpDriver = async ({ email, password, name, phone, drivingLicense, city, model, brand, year, licensePlate }) => {
        console.log(name, email, phone, drivingLicense, city, password)
        validateDriverAndVehicleInputs(name, email, phone, drivingLicense, city, password, model, brand, year, licensePlate)
        setIsLoading(true)

        const id = await createUser({ email, password })

        const { data, error } = await supabase.rpc("completeDriverProfile", {
            profiletoupdate: id,
            newname: name,
            newphone: phone,
            newdrivinglicense: drivingLicense,
            newcity: city,
            newmodel: model,
            newbrand: brand,
            newyear: year,
            newlicenseplate: licensePlate
        })

        if (error) setError(error)
        setIsLoading(false)
    }

    if (usertype === 'passenger') return { isLoading, error, signUp: signUpPassenger }
    if (usertype === 'driver') return { isLoading, error, signUp: signUpDriver }
}