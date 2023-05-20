import { useState } from 'react'
import { supabase } from '../services/supabase'

export function useSignUp ({ usertype }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) console.log(error)

    return data.user.id
  }

  const signUpPassenger = async ({ email, password, name, phone, emergencyPhone }) => {
    setIsLoading(true)

    const id = await createUser({ email, password })

    const { error } = await supabase.rpc('completePassengerProfile', {
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

  const signUpDriver = async ({ email, password, name, phone, drivingLicense, city, brand, model, year, licensePlate }) => {
    setIsLoading(true)

    const id = await createUser({ email, password })

    const { error } = await supabase.rpc('completeDriverProfile', {
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
