import { Button } from "@rneui/base";
import { StyleSheet, View } from "react-native";

export function AuthHome({ navigation, userType }) {

    const moveToSignIn = () => navigation.navigate('SignIn')
    const moveToSignUp = userType === 'passenger' ? () => navigation.navigate('SignUpPassenger') : () => navigation.navigate('SignUpDriver')

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button title={'INICIAR SESIÓN'} onPress={() => moveToSignIn()} />
                <Button title={'REGISTRARSE'} onPress={() => moveToSignUp()} />
            </View>
            <Button
                size="sm"
                title={userType === 'passenger' ? '¿Eres conductora?' : '¿Eres pasajera?'}
                onPress={userType === 'passenger' ? () => navigation.navigate('DriverCarousel', { animation: 'slide_from_bottom' }) : () => navigation.navigate('PassengerCarousel', { animation: 'slide_from_bottom' })}
                type="clear"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end"
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})