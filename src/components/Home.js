import { StyleSheet, Text, View, Button } from 'react-native'
import { supabase } from '../services/supabase'

function Home() {
    const user = {id: 1, email: "asdas@dasdas.com"}

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error)
    }

    return (
        <View style={styles.container}>
            <Text>Bienvenido a mi app</Text>
            <Text>Id:   {user.id}</Text>
            <Text>Email: {user.email}</Text>
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