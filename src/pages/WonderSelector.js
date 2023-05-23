import { View, StyleSheet, Text } from "react-native";
import { WONDER_TYPE } from "../Constants /wonderTypes";
import WonderType from "../components/WonderType";
import { TripPoints } from "../components/TripPoints";

export default function WonderSelector({ origin, destination}) {
  return (
    <View style={styles.selector}>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination}/>
      {WONDER_TYPE.map((name = {}, index) => (
        <WonderType key={index} name={name}/>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "25%",
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    bottom: Platform.select({ ios: "0%", android: "0%" }),
    justifyContent: "space-evenly"
  },
});
