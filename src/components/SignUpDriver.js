import { useEffect, useState } from "react"
import { View, Alert, StyleSheet, ScrollView, BackHandler } from "react-native"
import { Input, Button } from "@rneui/base"

import { useSignUp } from "../hooks/useSignUp"

export function SignUpDriver() {
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'driver' })
    const [page, setPage] = useState(0)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [drivinglicense, setDrivinglicense] = useState("")
    const [city, setCity] = useState("")
    const [model, setModel] = useState("")
    const [brand, setBrand] = useState("")
    const [year, setYear] = useState("")
    const [licenseplate, setLicenseplate] = useState("")

    useEffect(() => {
        if (errorSignUp) Alert.alert('Error', errorSignUp.message)
    }, [errorSignUp])

    useEffect(() => {
        if (page === 1) {
            const backAction = () => {
                setPage(0)
                return true
            }

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

            return () => backHandler.remove()
        }
    }, [page])

    if (page === 0) {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Input
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <Input
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <Input
                        placeholder="Número de teléfono"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                    />
                    <Input
                        placeholder="Número de licencia de conducir"
                        value={drivinglicense}
                        onChangeText={text => setDrivinglicense(text)}
                    />
                    <Input
                        placeholder="Ciudad"
                        value={city}
                        onChangeText={text => setCity(text)}
                    />
                    <Input
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                    <Button
                        title="Siguiente"
                        onPress={() => setPage(1)}
                    />
                </View>
            </ScrollView>
        )
    }

    if (page === 1) {
        return (
            <View style={styles.container}>
                <Input
                    placeholder="Marca"
                    value={brand}
                    onChangeText={text => setBrand(text)}
                />
                <Input
                    placeholder="Modelo"
                    value={model}
                    onChangeText={text => setModel(text)}
                />
                <Input
                    placeholder="Año"
                    value={year}
                    onChangeText={text => setYear(text)}
                />
                <Input
                    placeholder="Número de la placa"
                    value={licenseplate}
                    onChangeText={text => setLicenseplate(text)}
                />
                <Button
                    title="Registrarse"
                    disabled={isLoadingSignUp}
                    onPress={() => signUp({ email, password, name, phone, drivinglicense, city, brand, model, year, licenseplate })}
                />
            </View>
        )
    }
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