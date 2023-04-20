import { Button } from "@rneui/base";
import { CardField, StripeProvider } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { fetchKey, getPublishableKey } from "../services/getPublishableKey";

export function Payment() {

    return (
        <StripeProvider
            publishableKey=""
        >
            <View style={styles.container}>
                <Text style={styles.text}>
                    Agregar método de pago
                </Text>
                <View style={{alignItems: "center"}}>
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
                <Button buttonStyle={styles.button} color={styles.button.color} title="Guardar"/>
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