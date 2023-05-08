import { useContext, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Button } from "@rneui/base"

import { InputStyled } from "../components/InputStyled"
import { validateEmergencyPhone, validateName, validatePhone } from "../utils/validateInputs"
import UserContext from "../context/UserContext"
import { completePassengerProfile } from "../services/completeProfiles"

const { height } = Dimensions.get("window")

export function CompletePassengerProfile({ navigation }) {
    const { userData } = useContext(UserContext)

    const [name, setName] = useState(userData.name)
    const [phone, setPhone] = useState(userData.phone)
    const [emergencyPhone, setEmergencyPhone] = useState("")

    const [errorMessage, setErrorMessage] = useState(null)

    const handlePressButton = async () => {
        setErrorMessage(null)
        try {
            validateName(name)
            await validatePhone(phone)
            validateEmergencyPhone(emergencyPhone)
        } catch (error) {
            setErrorMessage(error)
            return
        }
        await completePassengerProfile({ id: userData.id, name, phone, emergencyPhone })
        navigation.navigate('ProfileComplete')
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Completar perfil</Text>
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
                    placeholder="Correo electrónico"
                    value={userData.email}
                    disabled
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
                <Button
                    title="Completar registro"
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
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
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
