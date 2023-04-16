import { View, StyleSheet } from "react-native";
import TripLocation from "./TripLocations";
import TripStatus from "./TripStatus";

export default function TripContainer({ startingPoint, endPoint, cost, status }) {
  return (
    <View style={styles.container}>
      <TripLocation startingPoint={startingPoint} endPoint={endPoint} />
      <TripStatus cost={cost} status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    marginBottom: 10
  },
})