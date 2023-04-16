import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'

import { useCallback } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'

import { Auth } from './src/pages/Auth'
import { UserAuthenticated } from './src/pages/UserAuthenticated'
import { useIsSignIn } from './src/hooks/useIsSignIn'
import { SignInLikeContextProvider } from './src/context/SingInLikeContext'

const Stack = createNativeStackNavigator()

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': require('./assets/fonts/OpenSans/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans/OpenSans-Bold.ttf')
  })
  const { isSignIn } = useIsSignIn()

  const onReady = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <SignInLikeContextProvider>
      <NavigationContainer onReady={onReady}>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          {
            isSignIn ?
              (<Stack.Screen name='UserAuthenticated' component={UserAuthenticated} />) :
              (<Stack.Screen name='Auth' component={Auth} />)
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SignInLikeContextProvider>
  )
}
