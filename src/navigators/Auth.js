import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { SignIn } from "../pages/SignIn"
import { PassengerCarousel } from "../pages/PassengerCarousel"
import { DriverCarousel } from "../pages/DriverCarousel"
import { SignUpPassenger } from "../pages/SignUpPassenger"
import { SignUpDriver } from "../pages/SignUpDriver"
import { GoBackButton } from "../components/GoBackButton"

const Stack = createNativeStackNavigator()

export function Auth() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: "#FFF"
      }
    }}>

      <Stack.Group screenOptions={{
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "#FFF"
        }
      }}>
        <Stack.Screen name="PassengerCarousel" component={PassengerCarousel} />
        <Stack.Screen name="DriverCarousel" component={DriverCarousel} />
      </Stack.Group>

      <Stack.Group screenOptions={{
        headerShown: true,
        title: "",
        headerShadowVisible: false,
        headerLeft: () => <GoBackButton />
      }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUpPassenger" component={SignUpPassenger} />
      </Stack.Group>
      <Stack.Screen name="SignUpDriver" component={SignUpDriver} />
    </Stack.Navigator>
  )
}
