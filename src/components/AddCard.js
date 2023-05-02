import { useConfirmSetupIntent, createToken } from "@stripe/stripe-react-native"
import { useContext } from "react"
import { createPassengerPaymentMethod } from "../services/stripe"

import UserContext from "../context/UserContext"
import { createDriverCard } from "../services/stripe"
import { FormCard } from "./FormCard"

export function AddCard({ navigation }) {
    const { userData: { idUserType } } = useContext(UserContext)
    const { confirmSetupIntent, loading } = useConfirmSetupIntent()

    const addDriverCard = async ({ name, postalCode }) => {
        const { token: { id }, error } = await createToken({
            type: "Card",
            name,
            address: {
                postalCode
            },
            currency: "USD"
        })

        if (error) console.log(error)

        const response = await createDriverCard({ idAccount: "acct_1N11tn2UWKvKuybi", tokenCard: id })
        console.log(response)
        navigation.goBack()
    }

    const addPassengerCard = async ({ name, postalCode }) => {
        const { client_secret } = await createPassengerPaymentMethod({ idCustomer: "cus_NnxwRjNZtvRIHI" })

        const { setupIntent, error } = await confirmSetupIntent(client_secret, {
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
        if (idUserType === 1) await addDriverCard({ name, postalCode })
        else await addPassengerCard({ name, postalCode })
    }

    return (
        <FormCard onPressButton={handleSavePaymentMethod} />
    )
}