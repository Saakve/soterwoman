import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native'
import { TripPoints } from './TripPoints'
import { Icon, Button } from '@rneui/base'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

import paymentMethodType from '../utils/paymentMethodType'

const { width } = Dimensions.get('window')

export default function PayChildrenSelector ({
  origin,
  destination,
  onPress = () => { }
}) {
  const [childrenNumber, setChildrenNumber] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState(null)
  const [paymentMethodSelected, setPaymentMethod] = useState(paymentMethodType.CASH)

  const MAX_CHILDREN_NUMBER = 3
  const MIN_CHILDREN_NUMBER = 0

  const addChildrens = () => {
    const lastChildrenNumber = childrenNumber
    childrenNumber < MAX_CHILDREN_NUMBER
      ? setChildrenNumber(childrenNumber + 1)
      : setChildrenNumber(lastChildrenNumber)
  }

  const substractChildrens = () => {
    const lastChildrenNumber = childrenNumber
    childrenNumber > MIN_CHILDREN_NUMBER
      ? setChildrenNumber(childrenNumber - 1)
      : setChildrenNumber(lastChildrenNumber)
  }

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data } = await supabase.from('paymentmethodtype').select()
      setPaymentMethods(data)
    }
    fetchPaymentMethods()
  }, [])

  return (
    <View style={styles.selector}>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination} />
      <View style={styles.selector_payments}>
        {
          paymentMethods?.map(({ id, name }) => {
            const button = { title: '', iconName: '', iconColor: '' }

            if (id === paymentMethodType.CARD) {
              button.iconName = 'credit-card'
              button.iconColor = '#0040C1'
            } else if (id === paymentMethodType.CASH) {
              button.iconName = 'money-bill'
              button.iconColor = '#03DE73'
            }

            return (
              <Button
                key={id}
                icon={
                  <Icon
                    style={styles.payment_icons}
                    name={button.iconName}
                    type='font-awesome-5'
                    color={button.iconColor}
                  />
              }
                title={name[0].toUpperCase() + name.substring(1)}
                titleStyle={styles.titlePaymentMethod}
                buttonStyle={[{ ...styles.paymentMethod }, id === paymentMethodSelected ? { ...styles.paymentMethodSelected } : null]}
                onPressOut={() => setPaymentMethod(id)}
                type='clear'
              />
            )
          })
        }
      </View>
      <View style={styles.selector_children}>
        <Icon
          style={styles.payment_icons}
          name='child'
          type='font-awesome-5'
          color='#F0C59D'
        />

        <Text style={{ fontSize: 18 }}>Niños</Text>
        <Button
          icon={
            <Icon name='minus' type='font-awesome-5' color='#FFF' size={10} />
          }
          buttonStyle={styles.change_button}
          onPress={substractChildrens}
        />
        <Text style={{ fontSize: 18 }}>{`${childrenNumber}`}</Text>
        <Button
          icon={
            <Icon name='plus' type='font-awesome-5' color='#FFF' size={10} />
          }
          onPress={addChildrens}
          buttonStyle={styles.change_button}
        />
      </View>
      <View style={styles.confirm}>
        <Button
          title='Confirmar viaje'
          buttonStyle={styles.button_confirm}
          onPress={() => onPress({ childrenNumber, paymentMethodSelected })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: '100%',
    height: '35%',
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    bottom: Platform.select({ ios: '0%', android: '0%' })
  },

  selector_payments: {
    justifyContent: 'flex-start'
  },
  payment_icons: {
    marginHorizontal: '5%'
  },
  titlePaymentMethod: {
    color: '#111'
  },
  paymentMethod: {
    justifyContent: 'flex-start',
    width,
    paddingVertical: '3%'
  },
  paymentMethodSelected: {
    backgroundColor: 'rgba(255, 205, 221, 0.4)'
  },
  change_button: {
    backgroundColor: '#8946A6',
    borderRadius: 5
  },
  selector_children: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-around',
    width: 400
  },
  selector_setchildren: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline'
  },
  confirm: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  button_confirm: {
    borderRadius: 10,
    backgroundColor: '#8946A6'
  }
})
