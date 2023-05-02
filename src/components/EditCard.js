import { useContext } from "react";
import { FormCard } from "./FormCard";
import UserContext from "../context/UserContext";
import { updateDriverCard, updatePassengerPaymentMethod } from "../services/stripe";

export function EditCard({ navigation, route }) {
    const { userData: { idUserType } } = useContext(UserContext)
    const { card } = route.params

    handlePressButton = async ({ postalCode, name }) => {
        let response
        if (idUserType === 1) {
            response = await updateDriverCard({
                idAccount: "acct_1N11tn2UWKvKuybi",
                idCard: card.id,
                name,
                postal_code: postalCode
            })
        } else {
            response = await updatePassengerPaymentMethod({
                idCustomer: "cus_NnxwRjNZtvRIHI",
                idPaymentMethod: card.id,
                name,
                postal_code: postalCode
            })
        }
        
        navigation.goBack()
    }

    return (
        <FormCard card={card} onPressButton={handlePressButton} disabledCardField />
    )
}