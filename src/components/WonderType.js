import { View, StyleSheet, Text } from "react-native";
import { Icon } from "@rneui/base";

export default function WonderType({ name }) {
  return (
    <View style={styles.wondertypes}>
      <Icon
        style={styles.wondertypes_icons}
        name="car-side"
        type="font-awesome-5"
        color="#242E42"
      />
      <View style={styles.wondertypes_data}>
          <Text style={styles.wonderType}>{name.name}</Text>
          <Text style={styles.price}>{name.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wondertypes: {
    flexDirection: "row",
  },
  wondertypes_icons: {
    marginHorizontal: "5%",
  },
  wondertypes_data: {
    flexDirection: "row",
  },
  wonderType: {
    fontSize: 20,
  },
  price: {
    marginHorizontal: "10%",
    fontSize: 20,
  },
});
