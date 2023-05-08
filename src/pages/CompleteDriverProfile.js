import { createContext, useContext, useState } from "react"
import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Button } from "@rneui/base"

import { InputStyled } from "../components/InputStyled.js"
import { GoBackButton } from "../components/GoBackButton.js"
import { validateDrivingLicense, validateName, validatePhone, validateVehicleInputs } from "../utils/validateInputs.js"
import UserContext from "../context/UserContext.js"
import { validateCity } from "../utils/validateInputs.js"
import { completeDriverProfile } from "../services/completeProfiles.js"

const Stack = createNativeStackNavigator()
const AllInfoContex = createContext(null)
const { height } = Dimensions.get('window')

const DriverInfo = ({ navigation }) => {
    const { userData } = useContext(UserContext)
    const { setAllInfo } = useContext(AllInfoContex)

    const [name, setName] = useState(userData.name)
    const [phone, setPhone] = useState(userData.phone)
    const [drivingLicense, setDrivingLicense] = useState("")
    const [city, setCity] = useState("")

    const [errorMessage, setErrorMessage] = useState(null)

    const handlePressButton = async () => {
        setErrorMessage(null)
        try {
            validateName(name)
            await validatePhone(phone)
            await validateDrivingLicense(drivingLicense)
            validateCity(city)
        } catch (error) {
            setErrorMessage(error)
            return
        }
        setAllInfo({ id: userData.id, name, phone, drivingLicense, city })
        navigation.navigate('VehicleInfo')
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
                    inputMode="text"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='email'
                    value={userData.email}
                    disabled
                />
                <InputStyled
                    name='phone'
                    placeholder="Teléfono"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    inputMode="tel"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='drivingLicense'
                    placeholder="Número de licencia de conducir"
                    value={drivingLicense}
                    onChangeText={text => setDrivingLicense(text)}
                    inputMode="text"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='city'
                    placeholder="Ciudad"
                    value={city}
                    onChangeText={text => setCity(text)}
                    inputMode="text"
                    errorMessage={errorMessage}
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

const VehicleInfo = ({ navigation }) => {
    const { allInfo } = useContext(AllInfoContex)

    const [model, setModel] = useState("")
    const [brand, setBrand] = useState("")
    const [year, setYear] = useState("")
    const [licensePlate, setLicensePlate] = useState("")

    const [errorMessage, setErrorMessage] = useState(null)

    const handlePressButton = async () => {
        setErrorMessage(null)
        try {
            await validateVehicleInputs(brand, model, year, licensePlate)
        } catch (error) {
            setErrorMessage(error)
            return
        }
        await completeDriverProfile({ ...allInfo, model, brand, year, licensePlate })
        navigation.navigate('ProfileComplete')
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Detalles del vehículo</Text>
                </View>
                <InputStyled
                    name='brand'
                    placeholder="Marca"
                    value={brand}
                    onChangeText={text => setBrand(text)}
                    inputMode="text"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='model'
                    placeholder="Modelo"
                    value={model}
                    onChangeText={text => setModel(text)}
                    inputMode="text"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='year'
                    placeholder="Año"
                    value={year}
                    onChangeText={text => setYear(text)}
                    inputMode="numeric"
                    errorMessage={errorMessage}
                />
                <InputStyled
                    name='licensePlate'
                    placeholder="Número de la placa"
                    value={licensePlate}
                    onChangeText={text => setLicensePlate(text)}
                    inputMode="text"
                    errorMessage={errorMessage}
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

export function CompleteDriverProfile() {
    const [allInfo, setAllInfo] = useState({})

    return (
        <AllInfoContex.Provider value={{ allInfo, setAllInfo }}>
            <Stack.Navigator>
                <Stack.Screen name="DriverInfo" component={DriverInfo} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="VehicleInfo" component={VehicleInfo} options={{
                    headerShadowVisible: false,
                    title: "",
                    headerLeft: () => <GoBackButton />
                }} />
            </Stack.Navigator>
        </AllInfoContex.Provider>
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