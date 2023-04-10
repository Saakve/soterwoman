import { Button } from "@rneui/base";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export function AuthHome({ navigation }) {

    const moveToSignIn = () => navigation.navigate('SignIn')
    const moveToSignUp = () => navigation.navigate('SignUp', { view: userType })

    const [userType, setUserType] = useState('passenger')

    return (
        <View style={styles.container}>
        <View style={styles.buttons}>
            <Button title={'INICIAR SESIÓN'} onPress={() => moveToSignIn()} />
            <Button title={'REGISTRARSE'} onPress={() => moveToSignUp()} />
        </View>
        <Button 
            size="sm" 
            title={userType === 'passenger' ? '¿Eres conductora?' : '¿Eres pasajera?'} 
            onPress={userType === 'passenger' ? () => setUserType('driver') : () => setUserType('passenger')} 
            type="clear"
        />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
        height: 600
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})