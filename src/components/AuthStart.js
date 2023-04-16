import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"

export function AuthStart({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('PassengerCarousel')
        }, 1000)
    }, [])

    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigate('PassengerCarousel')} style={styles.text}>Bienvenido</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: 600,
        backgroundColor: "black"
    },
    text: {
        color: 'white',
        textAlign: 'center'
    }
})