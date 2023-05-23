import { View, StyleSheet } from "react-native";
import WonderType from "../components/WonderType";
import { TripPoints } from "../components/TripPoints";
import { WONDER_TYPE } from "../constants/wonderTypes";

export default function WonderSelector({ origin, destination, onSelectWonder = () => {} }) {

  return (
    <View style={styles.selector}>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination}/>
      <View>
        {WONDER_TYPE.map((name = {}, index) => (
          <WonderType key={index} name={name} onPress={onSelectWonder}/>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "26%",
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    bottom: Platform.select({ ios: "0%", android: "0%" }),
    justifyContent: "space-evenly"
  },
});
