import { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'


import UserContext from '../context/UserContext'
import SignInLikeContext from '../context/SingInLikeContext'

import { ModalRating } from '../components/ModalRating'
import { ModalTip } from '../components/ModalTip'
import { PassengerMapContainer } from '../components/PassengerMapContainer'
import useCurrentLocation from '../hooks/useCurrentLocation'

function HomePassenger ({ navigation }) {
  const { userData, dataIsLoaded } = useContext(UserContext)
  const { signInLike } = useContext(SignInLikeContext)
  const { location, loaded } = useCurrentLocation();

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
      if (signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
    }
  }, [dataIsLoaded])



  return (
    <View style={styles.container}>
      <PassengerMapContainer currentLocation={location} />

      <ModalTip
        visible={userData.idUserType === 2}
        driverToSendTip="acct_1N3CV3FauMmYefG2"
      />
      <ModalRating
        visible={false}
        userToRate="afcfc3f6-4854-4976-88e8-57a8480fdd09"
      />

    </View>
  );
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
