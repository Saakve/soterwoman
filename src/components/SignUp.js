import { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { Input, Button } from "@rneui/base"

import { useSignUp } from "../hooks/useSignUp"

export function SignUp ({ route }) {
    const { view } = route.params
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp} = useSignUp({usertype: 'passenger'})

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [emergencyPhone, setEmergencyPhone] = useState("")

    useEffect( () => {
        if ( errorSignUp ) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    return (
        view === 'passenger'
        ?
        <View style={styles.container}>
            <Input
                label="Nombre completo"
                value={name}
                onChangeText={text => setName(text)}
            />
            <Input
                label="Correo electrónico"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                label="Número de teléfono"
                value={phone}
                onChangeText={text => setPhone(text)}
            />
            <Input
                label="Número de teléfono de emergencia"
                value={emergencyPhone}
                onChangeText={text => setEmergencyPhone(text)}
            />
            <Input
                label="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button
                title="Registrarse"
                disabled={isLoadingSignUp}
                onPress={() => signUp({email, password, name, phone, emergencyPhone})}
            />
        </View>
        :
        <View>
            <Text>
                SALUDOS
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        justifyContent: "center",
        alignContent: "center",
    },
    title: {
        textAlign: "center",
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        borderColor: "red",
        borderWidth: 2,
        marginHorizontal: 20
    },
    providers: {
        flexDirection: "row",
        justifyContent: "space-around"
    }
})
