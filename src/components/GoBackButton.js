import { StyleSheet } from "react-native"
import { Button } from "@rneui/base"
import { useNavigation } from "@react-navigation/native"

export function GoBackButton() {
    const navigation = useNavigation()

    return (
        <Button 
          buttonStyle={styles.backButton}
          onPress={() => navigation.goBack()}
          icon={{
            type: "font-awesome",
            name: "angle-left",
            size: 35,
            color: "#E67575"
          }}
          iconContainerStyle={styles.icon}
        />
    )
}

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: "#FFF",
        borderRadius: 50,
        width: 36,
        height: 36,
        borderColor: "#11D1",
        borderWidth: 1
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: 50,
        justifyContent: "center",
        paddingRight: 3
    }
})
