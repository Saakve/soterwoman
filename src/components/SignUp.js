import { View, Text } from "react-native"
import { SignUpPassenger } from "./SignUpPassenger"

export function SignUp ({ route }) {
    const { view } = route.params

    return (
        view === 'passenger'
        ?
        <SignUpPassenger />
        :
        <View>
            <Text>
                SALUDOS
            </Text>
        </View>
    )
}

