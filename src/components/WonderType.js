import { View, StyleSheet } from "react-native";
import { Icon, Button } from "@rneui/base";

export default function WonderType({ name, onPress = () => {} }) {
  return (
    <View style={styles.wondertypes}>
      <View style={styles.wondertypes_data}>
        <Button
          icon={
            <Icon
              style={styles.wondertypes_data_icons}
              name="car-side"
              type="font-awesome-5"
              color="#242E42"
            />
          }
          title={`${name.name} ${name.price}`}
          titleStyle={{ color: "#111" }}
          buttonStyle={styles.button}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wondertypes: {
    flexDirection: "row",
  },
  wondertypes_data: {
    flexDirection: "row",
  },
  wondertypes_data_icons: {
    marginHorizontal: "5%",
  },
  button: {
    borderRadius: 10,
    width: 250,
    height: 40,
    margin: "1%",
    backgroundColor: "#FFF",
  },
});
