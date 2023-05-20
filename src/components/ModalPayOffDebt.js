import { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, Alert } from 'react-native'

import { Button, Icon } from '@rneui/base'

import { initStripe } from '@stripe/stripe-react-native'

import { getPublishableKey } from '../services/getPublishableKey'

import UserContext from '../context/UserContext'
import { getDriverDefaultCard, getPassengerDefaultPaymentMethod, payoffDebt } from '../services/stripe'
import { supabase } from '../services/supabase'
import { useNavigation } from '@react-navigation/native'

export function ModalPayOffDebt ({ visible = false, onPress = () => { }, amount }) {
  const { navigate } = useNavigation()
  const { userData } = useContext(UserContext)
  const [show, setShow] = useState(visible)
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState(null)

  useEffect(() => {
    setShow(visible)
  }, [visible])

  useEffect(() => {
    const fetchKey = async () => {
      const publishableKey = await getPublishableKey()
      await initStripe({ publishableKey })
    }
    fetchKey()
  }, [])

  useEffect(() => {
    const fetchDefaultCard = async () => {
      if (!userData.idStripe) return

      let card

      if (userData.idUserType === 1) {
        card = await getDriverDefaultCard({ id: userData.idStripe })
      } else {
        card = await getPassengerDefaultPaymentMethod({ id: userData.idStripe })
      }

      console.log(card)

      setCard(card)
    }

    fetchDefaultCard()
  }, [show])

  const handlePressButton = async () => {
    setLoading(true)

    if (!card) {
      Alert.alert('Advertencia', 'Debes agregar por lo menos una tarjeta')
      navigate('Cards')
    } else {
      await payoffDebtOfUser()
    }

    setLoading(false)
    setShow(false)
    onPress()
  }

  const payoffDebtOfUser = async () => {
    if (userData.idUserType === 1) {
      const { error } = await payoffDebt({
        idAccount: userData.idStripe,
        amount: Number(amount.substring(1).split(',').join('')) * 100
      })

      if (error) {
        handleError(error)
        return
      }

      const { error: errorSupabase } = await supabase.from('profile').update({ debt: 0 }).eq('id', userData.id)
      if (errorSupabase) handleError(error)
    } else {
      const { error } = await payoffDebt({
        idCustomer: userData.idStripe,
        amount: Number(amount.substring(1).split(',').join('')) * 100
      })

      if (error) {
        handleError(error)
        return
      }

      const { error: errorSupabase } = await supabase.from('profile').update({ debt: 0 }).eq('id', userData.id)
      if (errorSupabase) handleError(error)
    }
  }

  const handleError = (error) => {
    if (typeof error === 'string') {
      Alert.alert('Error', 'Hubo un problema, intente más tarde')
      return
    }

    let message

    if (error.stripeErrorCode === 'card_declined') {
      message = 'Su tarjeta fue declinada. Contacte con el emisor de su tarjeta para más información.'
    } else if (error.stripeErrorCode === 'expired_card') {
      message = 'La tarjeta ha caducado'
    } else if (error.stripeErrorCode === 'processing_error') {
      message = 'Ocurrió un error al procesar la tarjeta. Vuelva a intentarlo más tarde o con otra tarjeta.'
    }

    Alert.alert('Error', message)
  }

  return (
    <Modal
      animationType='fade'
      transparent
      visible={show}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Pagar deuda de: {'\n'} {amount}</Text>
          <Text style={styles.modalText}>Método de pago: </Text>
          <View style={styles.card}>
            <Icon
              name='credit-card'
              type='font-awesome'
              color='#0040C1'
              style={styles.icon}
            />
            <View>
              <Text style={styles.text}>{card?.brand}-{card?.last4}</Text>
              <Text style={styles.text}>{card?.name}</Text>
            </View>
          </View>
          <Button
            titleStyle={styles.textButton}
            buttonStyle={styles.buttonModal}
            onPress={handlePressButton}
            title='Aceptar'
            color={styles.buttonModal.color}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 22,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'left',
    marginHorizontal: 20,
    width: 180
  },
  textButton: {
    color: 'black',
    fontSize: 14
  },
  buttonModal: {
    marginTop: 20,
    height: 38,
    alignSelf: 'center',
    borderRadius: 10,
    color: '#FFCDDD',
    paddingHorizontal: 20
  },
  card: {
    flexDirection: 'row'
  },
  icon: {
    marginHorizontal: '3%',
    marginTop: '8%'
  }
})
