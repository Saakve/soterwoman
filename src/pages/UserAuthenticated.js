import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"

const Drawer = createDrawerNavigator()

function UserAuthenticated() {
  return (
    <Drawer.Navigator screenOptions={{
      headerTitle: "",
      headerTransparent: true 
    }}>
      <Drawer.Screen name="Home" component={Home}/>
    </Drawer.Navigator>
  )
}


export { UserAuthenticated }