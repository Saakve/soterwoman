import { useContext } from 'react'

import { FormCard } from '../components/FormCard'
import UserContext from '../context/UserContext'
import { updateDriverCard, updatePassengerPaymentMethod } from '../services/stripe'

import userType from '../utils/userType'

export function EditCard ({ navigation, route }) {
  const { userData: { idUserType, idStripe } } = useContext(UserContext)
  const { card } = route.params

  const handlePressButton = async ({ postalCode, name }) => {
    if (idUserType === userType.DRIVER) {
      await updateDriverCard({
        idAccount: idStripe,
        idCard: card.id,
        name,
        postal_code: postalCode
      })
    } else {
      await updatePassengerPaymentMethod({
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
