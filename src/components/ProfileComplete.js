import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"

const Drawer = createDrawerNavigator()

function ProfileComplete() {
    return (
        <Drawer.Navigator screenOptions={{
            headerTitle: "",
            headerTransparent: true
        }}>
            <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
    )
}

export { ProfileComplete }