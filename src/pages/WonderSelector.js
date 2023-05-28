import { View, StyleSheet } from "react-native";
import WonderType from "../components/WonderType";
import { TripPoints } from "../components/TripPoints";

export default function WonderSelector({ wonders, origin, destination, onSelectWonder = () => { } }) {

  return (
    <View style={styles.selector}>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination} />
      <View>
        {wonders?.map(({ id, name, price }) => (
          <WonderType key={id} name={name} price={price} onPress={() => onSelectWonder(id)} />
        ))}
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
    bottom: Platform.select({ ios: "0%", android: "0%" }),
    justifyContent: "space-evenly"
  },
});
