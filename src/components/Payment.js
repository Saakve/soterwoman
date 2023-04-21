import { Button } from "@rneui/base";
import { CardField, StripeProvider, useConfirmSetupIntent, CardForm } from "@stripe/stripe-react-native";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { getPublishableKey } from "../services/getPublishableKey";
import { addCard, createSetupIntentOnBackend } from "../services/stripe";

import UserContext from "../context/UserContext";

export function Payment() {
    const { userData } = useContext(UserContext)
    const [publishableKey, setPublishableKey] = useState(null)
    const { confirmSetupIntent, loading } = useConfirmSetupIntent()

    useEffect(() => {
        fetchKey = async () => {
            const key = await getPublishableKey()
            console.log(key)
            setPublishableKey(key)
        }
        fetchKey()
    }, [])

    const handleSavePaymentMethod = async () => {
        const { client_secret } = await addCard({id: "cus_Nka0i1TlmlsEwt"})
        const { setupIntent, error } = await confirmSetupIntent(client_secret, {
            paymentMethodType: 'Card'
        })

        console.log(setupIntent)
        if (error) console.log(error)
    }

    return (
        <StripeProvider
            publishableKey={publishableKey}
        >
            <View style={styles.container}>
                <Text style={styles.text}>
                    Agregar método de pago
                </Text>
                <View style={{ alignItems: "center" }}>
                    <CardField
                        style={styles.card}
                        cardStyle={{
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        onCardChange={(cardDetails) => {
                            console.log('cardDetails', cardDetails);
                        }}
                    />
                </View>
                <Button buttonStyle={styles.button} color={styles.button.color} title="Guardar" onPress={handleSavePaymentMethod} />
            </View>
        </StripeProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#FFF"
    },
    text: {
        textAlign: "center",
        marginBottom: 10,
        fontFamily: "OpenSans-Bold",
        fontSize: 17
    },
    card: {
        width: "90%",
        height: 60,
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