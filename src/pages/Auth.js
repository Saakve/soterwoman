import { useEffect, useState } from "react"
import { View, Text, Alert, StyleSheet } from "react-native"
import { Input, Button } from "@rneui/base"

import { useSignInWithProvider } from "../hooks/useSignInWithProvider"
import { useSignInWithEmail } from "../hooks/useSignInWithEmail"
import { useSignUp } from "../hooks/useSignUp"

export function Auth() {
    const { isLoading: isLoadingFacebook, error: errorFacebook, signIn: signInWithFacebook } = useSignInWithProvider({provider: 'facebook'})
    const { isLoading: isLoadingGoogle, error: errorGoogle, signIn: signInWithGoogle } = useSignInWithProvider({provider: 'google'})
    const { isLoading: isLoadingEmail, error: errorEmail, signIn} = useSignInWithEmail()
    const { isLoading: isLoadingSignUp, error: errorSignUp, signUp} = useSignUp()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect( () => {
        const anyerror = errorFacebook || errorGoogle || errorEmail || errorSignUp
        if ( anyerror ) Alert.alert('Error', anyerror.message)
    }, [errorFacebook, errorGoogle, errorEmail, errorSignUp])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Input
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button
                title="Iniciar sesion"
                disabled={isLoadingEmail}
                onPress={() => signIn({email, password})}
            />
            <Button
                title="Registrase"
                disabled={isLoadingSignUp}
                onPress={() => signUp({email, password})}
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