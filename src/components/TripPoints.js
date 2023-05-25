import { Icon } from "@rneui/base";
import { StyleSheet, Text, View } from "react-native";

export function TripPoints({ nameStartingpoint, nameEndpoint }) {
  return (
    <View style={styles.trippoints}>
      <View style={styles.icons}>
        <Icon name="dot-circle" type="font-awesome-5" color="#4CE5B1" />
        <Icon name="map-marker-alt" type="font-awesome-5" color="#F52D56" />
      </View>
      <View style={styles.nametrippoints}>
        <Text style={styles.text}>{nameStartingpoint}</Text>
        <Text style={styles.text}>{nameEndpoint}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  trippoints: {
    flexDirection: "row",
    height: "30%",
  },
  icons: {
    marginHorizontal: "5%",
    justifyContent: "space-evenly",
  },
  nametrippoints: {
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 18
  }
});
