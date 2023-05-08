import { StyleSheet, Text, View, Button } from 'react-native'
import { supabase } from '../services/supabase'
import { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import SignInLikeContext from "../context/SingInLikeContext"
import useCurrentLocation from '../hooks/useCurrentLocation'
import { ToggleOnService } from './ToggleOnService'
import { ModalReport } from './ModalReport'

function HomeDriver({ navigation }) {
    const {location, loading} = useCurrentLocation()
    const { userData, dataIsLoaded } = useContext(UserContext)
    const { signInLike } = useContext(SignInLikeContext)

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
    }

    console.log(location)

    useEffect(() => {
        if (dataIsLoaded && !userData.idUserType) { 
            console.log(signInLike)
            if(signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
            if(signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
        }
    }, [dataIsLoaded])

    return (
      <View style={styles.container}>
        <ModalReport
          visible={true}
          userToReport={"afcfc3f6-4854-4976-88e8-57a8480fdd09"}
        />
        <ToggleOnService />
        <Text>Bienvenido a mi app</Text>
        <Text>Id: {userData.id}</Text>
        <Text>Name: {userData.name}</Text>
        <Text>Email: {userData.email}</Text>
        <Text>Phone: {userData.phone}</Text>
        <Button title="Cerrar Sesión" onPress={() => signOut()} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { HomeDriver }