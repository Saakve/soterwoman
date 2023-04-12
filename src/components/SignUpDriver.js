import { createContext, useContext, useEffect, useState } from "react"
import { View, Alert, StyleSheet, ScrollView, BackHandler, Text, Dimensions } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Button } from "@rneui/base"

import { useSignUp } from "../hooks/useSignUp"
import { InputStyled } from "./InputStyled.js"
import { GoBackButton } from "../components/GoBackButton"

const Stack = createNativeStackNavigator()
const AllInfoContex = createContext(null)
const { height } = Dimensions.get('window')

const DriverInfo = ({ navigation }) => {
    const { setDriverInfo } = useContext(AllInfoContex)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [drivinglicense, setDrivinglicense] = useState("")
    const [city, setCity] = useState("")

    const handlePressButton = () => {
        setDriverInfo({ email, password, name, phone, drivinglicense, city })
        navigation.navigate('VehicleInfo')
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
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    inputMode="email"
                />
                <InputStyled
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    inputMode="tel"
                />
                <InputStyled
                    placeholder="Número de licencia de conducir"
                    value={drivinglicense}
                    onChangeText={text => setDrivinglicense(text)}
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Ciudad"
                    value={city}
                    onChangeText={text => setCity(text)}
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    title="Siguiente"
                    onPress={() => handlePressButton()}
                    color="#8946A6"
                    buttonStyle={styles.button}
                />
            </View>
        </ScrollView>
    )
}

const VehicleInfo = () => {
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'driver' })
    const { driverInfo } = useContext(AllInfoContex)

    const [model, setModel] = useState("")
    const [brand, setBrand] = useState("")
    const [year, setYear] = useState("")
    const [licenseplate, setLicenseplate] = useState("")

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    const handlePressButton = () => {
        console.log({ ...driverInfo, brand, model, year, licenseplate })
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Detalles del vehículo</Text>
                </View>
                <InputStyled
                    placeholder="Marca"
                    value={brand}
                    onChangeText={text => setBrand(text)}
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Modelo"
                    value={model}
                    onChangeText={text => setModel(text)}
                    inputMode="text"
                />
                <InputStyled
                    placeholder="Año"
                    value={year}
                    onChangeText={text => setYear(text)}
                    inputMode="numeric"
                />
                <InputStyled
                    placeholder="Número de la placa"
                    value={licenseplate}
                    onChangeText={text => setLicenseplate(text)}
                    inputMode="text"
                />
                <Button
                    title="Registrarse"
                    disabled={isLoadingSignUp}
                    onPress={() => handlePressButton()}
                    color="#8946A6"
                    buttonStyle={styles.button}
                />
            </View>
        </ScrollView>
    )
}

export function SignUpDriver() {
    const [driverInfo, setDriverInfo] = useState({})

    return (
        <AllInfoContex.Provider value={{ driverInfo, setDriverInfo }}>
            <Stack.Navigator screenOptions={{
                headerShadowVisible: false,
                title: "",
                headerLeft: () => <GoBackButton />
            }}>
                <Stack.Screen name="DriverInfo" component={DriverInfo} />
                <Stack.Screen name="VehicleInfo" component={VehicleInfo} />
            </Stack.Navigator>
        </AllInfoContex.Provider>
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
        borderColor: "red",
        borderWidth: 2,
        marginHorizontal: 20
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