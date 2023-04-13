import { createContext, useContext, useEffect, useState } from "react"
import { View, Alert, StyleSheet, ScrollView, BackHandler, Text, Dimensions } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Button } from "@rneui/base"

import { useSignUp } from "../hooks/useSignUp"
import { InputStyled } from "./InputStyled.js"
import { GoBackButton } from "../components/GoBackButton"
import { validateDriverInputs } from "../utils/validateInputs"

const Stack = createNativeStackNavigator()
const AllInfoContex = createContext(null)
const { height } = Dimensions.get('window')

const DriverInfo = ({ navigation }) => {
    const { setDriverInfo } = useContext(AllInfoContex)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [drivingLicense, setDrivingLicense] = useState("")
    const [city, setCity] = useState("")
    const [password, setPassword] = useState("")

    const [nameErrorMessage, setNameErrorMessage] = useState(null)
    const [emailErrorMessage, setEmailErrorMessage] = useState(null)
    const [phoneErrorMessage, setPhoneErrorMessage] = useState(null)
    const [drivingLicenseErrorMessage, setDrivingLicenseErrorMessage ] = useState(null)
    const [cityErrorMessage, setCityErrorMessage] = useState(null)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(null)

    const cleanInputsErrors = () => {
        setNameErrorMessage(null)
        setEmailErrorMessage(null)
        setPhoneErrorMessage(null)
        setDrivingLicenseErrorMessage(null)
        setCityErrorMessage(null)
        setPasswordErrorMessage(null)
    }

    const handlePressButton = async () => {
        cleanInputsErrors()
        try {
            validateDriverInputs(name, email, phone, drivingLicense, city, password)
        } catch (error) {
            if(error.param === 'name') setNameErrorMessage(error.message)
            if(error.param === 'email') setEmailErrorMessage(error.message)
            if(error.param === 'phone') setPhoneErrorMessage(error.message)
            if(error.param === 'drivingLicense') setDrivingLicenseErrorMessage(error.message)
            if(error.param === 'city') setCityErrorMessage(error.message)
            if(error.param === 'password') setPasswordErrorMessage(error.message)
            return
        }
        setDriverInfo({ email, password, name, phone, drivingLicense, city })
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
                    errorMessage={nameErrorMessage}
                />
                <InputStyled
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    inputMode="email"
                    errorMessage={emailErrorMessage}
                />
                <InputStyled
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    inputMode="tel"
                    errorMessage={phoneErrorMessage}
                />
                <InputStyled
                    placeholder="Número de licencia de conducir"
                    value={drivingLicense}
                    onChangeText={text => setDrivingLicense(text)}
                    inputMode="text"
                    errorMessage={drivingLicenseErrorMessage}
                />
                <InputStyled
                    placeholder="Ciudad"
                    value={city}
                    onChangeText={text => setCity(text)}
                    inputMode="text"
                    errorMessage={cityErrorMessage}
                />
                <InputStyled
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                    inputMode="text"
                    errorMessage={passwordErrorMessage}
                />
                <Button
                    title="Siguiente"
                    onPress={handlePressButton}
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
    const [licensePlate, setLicensePlate] = useState("")

    const [modelErrorMessage, setModelErrorMessage] = useState(null)
    const [brandErrorMessage, setBrandErrorMessage] = useState(null)
    const [yearErrorMessage, setYearErrorMessage] = useState(null)
    const [licensePlateErrorMessage, setLicensePlateErrorMessage] = useState(null)

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    const cleanInputsErrors = () => {
        setModelErrorMessage(null)
        setBrandErrorMessage(null)
        setYearErrorMessage(null)
        setLicensePlateErrorMessage(null)
    }

    const handlePressButton = async () => {
        cleanInputsErrors()
        try {
            await signUp({ ...driverInfo, brand, model, year, licensePlate })
        } catch (error) {
            console.log(error)
            if(error.param === 'brand') setBrandErrorMessage(error.message)
            if(error.param === 'model') setModelErrorMessage(error.message)
            if(error.param === 'year') setYearErrorMessage(error.message)
            if(error.param === 'licensePlate') setLicensePlate(error.message)
        }
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
                    errorMessage={brandErrorMessage}
                />
                <InputStyled
                    placeholder="Modelo"
                    value={model}
                    onChangeText={text => setModel(text)}
                    inputMode="text"
                    errorMessage={modelErrorMessage}
                />
                <InputStyled
                    placeholder="Año"
                    value={year}
                    onChangeText={text => setYear(text)}
                    inputMode="numeric"
                    errorMessage={yearErrorMessage}
                />
                <InputStyled
                    placeholder="Número de la placa"
                    value={licensePlate}
                    onChangeText={text => setLicensePlate(text)}
                    inputMode="text"
                    errorMessage={licensePlateErrorMessage}
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