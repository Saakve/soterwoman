import { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { Input, Button } from "@rneui/base"

import { useSignInWithProvider } from "../hooks/useSignInWithProvider"
import { useSignInWithEmail } from "../hooks/useSignInWithEmail"

export function SignIn() {
    const { isLoading: isLoadingFacebook, error: errorFacebook, signIn: signInWithFacebook } = useSignInWithProvider({provider: 'facebook'})
    const { isLoading: isLoadingGoogle, error: errorGoogle, signIn: signInWithGoogle } = useSignInWithProvider({provider: 'google'})
    const { isLoading: isLoadingEmail, error: errorEmail, signIn} = useSignInWithEmail()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect( () => {
        const anyerror = errorFacebook || errorGoogle || errorEmail
        if ( anyerror ) Alert.alert('Error', anyerror.message)
    }, [errorFacebook, errorGoogle, errorEmail ])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Input
                label="Correo electrónico"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                label="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button
                title="Iniciar sesion"
                disabled={isLoadingEmail}
                onPress={() => signIn({email, password})}
            />
            <View style={styles.providers}>
                <Button
                    color="#fff"
                    icon={{
                        color: "blue",
                        type: "font-awesome",
                        name: "facebook"
                    }}
                    onPress={() => signInWithFacebook() }
                    disabled={isLoadingFacebook || isLoadingGoogle}
                />
                <Button
                    color="#fff"
                    icon={{
                        type: "font-awesome",
                        name: "google"
                    }}
                    onPress={() => signInWithGoogle() }
                    disabled={isLoadingFacebook || isLoadingGoogle}
                />
            </View>
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