import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { HomeDriver } from "./HomeDriver"

const Drawer = createDrawerNavigator()

function ProfileComplete() {
    return (
        <Drawer.Navigator screenOptions={{
            headerTitle: "",
            headerTransparent: true
        }}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name='HomeDriver' component={HomeDriver} />
        </Drawer.Navigator>
    )
}

export { ProfileComplete }