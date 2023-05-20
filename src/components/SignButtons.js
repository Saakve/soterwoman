import { Button } from '@rneui/base'
import { StyleSheet, View, Text } from 'react-native'

export function SignButtons ({ navigation, userType }) {
  const moveToSignIn = () => navigation.navigate('SignIn', { userType })
  const moveToSignUp = userType === 'passenger' ? () => navigation.navigate('SignUpPassenger') : () => navigation.navigate('SignUpDriver')

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button
          title='INICIAR SESIÓN'
          onPress={() => moveToSignIn()}
          buttonStyle={styles.button}
          color='#B762C1'
        />
        <Button
          title='REGISTRARSE'
          onPress={() => moveToSignUp()}
          color='#8946A6'
          buttonStyle={styles.button}
        />
      </View>
      <Text
        style={styles.switchUserType}
        onPress={userType === 'passenger'
          ? () => navigation.navigate('DriverCarousel', { animation: 'slide_from_bottom' })
          : () => navigation.navigate('PassengerCarousel', { animation: 'slide_from_bottom' })}
      >
        {userType === 'passenger' ? '¿Eres conductora?' : '¿Eres pasajera?'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    borderRadius: 10,
    width: 167,
    height: 50
  },
  switchUserType: {
    color: 'red',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 21
  }
})
