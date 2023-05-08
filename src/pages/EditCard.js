import { useContext } from "react";
import { FormCard } from "../components/FormCard";
import UserContext from "../context/UserContext";
import { updateDriverCard, updatePassengerPaymentMethod } from "../services/stripe";

export function EditCard({ navigation, route }) {
    const { userData: { idUserType, idStripe } } = useContext(UserContext)
    const { card } = route.params

    handlePressButton = async ({ postalCode, name }) => {
        let response
        if (idUserType === 1) {
            response = await updateDriverCard({
                idAccount: idStripe,
                idCard: card.id,
                name,
                postal_code: postalCode
            })
        } else {
            response = await updatePassengerPaymentMethod({
                idCustomer: idStripe,
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