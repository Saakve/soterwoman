import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ListOfCards } from "./ListOfCards"
import { AddCard } from "./AddCard"
import { useEffect } from "react"
import { EditCard } from "./EditCard"

const Stack = createNativeStackNavigator()

export function Cards() {

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="ListOfCards" component={ListOfCards} />
            <Stack.Screen name="AddCard" component={AddCard} />
            <Stack.Screen name="EditCard" component={EditCard} />
        </Stack.Navigator>
    )
}