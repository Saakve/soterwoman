import { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet, Dimensions } from "react-native"
import { Button } from "@rneui/base"

import { InputStyled } from "./InputStyled"
import { useSignUp } from "../hooks/useSignUp"
import { ScrollView } from "react-native-gesture-handler"

const { height } = Dimensions.get("window")

export function SignUpPassenger() {
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'passenger' })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [emergencyPhone, setEmergencyPhone] = useState("")

    const [emailErrorMessage, setEmailErrorMessage] = useState(null)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(null)
    const [nameErrorMessage, setNameErrorMessage] = useState(null)
    const [phoneErrorMessage, setPhoneErrorMessage] = useState(null)
    const [emergencyPhoneErrorMessage, setEmergencyPhoneErrorMessage] = useState(null)

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])


    const cleanInputsErrors = () => {
        setEmailErrorMessage(null)
        setPasswordErrorMessage(null)
        setNameErrorMessage(null)
        setPhoneErrorMessage(null)
        setEmergencyPhoneErrorMessage(null)
    }

    const handlePressButton = async () => {
        cleanInputsErrors()
        try {
            await signUp({ email, password, name, phone, emergencyPhone })
        } catch (error) {
            if(error.param === 'email') setEmailErrorMessage(error.message)
            if(error.param === 'password') setPasswordErrorMessage(error.message)
            if(error.param === 'name') setNameErrorMessage(error.message)
            if(error.param === 'phone') setPhoneErrorMessage(error.message)
            if(error.param === 'emergencyPhone') setEmergencyPhoneErrorMessage(error.message)
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crear nueva cuenta</Text>
                </View>
                <InputStyled
                    placeholder="Nombre completo"
                    value={name}
                    onChangeText={text => setName(text)}
                    errorMessage={nameErrorMessage}
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    errorMessage={emailErrorMessage}
                    inputMode="email"
                />
                <InputStyled
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    errorMessage={phoneErrorMessage}
                    inputMode="tel"
                />
                <InputStyled
                    placeholder="Teléfono de emergencia"
                    value={emergencyPhone}
                    onChangeText={text => setEmergencyPhone(text)}
                    errorMessage={emergencyPhoneErrorMessage}
                    inputMode="tel"
                />
                <InputStyled
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                    errorMessage={passwordErrorMessage}
                    inputMode="text"
                />
                <Button
                    title="Registrarse"
                    disabled={isLoadingSignUp}
                    onPress={handlePressButton}
                    color="#8946A6"
                    buttonStyle={styles.button}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        height
    },
    header: {
        alignSelf: "center",
        width: 335
    },
    title: {
        fontFamily: "OpenSans-Bold",
        textAlign: "left",
        fontSize: 24,
        marginBottom: 13,
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
