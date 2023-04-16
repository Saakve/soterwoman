import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function DetailProfile({ icon, title, subtitle }) {
  return (
    <View style={styles.borderContainer}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {icon && (
            <Icon
              name={icon}
              size={24}
              style={{
                color: "black",
                marginRight: 20,
              }}
            />
          )}
          <View style={styles.contentContainer}>
            <Text style={[styles.title]}>{title}</Text>

            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    paddingLeft: 24,
  },
  wrapper: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    borderBottomColor: "grey",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: "blue",
    fontSize: 15,
    marginTop: 4,
  },
});
