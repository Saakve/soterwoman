import { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { View, Text, Alert, StyleSheet, Dimensions } from "react-native"
import { Button } from "@rneui/base"

import { InputStyled } from "../components/InputStyled"
import { ModalAfterSignUP } from "../components/ModalAfterSignUp"
import { useSignUp } from "../hooks/useSignUp"
import { validatePassengerInputs } from "../utils/validateInputs"

const { height } = Dimensions.get("window")

export function SignUpPassenger({ navigation }) {
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'passenger' })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [emergencyPhone, setEmergencyPhone] = useState("")

    const [showModal, setShowModal] = useState(false)

    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    const handlePressButton = async () => {
        setErrorMessage(null)
        try {
            await validatePassengerInputs(name, email.toLowerCase(), phone, emergencyPhone, password)
        } catch (error) {
            setErrorMessage(error)
            return
        }
        await signUp({ email, password, name, phone, emergencyPhone })
        setShowModal(true)
    }

    const handlePressModal = () => {
        navigation.navigate('SignIn', { userType: 'passenger' })
        setShowModal(false)
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <ModalAfterSignUP visible={showModal} onPress={handlePressModal} />
                <View style={styles.header}>
                    <Text style={styles.title}>Crear nueva cuenta</Text>
                </View>
                <InputStyled
                    name='name'
                    placeholder="Nombre completo"
                    value={name}
                    onChangeText={text => setName(text)}
                    errorMessage={errorMessage}
                    inputMode="text"
                />
                <InputStyled
                    name='email'
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    errorMessage={errorMessage}
                    inputMode="email"
                />
                <InputStyled
                    name='phone'
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    errorMessage={errorMessage}
                    inputMode="tel"
                />
                <InputStyled
                    name='emergencyPhone'
                    placeholder="Teléfono de emergencia"
                    value={emergencyPhone}
                    onChangeText={text => setEmergencyPhone(text)}
                    errorMessage={errorMessage}
                    inputMode="tel"
                />
                <InputStyled
                    name='password'
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                    errorMessage={errorMessage}
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
