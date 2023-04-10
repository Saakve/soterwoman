import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SignIn } from "../components/SignIn"
import { SignUp } from "../components/SignUp"
import { AuthHome } from "../components/AuthHome"
import { AuthStart } from "../components/AuthStart"
import { PassengerCarousel } from "../components/PassengerCarousel"

const Stack = createNativeStackNavigator()

export function Auth() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="PassengerCarousel"
        component={PassengerCarousel}
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name="AuthHome"
        component={AuthHome}
      />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}
