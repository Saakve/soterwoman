import { View, Text, StyleSheet } from "react-native";

export function ToggleOnService() {
    return (
        <View style={styles.container} >
            <Text>TOGGLE SERVICE</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        position: "absolute"
    }
})