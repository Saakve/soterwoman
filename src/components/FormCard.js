import { Button } from '@rneui/base'
import { CardField, StripeProvider } from '@stripe/stripe-react-native'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { getPublishableKey } from '../services/getPublishableKey'
import { InputStyled } from '../components/InputStyled'

import { validateName, validateOnlyNumbers } from '../utils/validateInputs'

export function FormCard ({ onPressButton = ({ name, postalCode }) => { }, card, disabledCardField }) {
  const [publishableKey, setPublishableKey] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [name, setName] = useState((card && card.name) || '')
  const [postalCode, setPostalCode] = useState((card && card.postal_code) || '')
  const [loading, setLoading] = useState(false)
  const [cardComplete, setCardComplete] = useState(disabledCardField || false)
  const cardField = useRef()

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getPublishableKey()
      setPublishableKey(key)
    }
    fetchKey()
  }, [])

  const handlePressButton = async () => {
    if (!cardComplete) {
      Alert.alert('Advertencia', 'Ingrese una tarjeta válida')
      return
    }

    setLoading(true)
    setErrorMessage(null)
    try {
      validateName(name)
      validateOnlyNumbers(postalCode, 'postalCode')
    } catch (error) {
      setLoading(false)
      setErrorMessage(error)
      return
    }
    await onPressButton({ name, postalCode })
    setLoading(false)
  }

  const handleChange = ({ complete }) => setCardComplete(complete)

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <CardField
            ref={cardField}
            style={styles.card}
            cardStyle={styles.card}
            postalCodeEnabled={false}
            placeholders={card && { number: card.last4, expiration: '' }}
            onCardChange={(disabledCardField && (() => cardField.current.clear())) || handleChange}
          />
          <InputStyled
            value={name}
            containerStyle={styles.inputcontainer}
            inputContainerStyle={styles.input}
            placeholder='Nombre'
            name='name'
            onChangeText={(text) => setName(text)}
            errorMessage={errorMessage}
          />
          <InputStyled
            value={postalCode}
            containerStyle={styles.inputcontainer}
            inputContainerStyle={styles.input}
            placeholder='Código postal'
            name='postalCode'
            onChangeText={(text) => setPostalCode(text)}
            errorMessage={errorMessage}
          />
        </View>
        <Button
          buttonStyle={styles.button}
          color={styles.button.color}
          title='Guardar'
          onPress={handlePressButton}
          loading={loading}
        />
      </View>
    </StripeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#FFF'
  },
  card: {
    width: '90%',
    height: 60,
    borderWidth: 1,
    borderRadius: 5
  },
  button: {
    marginTop: 20,
    color: '#8946A6',
    width: 330,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10
  },
  inputcontainer: {
    width: '90%',
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: '8%'
  },
  input: {
    borderBottomWidth: 0,
    height: '100%',
    alignItems: 'stretch'
  }
})
