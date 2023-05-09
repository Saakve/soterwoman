import { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Cards } from "./Cards";

import { Home } from "../pages/Home";
import { HomeDriver } from "../pages/HomeDriver";
import ProfileDetails from "../pages/ProfileDetails";
import Trip from "../pages/Trip";
import VehicleDetails from "../pages/VehicleDetails";
import UserContext from "../context/UserContext";
import Message from "../pages/Message";
import Call from "../pages/Call";

const Drawer = createDrawerNavigator();

function ProfileComplete() {

    const { userData: { idUserType } } = useContext(UserContext)

    return (
        <Drawer.Navigator
            screenOptions={{
                headerTitle: "",
                headerTransparent: true,
            }}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="HomeDriver" component={HomeDriver} />
            <Drawer.Screen name="Profile" component={ProfileDetails} />
            <Drawer.Screen name="Vehicle" component={VehicleDetails} />
            <Drawer.Screen name="Trip" component={Trip} />
            <Drawer.Screen name="Cards" component={Cards} options={{
                drawerLabel: idUserType === 1 ? 'Metodos de cobro' : 'Métodos de pago'
            }} />
            <Drawer.Screen name="Message" component={Message} />
            <Drawer.Screen name="Call" component={Call} />
        </Drawer.Navigator>
    );
}

export { ProfileComplete };
