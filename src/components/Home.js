import { StyleSheet, Text, View, Button } from 'react-native'
import { supabase } from '../services/supabase'
import { useContext } from 'react'
import UserContext from '../context/UserContext'

function Home() {
    const user = useContext(UserContext)
    console.log(user)

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error)
    }

    return (
        <View style={styles.container}>
            <Text>Bienvenido a mi app</Text>
            <Text>Id:   {user.id}</Text>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone: {user.phone}</Text>
            <Button title='Cerrar Sesión' onPress={() => signOut()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { Home }