import { Home } from "../components/Home"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { HomeDriver } from "./HomeDriver"
import ProfileDetails from "./ProfileDetails";
import Trip from "./Trip"
import VehicleDetails from "./VehicleDetails";
import { Payment } from "./Payment";
import { Cards } from "./Cards";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Drawer = createDrawerNavigator()

function ProfileComplete() {

    const { userData: {idUserType} } = useContext(UserContext)

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
            <Drawer.Screen name="Cards" component={Cards} options={{
                drawerLabel: idUserType === 1 ? 'Metodos de cobro' : 'Métodos de pago'
            }}/>
        </Drawer.Navigator>
    )
}

export { ProfileComplete }