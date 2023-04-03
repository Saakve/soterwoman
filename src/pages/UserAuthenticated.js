import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Profile from "../components/profile/Profile";
import Vehicle from "../components/vehicle/Vehicle";

const Drawer = createDrawerNavigator()

function UserAuthenticated() {
  return (
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
  );
}


export { UserAuthenticated }