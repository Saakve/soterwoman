import React, { useContext, useState } from "react"
import { StyleSheet, View } from "react-native"
import Thumbnail from "../components/Avatar"
import { supabase } from "../services/supabase"
import UserContext from "../context/UserContext"
import { Button } from "@rneui/themed"
import { validateNewPassword } from "../utils/validateInputs"
import { InputStyled } from "../components/InputStyled.js"

export function ChangePassword({ navigation }) {
    const { userData } = useContext(UserContext)
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordValidation, setNewPasswordValidation] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleOnPress = async () => {
        setErrorMessage(null);
        if (newPassword !== newPasswordValidation) {
            setErrorMessage("Contraseñas diferentes")
            return
        }

        const { data, error } = await supabase.rpc("equalPassword", { passwordtovalidate: password })

        if (!data) {
            setErrorMessage("Contraseña actual no coincide");
            return
        }

        try {
            validateNewPassword(newPassword, newPasswordValidation);
        } catch (error) {
            setErrorMessage(error);
            return;
        }

        const { dataNewPassword, errorNewPassword } = await supabase.auth.updateUser({ password: newPassword });
        
        navigation.goBack()
    }

    return (
        <View>
            <View style={styles.avatarSection}>
                <Thumbnail
                    name={userData?.name}
                    url={userData?.idImage}
                    size={90}
                />
            </View>
            <InputStyled
                name="password"
                secureTextEntry
                label="Contraseña actual"
                onChangeText={(password) => {
                    setPassword(password);
                }}
                inputMode="text"
                placeholder="Contraseña actual"
                errorMessage={errorMessage}
            />
            <InputStyled
                name="newpassword"
                secureTextEntry
                label="Nueva contraseña"
                onChangeText={(newPassword) => {
                    setNewPassword(newPassword);
                }}
                errorMessage={errorMessage}
                placeholder="Contraseña"
                inputMode="text"
            />
            <InputStyled
                label="Nueva contraseña"
                name="newpasswordvalidation"
                secureTextEntry
                onChangeText={(newPasswordValidation) => {
                    setNewPasswordValidation(newPasswordValidation);
                }}
                errorMessage={errorMessage}
                placeholder="Contraseña"
                inputMode="text"
            />
            <Button
                title="Guardar cambios"
                buttonStyle={styles.button}
                color="#8946A6"
                onPress={handleOnPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#B762C1",
    },
    avatarSection: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#B762C1",
        marginBottom: 20,
        padding: "1%",
        height: "20%",
    },
    detailsSection: {
        flex: 1,
        backgroundColor: "white"
    },
    button: {
        marginTop: 5,
        color: "#8946A6",
        width: 330,
        height: 50,
        alignSelf: "center",
        borderRadius: 10,
    },
    changePassword: {
        marginTop: 500,
    },
});