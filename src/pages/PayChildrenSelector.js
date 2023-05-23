import { View, StyleSheet, Text } from "react-native";
import { TripPoints } from "../components/TripPoints";
import { Icon, Button } from "@rneui/base";
import { useState } from "react";

export default function PayChildrenSelector({
  origin,
  destination,
  onReturn = () => {}
}) {
  const [childrenNumber, setChildrenNumber] = useState(0)

  const addChildrens = () => {
    setChildrenNumber(childrenNumber + 1)
  }

  const substractChildrens = () => {
      setChildrenNumber(childrenNumber - 1);
  };

  return (
    <View style={styles.selector}>
      <Icon
        style={styles.selector_icons}
        name="arrow-left"
        type="font-awesome-5"
        color="#111"
        onPress={onReturn}
      />
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

        <Text style={{ fontSize: 20 }}>Niños</Text>
        <View style={styles.selector_setchildren}>
          <Button
            icon={
              <Icon name="minus" type="font-awesome-5" color="#FFF" size={10} />
            }
            buttonStyle={styles.change_button}
            onPress={substractChildrens}
          />
          <Text style={{ fontSize: 20 }}>{`${childrenNumber}`}</Text>
          <Button
            icon={
              <Icon name="plus" type="font-awesome-5" color="#FFF" size={10} />
            }
            buttonStyle={styles.change_button}
            onPress={addChildrens}
          />
        </View>
      </View>
      <View style={styles.confirm}>
        <Button title={"Confirmar viaje"} buttonStyle={styles.button_confirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "30%",
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    bottom: Platform.select({ ios: "0%", android: "0%" }),
    justifyContent: "space-evenly",
  },
  selector_icons: {
    marginHorizontal: "5%",
  },
  payment_icons: {
    marginHorizontal: "5%",
  },
  button: {
    borderRadius: 10,
    width: 300,
    height: 40,
    margin: "1%",
    backgroundColor: "#FFF",
  },
  change_button: {
    borderRadius: 10,
    width: 60,
    height: 30,
    backgroundColor: "#8946A6",
  },
  selector_children: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selector_setchildren: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: "20",
  },
  button_confirm: {
    borderRadius: 10,
    backgroundColor: "#8946A6",
  },
});
