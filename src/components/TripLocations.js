import { Image, View, StyleSheet, Text } from "react-native";

export default function TripLocation({ startingPoint, endPoint }) {
  return (
    <View style={styles.container}>
      <View style={styles.startingPoint}>
        <Text style={styles.Text}>{startingPoint}</Text>
      </View>
      <View style={styles.endPoint}>
        <Text style={styles.Text}>{endPoint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    border: 2,
    borderRadius: 10,
    marginLeft: "2%",
    marginRight: "3%",
    borderWidth: 2,
  },
  startingPoint: {
    color: "#111111",
    paddingBottom: "3%",
    paddingTop: "4%",
    marginLeft: "10%",
    borderBottomWidth: 1,
    width: "90%",
  },
  endPoint: {
    color: "#111111",
    marginLeft: "10%",
    paddingBottom: "4%",
    paddingTop: "3%",
  },
  Text: {
    fontSize: 20,
    fontWeight: "semibold",
  },
});
