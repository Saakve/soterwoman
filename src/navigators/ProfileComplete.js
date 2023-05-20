import { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Cards } from "./Cards";
import { Profile } from "./Profile";

import UserContext from "../context/UserContext";

import { HomePassenger } from "../pages/HomePassenger";
import { HomeDriver } from "../pages/HomeDriver";
import Trip from "../pages/Trip";
import VehicleDetails from "../pages/VehicleDetails";
import Message from "../pages/Message";
import Call from "../pages/Call";

import userType from "../utils/userType"

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
            <Drawer.Screen name="Home" component={idUserType === userType.DRIVER ? HomeDriver : HomePassenger } />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="Vehicle" component={VehicleDetails} />
            <Drawer.Screen name="Trip" component={Trip} />
            <Drawer.Screen name="Cards" component={Cards} options={{
                drawerLabel: idUserType === userType.DRIVER ? 'Metodos de cobro' : 'Métodos de pago'
            }} />
            <Drawer.Screen name="Message" component={Message} />
            <Drawer.Screen name="Call" component={Call} />
        </Drawer.Navigator>
    );
}

export { ProfileComplete };
