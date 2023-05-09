import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileDetails from "../pages/ProfileDetails"
import { ChangePassword } from "../pages/ChangePassword"

const Stack = createNativeStackNavigator()

export function Profile() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    )
}