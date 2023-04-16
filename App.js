import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Auth } from './src/pages/Auth';
import { UserAuthenticated } from './src/pages/UserAuthenticated';
import { useIsSignIn } from './src/hooks/useIsSignIn';

const Stack = createNativeStackNavigator()

export default function App() {

  const { isSignIn } = useIsSignIn()

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          {
            isSignIn ? 
            (<Stack.Screen name='UserAuthenticated' component={UserAuthenticated}/>) :
            (<Stack.Screen name='Auth' component={Auth}/>)
          }
        </Stack.Navigator>
      </NavigationContainer>
  )
}
