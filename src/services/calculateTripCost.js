import { supabase } from "./supabase"

export async function calculateTripCost(distance) {
    const { data, error } = await supabase.from('servicetype').select()

    if (error) {
        console.log('calculateTripCost', error)
        return
    }

    const wonders = data.map((wonder) => {
        const price = Number.parseFloat(wonder.price.slice(1))
        return {...wonder, price: (price * distance).toFixed(2) }
    })

    return wonders
}