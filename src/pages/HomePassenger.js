import { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'


import UserContext from '../context/UserContext'
import SignInLikeContext from '../context/SingInLikeContext'

import { PassengerMapContainer } from '../components/PassengerMapContainer'
import useCurrentLocation from '../hooks/useCurrentLocation'

function HomePassenger ({ navigation }) {
  const { userData, dataIsLoaded } = useContext(UserContext)
  const { signInLike } = useContext(SignInLikeContext)
  const { location } = useCurrentLocation();

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
      if (signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
    }
  }, [dataIsLoaded])

  return (
    <View style={styles.container}>
      <PassengerMapContainer currentLocation={location} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
});

export { HomePassenger }
