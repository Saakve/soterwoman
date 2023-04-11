import { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { Input, Button } from "@rneui/base"

import { useSignUp } from "../hooks/useSignUp"

export function SignUpPassenger() {
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'passenger' })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [emergencyPhone, setEmergencyPhone] = useState("")

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crear nueva cuenta</Text>
                </View>
                <Input
                    inputStyle={styles.inputplaceholder}
                    inputContainerStyle={styles.inputcontainer}
                    placeholder="Nombre completo"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <Input
                    inputStyle={styles.inputplaceholder}
                    inputContainerStyle={styles.inputcontainer}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input
                    inputStyle={styles.inputplaceholder}
                    inputContainerStyle={styles.inputcontainer}
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                />
                <Input
                    inputStyle={styles.inputplaceholder}
                    inputContainerStyle={styles.inputcontainer}
                    placeholder="Teléfono de emergencia"
                    value={emergencyPhone}
                    onChangeText={text => setEmergencyPhone(text)}
                />
                <Input
                    inputStyle={styles.inputplaceholder}
                    inputContainerStyle={styles.inputcontainer}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    title="Registrarse"
                    disabled={isLoadingSignUp}
                    onPress={() => signUp({ email, password, name, phone, emergencyPhone })}
                    color="#8946A6"
                    buttonStyle={styles.button}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24
    },
    form: {
    },
    header: {
        alignSelf: "center",
        width: 335
    },
    title: {
        fontFamily: "OpenSans-Bold",
        textAlign: "left",
        fontSize: 24,
        marginTop: 32,
        marginBottom: 13,
    },
    inputplaceholder: {
        paddingLeft: 20,
        paddingTop: 13,
        paddingBottom: 12,
    },
    inputcontainer: {
        width: 335,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: "center"
    },
    input: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "center",
    },
    providers: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    button: {
        marginTop: 20,
        color: "#8946A6",
        width: 330,
        height: 50,
        alignSelf: "center",
        borderRadius: 10
    }
})
