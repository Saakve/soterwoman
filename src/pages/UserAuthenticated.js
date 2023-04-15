import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Profile from "../components/profile/Profile";
import Vehicle from "../components/vehicle/Vehicle";
import { UserContextProvider } from "../context/UserContext"

const Drawer = createDrawerNavigator()

function UserAuthenticated() {
  return (
    <UserContextProvider>
    <Drawer.Navigator
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Vehicle" component={Vehicle} />
    </Drawer.Navigator>
    </UserContextProvider>
  );
}


export { UserAuthenticated }