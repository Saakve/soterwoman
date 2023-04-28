import { StyleSheet, View, Text } from "react-native";
import { Icon } from "@rneui/base";

export function Card({ id, last4, brand, isDefault, name, postal_code, onPress, borderColor}) {

    return (
        <View style={{...styles.card, borderColor }} onTouchEnd={() => onPress({id})}>
            <Icon
                name="credit-card"
                type="font-awesome"
                color="#4CE5B1"
                style={styles.icon}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>{brand}-{last4}</Text>
                <View style={styles.footer}>
                    <Text style={styles.text}>{name}</Text>
                    <Text style={styles.text}>{postal_code}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        fontFamily: "OpenSans-Regular"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: "10%",
        marginTop: "3%"
    },
    card: {
        backgroundColor: "#FFF",
        borderWidth: 2,
        borderRadius: 8,
        marginVertical: 10,
        width: "80%",
        alignSelf: "center",
        flexDirection: "row",
        shadowColor: "#111",
        shadowOpacity : 12,
        shadowRadius: 12,
        shadowOffset: {
            height: 30,
            width: 50
        },
        elevation: 5
    },
    icon: {
        marginHorizontal: "3%",
        marginTop: "8%"
    }
})