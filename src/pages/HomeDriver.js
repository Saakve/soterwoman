import { StyleSheet, Text, View } from 'react-native'
import { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import SignInLikeContext from '../context/SingInLikeContext'
import useCurrentLocation from '../hooks/useCurrentLocation'
import { ToggleOnService } from '../components/ToggleOnService'
import { ModalReport } from '../components/ModalReport'

function HomeDriver ({ navigation }) {
  const { location } = useCurrentLocation()
  const { userData, dataIsLoaded } = useContext(UserContext)
  const { signInLike } = useContext(SignInLikeContext)

  console.log(location)

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
      if (signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
    }
  }, [dataIsLoaded])

  return (
    <View style={styles.container}>
      <ModalReport
        visible
        userToReport='afcfc3f6-4854-4976-88e8-57a8480fdd09'
      />
      <ToggleOnService />
      <Text>Bienvenido a mi app</Text>
      <Text>Id: {userData.id}</Text>
      <Text>Name: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone: {userData.phone}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { HomeDriver }
