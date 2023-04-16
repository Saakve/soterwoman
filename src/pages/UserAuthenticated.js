import { UserContextProvider } from "../context/UserContext"
import { CompletePassengerProfile } from "../components/ComplePassengerProfile"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProfileComplete } from "../components/ProfileComplete"
import { CompleteDriverProfile } from "../components/CompleteDriverProfile"

const Stack = createNativeStackNavigator()

function UserAuthenticated() {
  return (
    <UserContextProvider>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="ProfileComplete" component={ProfileComplete} />
        <Stack.Screen name='CompletePassengerProfile' component={CompletePassengerProfile} />
        <Stack.Screen name='CompleteDriverProfile' component={CompleteDriverProfile} />
      </Stack.Navigator>
    </UserContextProvider>
  )
}


export { UserAuthenticated }