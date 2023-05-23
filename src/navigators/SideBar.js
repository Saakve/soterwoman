import { useContext } from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer'

import { Cards } from './Cards'
import { Profile } from './Profile'

import UserContext from '../context/UserContext'

import userType from '../utils/userType'

import { supabase } from '../services/supabase'

import { HomePassenger } from '../pages/HomePassenger'
import { HomeDriver } from '../pages/HomeDriver'
import Trip from '../pages/Trip'
import VehicleDetails from '../pages/VehicleDetails'

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label='Cerrar sesión'
        onPress={async () => await supabase.auth.signOut()}
      />
    </DrawerContentScrollView>
  )
}

function SideBar() {
  const { userData: { idUserType } } = useContext(UserContext)

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: '',
        headerTransparent: true
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name='Home' component={idUserType === userType.DRIVER ? HomeDriver : HomePassenger} />
      <Drawer.Screen name='Profile' component={Profile} />
      {idUserType === userType.DRIVER ? <Drawer.Screen name='Vehicle' component={VehicleDetails} /> : null}
      <Drawer.Screen name='Trip' component={Trip} />
      <Drawer.Screen
        name='Cards' component={Cards} options={{
          drawerLabel: idUserType === userType.DRIVER ? 'Metodos de cobro' : 'Métodos de pago'
        }}
      />
    </Drawer.Navigator>
  )
}

export { SideBar }
