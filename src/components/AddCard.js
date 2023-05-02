import { useConfirmSetupIntent, createToken } from "@stripe/stripe-react-native"
import { useContext } from "react"
import { createFirstDriverCard, createFirstPassengerPaymentMethod, createPassengerPaymentMethod } from "../services/stripe"

import UserContext from "../context/UserContext"
import { createDriverCard } from "../services/stripe"
import { FormCard } from "./FormCard"
import { supabase } from "../services/supabase"
import { Alert } from "react-native"

export function AddCard({ navigation }) {
    const { userData, setUserData } = useContext(UserContext)
    const { confirmSetupIntent } = useConfirmSetupIntent()

    const assingIdStripe = async (idStripe) => {
        const { error } = await supabase.from('profile').update({ idstripe: idStripe }).eq('id', userData.id)
        if (error) console.log(error)
        setUserData((previusState) => ({ ...previusState, idStripe }))
    }

    const addDriverCard = async ({ name, postalCode }) => {
        const { token: { id }, error } = await createToken({
            type: "Card",
            name,
            address: {
                postalCode
            },
            currency: "USD"
        })

        if (error) {
            Alert.alert(error)
            return
        }

        if (userData.idStripe) {
            const response = await createDriverCard({ idAccount: userData.idStripe, tokenCard: id })
        } else {
            const { idaccount } = await createFirstDriverCard({
                tokenCard: id,
                rfc: "000000000",
                name: userData.name,
                email: userData.email,
                dob: {
                    day: "13",
                    month: "03",
                    year: "1996"
                },
                address: {
                    line1: "Av. Universidad",
                    city: "Coatazacoalcos",
                    state: "California",
                    postal_code: "1200"
                }
            })

            assingIdStripe(idaccount)
        }
        navigation.goBack()
    }

    const addPassengerCard = async ({ name, postalCode }) => {
        let clientSecret
        if (userData.idStripe) {
            const { client_secret } = await createPassengerPaymentMethod({ idCustomer: userData.idStripe })
            clientSecret = client_secret
        } else {
            const { idcustomer, client_secret } = await createFirstPassengerPaymentMethod()
            assingIdStripe(idcustomer)
            clientSecret = client_secret
        }

        const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {
                billingDetails: {
                    name,
                    address: {
                        postalCode
                    }
                }
            }
        })

        if (error) console.log(error)
        else navigation.goBack()
    }

    const handleSavePaymentMethod = async ({ name, postalCode }) => {
        if (userData.idUserType === 1) await addDriverCard({ name, postalCode })
        else await addPassengerCard({ name, postalCode })
    }

    return (
        <FormCard onPressButton={handleSavePaymentMethod} />
    )
}