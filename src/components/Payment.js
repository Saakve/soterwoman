import { CardField, StripeProvider } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

export function Payment() {
   const [publishableKey, setPublishableKey] = useState(null)

    return (
        <StripeProvider
            publishableKey=""
        >
            <View style={styles.container}>
                <Text style={styles.text}>
                    Agregar método de pago
                </Text>
                <CardField
                    style={styles.card}
                    cardStyle={{
                        borderColor: "#000",
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                />
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
        textAlign: "center"
    },
    card: {
        backgroundColor: "000",
        width: "100%",
        height: 60,
    }
})