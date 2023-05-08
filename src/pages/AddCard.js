import { useConfirmSetupIntent, createToken } from "@stripe/stripe-react-native"
import { useContext } from "react"
import { createFirstDriverCard, createFirstPassengerPaymentMethod, createPassengerPaymentMethod, updatePassengerPaymentMethod } from "../services/stripe"

import UserContext from "../context/UserContext"
import { createDriverCard } from "../services/stripe"
import { FormCard } from "../components/FormCard"
import { supabase } from "../services/supabase"
import { Alert } from "react-native"

export function AddCard({ navigation }) {
    const { userData, setUserData } = useContext(UserContext)
    const { confirmSetupIntent } = useConfirmSetupIntent()

    const assingIdStripe = async (idStripe) => {
        const { error } = await supabase.from('profile').update({ idstripe: idStripe }).eq('id', userData.id)

        if (error) {
            handleError(error)
            return
        }

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
            handleError(error)
            return
        }

        if (userData.idStripe) {
            const { error } = await createDriverCard({ idAccount: userData.idStripe, tokenCard: id })

            if (error) {
                handleError(error)
                return
            }

        } else {
            const { idaccount, error } = await createFirstDriverCard({
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

            if (error) {
                handleError(error)
                return
            }

            await assingIdStripe(idaccount)
        }
        navigation.goBack()
    }

    const addPassengerCard = async ({ name, postalCode }) => {
        let clientSecret

        if (userData.idStripe) {
            const { client_secret, error } = await createPassengerPaymentMethod({ idCustomer: userData.idStripe })

            if (error) {
                handleError(error)
                return
            }

            clientSecret = client_secret
        } else {
            const { idcustomer, client_secret, error } = await createFirstPassengerPaymentMethod()

            if (error) {
                handleError(error)
                return
            }

            await assingIdStripe(idcustomer)
            clientSecret = client_secret
        }

        const { setupIntent: { paymentMethod }, error } = await confirmSetupIntent(clientSecret, {
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

        if (error) {
            handleError(error)
            return
        }

        const { id, customerId } = paymentMethod
        await updatePassengerPaymentMethod({ idCustomer: customerId, idPaymentMethod: id, isDefault: true })

        navigation.goBack()
    }

    const handleSavePaymentMethod = async ({ name, postalCode }) => {
        if (userData.idUserType === 1) await addDriverCard({ name, postalCode })
        else await addPassengerCard({ name, postalCode })
    }

    const handleError = (error) => {

        if (typeof error === "string") {
            Alert.alert("Error", "Hubo un problema, intente más tarde")
            return
        }

        let message

        if (error.stripeErrorCode === "card_declined") {
            message = "Su tarjeta fue declinada. Contacte con el emisor de su tarjeta para más información."
        } else if (error.stripeErrorCode === "expired_card") {
            message = "La tarjeta ha caducado. Verifique la fecha de vencimiento o use otra tarjeta."
        } else if (error.stripeErrorCode === "incorrect_cvc") {
            message = "Código de seguridad incorrecto."
        } else if (error.stripeErrorCode === "processing_error") {
            message = "Ocurrió un error al procesar la tarjeta. Vuelva a intentarlo más tarde o con otra tarjeta."
        } else if (error.stripeErrorCode === "incorrect_number") {
            message = "Número de tarjeta incorrecto."
        }

        Alert.alert("Error", message)
    }

    return (
        <FormCard onPressButton={handleSavePaymentMethod} />
    )
}