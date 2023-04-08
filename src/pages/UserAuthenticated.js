import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { UserContextProvider } from "../context/UserContext"

const Drawer = createDrawerNavigator()

function UserAuthenticated() {
  return (
    <UserContextProvider>
      <Drawer.Navigator screenOptions={{
        headerTitle: "",
        headerTransparent: true
      }}>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </UserContextProvider>
  )
}


export { UserAuthenticated }