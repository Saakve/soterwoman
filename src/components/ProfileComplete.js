import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { HomeDriver } from "./HomeDriver"
import ProfileDetails from "./ProfileDetails";
import Trip from "./Trip"
import VehicleDetails from "./VehicleDetails";

const Drawer = createDrawerNavigator()

function ProfileComplete() {
    return (
        <Drawer.Navigator screenOptions={{
            headerTitle: "",
            headerTransparent: true
        }}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name='HomeDriver' component={HomeDriver} />
            <Drawer.Screen name='Profile' component={ProfileDetails} />
            <Drawer.Screen name='Vehicle' component={VehicleDetails} />
            <Drawer.Screen name='Trip' component={Trip} />
        </Drawer.Navigator>
    )
}

export { ProfileComplete }