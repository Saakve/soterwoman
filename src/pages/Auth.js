import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SignIn } from "../components/SignIn"
import { SignUp } from "../components/SignUp"
import { PassengerCarousel } from "../components/PassengerCarousel"
import { DriverCarousel } from "../components/DriverCarousel"

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
        name="DriverCarousel"
        component={DriverCarousel}
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}
