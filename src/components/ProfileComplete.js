import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { HomeDriver } from "./HomeDriver"
import Profile from "./profile/Profile"
import Vehicle from "./vehicle/Vehicle"
import Trip from "./Trip"

const Drawer = createDrawerNavigator()

function ProfileComplete() {
    return (
        <Drawer.Navigator screenOptions={{
            headerTitle: "",
            headerTransparent: true
        }}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name='HomeDriver' component={HomeDriver} />
            <Drawer.Screen name='Profile' component={Profile} />
            <Drawer.Screen name='Vehicle' component={Vehicle} />
            <Drawer.Screen name='Trip' component={Trip} />
        </Drawer.Navigator>
    )
}

export { ProfileComplete }