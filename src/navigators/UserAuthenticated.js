import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { UserContextProvider } from '../context/UserContext'

import { ProfileComplete } from '../navigators/ProfileComplete'
import { CompletePassengerProfile } from '../pages/ComplePassengerProfile'
import { CompleteDriverProfile } from '../pages/CompleteDriverProfile'

const Stack = createNativeStackNavigator()

function UserAuthenticated () {
  return (
    <UserContextProvider>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name='ProfileComplete' component={ProfileComplete} />
        <Stack.Screen name='CompletePassengerProfile' component={CompletePassengerProfile} />
        <Stack.Screen name='CompleteDriverProfile' component={CompleteDriverProfile} />
      </Stack.Navigator>
    </UserContextProvider>
  )
}

export { UserAuthenticated }
