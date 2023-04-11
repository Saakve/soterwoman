import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SignIn } from "../components/SignIn"
import { PassengerCarousel } from "../components/PassengerCarousel"
import { DriverCarousel } from "../components/DriverCarousel"
import { SignUpPassenger } from "../components/SignUpPassenger"
import { SignUpDriver } from "../components/SignUpDriver"

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
      <Stack.Screen name="SignUpPassenger" component={SignUpPassenger} />
      <Stack.Screen name="SignUpDriver" component={SignUpDriver}/>
    </Stack.Navigator>
  )
}
