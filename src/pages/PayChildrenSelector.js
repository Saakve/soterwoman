import { View, StyleSheet, Text } from "react-native";
import { TripPoints } from "../components/TripPoints";
import { Icon, Button } from "@rneui/base";
import { useState } from "react";

export default function PayChildrenSelector({
  origin,
  destination,
  onPress = () => {}
}) {
  const [childrenNumber, setChildrenNumber] = useState(0)
  const MAX_CHILDREN_NUMBER = 3
  const MIN_CHILDREN_NUMBER = 0;

  const addChildrens = () => {
    const lastChildrenNumber = childrenNumber
    childrenNumber < MAX_CHILDREN_NUMBER ?
    setChildrenNumber(childrenNumber + 1) : setChildrenNumber(lastChildrenNumber)
   console.log(lastChildrenNumber)

  }

  const substractChildrens = () => {
    const lastChildrenNumber = childrenNumber
    childrenNumber > MIN_CHILDREN_NUMBER ?
      setChildrenNumber(childrenNumber - 1) : 
      setChildrenNumber(lastChildrenNumber) 
  };

  return (
    <View style={styles.selector}>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination} />
      <View style={styles.selector_payments}>
        <Button
          icon={
            <Icon
              style={styles.payment_icons}
              name="credit-card"
              type="font-awesome-5"
              color="#0040C1"
            />
          }
          title={"Tarjeta de debito/credito"}
          titleStyle={{ color: "#111" }}
          buttonStyle={styles.button}
        />
        <Button
          icon={
            <Icon
              style={styles.payment_icons}
              name="money-bill"
              type="font-awesome-5"
              color="#03DE73"
            />
          }
          title={"Efectivo"}
          titleStyle={{ color: "#111" }}
          buttonStyle={styles.button}
        />
      </View>
      <View style={styles.selector_children}>
        <Icon
          style={styles.payment_icons}
          name="child"
          type="font-awesome-5"
          color="#F0C59D"
        />

        <Text style={{ fontSize: 18 }}>Niños</Text>
        <Button
          icon={
            <Icon name="minus" type="font-awesome-5" color="#FFF" size={10} />
          }
          buttonStyle={styles.change_button}
          onPress={substractChildrens}
        />
        <Text style={{ fontSize: 18 }}>{`${childrenNumber}`}</Text>
        <Button
          icon={
            <Icon name="plus" type="font-awesome-5" color="#FFF" size={10} />
          }
          onPress={addChildrens}
          buttonStyle={styles.change_button}
        />
      </View>
      <View style={styles.confirm}>
        <Button
          title="Confirmar viaje"
          buttonStyle={styles.button_confirm}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "35%",
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    bottom: Platform.select({ ios: "0%", android: "0%" }),
  },

  selector_payments: {
    justifyContent: "flex-start",
    flexDirection: "column-reverse",
    flexWrap: "wrap",
    alignItems: "baseline",
  },
  payment_icons: {
    marginHorizontal: "5%",
  },
  button: {
    height: 40,
    backgroundColor: "#FFF",
  },
  change_button: {
    backgroundColor: "#8946A6",    
    borderRadius: 5 
  },
  selector_children: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-around",
    width: 400,
  },
  selector_setchildren: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
  },
  confirm: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
   button_confirm: {
    borderRadius: 10,
    backgroundColor: "#8946A6",
  },
});
