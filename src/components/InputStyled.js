import { Input } from "@rneui/base"
import { StyleSheet } from "react-native"

export function InputStyled(props) {
    return (
        <Input
            inputStyle={styles.inputplaceholder}
            inputContainerStyle={styles.inputcontainer}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    inputplaceholder: {
        paddingLeft: 20,
        paddingTop: 13,
        paddingBottom: 12,
    },
    inputcontainer: {
        width: 335,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: "center"
    }
})