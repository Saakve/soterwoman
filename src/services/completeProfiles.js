import { supabase } from "./supabase"

export async function completePassengerProfile({id, name, phone, emergencyPhone}) {
    const { data, error } = await supabase.rpc("completePassengerProfile", {
        profiletoupdate: id,
        newname: name,
        newphone: phone,
        newemergencyphone: emergencyPhone
    })

    return { data, error }
}

export async function completeDriverProfile({ id, name, phone, drivingLicense, city, model, brand, year, licensePlate }) {
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

    return { data, error }
}