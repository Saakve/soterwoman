import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './src/services/supabase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Auth } from './src/pages/Auth';
import { UserAuthenticated } from './src/pages/UserAuthenticated';

const Stack = createNativeStackNavigator()

export default function App() {

  const [ user, setUser ] = useState(null)

  useEffect( () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if(session) {
        const { user: {id, email} }  = session        
        setUser({id, email})
      } else {
        setUser(session)
      }
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {
          user ? 
          (<Stack.Screen name='UserAuthenticated' component={UserAuthenticated} initialParams={{user}}/>) :
          (<Stack.Screen name='Auth' component={Auth}/>)
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
