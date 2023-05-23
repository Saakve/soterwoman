import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SideBar } from './SideBar'
import Message from '../pages/Message'

const Stack = createNativeStackNavigator()

function ProfileComplete() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='SideBar' component={SideBar} />
      <Stack.Screen name='Message' component={Message} />
    </Stack.Navigator>
  )
}

export { ProfileComplete }
