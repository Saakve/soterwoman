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

function CustomDrawerContent (props) {
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

function SideBar () {
  const { userData: { idUserType } } = useContext(UserContext)

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: '',
        headerTransparent: true
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name='Mapa' component={idUserType === userType.DRIVER ? HomeDriver : HomePassenger} />
      <Drawer.Screen name='Información de usuario' component={Profile} />
      {idUserType === userType.DRIVER ? <Drawer.Screen name='Información del vehículo' component={VehicleDetails} /> : null}
      <Drawer.Screen name='Viajes realizados' component={Trip} />
      <Drawer.Screen
        name='Cards' component={Cards} options={{
          drawerLabel: idUserType === userType.DRIVER ? 'Métodos de cobro' : 'Métodos de pago'
        }}
      />
    </Drawer.Navigator>
  )
}

export { SideBar }
