import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Profile from "../components/profile/Profile";

const Drawer = createDrawerNavigator()

function UserAuthenticated() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}


export { UserAuthenticated }