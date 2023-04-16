import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DetailProfile from "../DetailProfile";
import { supabase } from "../../services/supabase";
import { Icon } from "react-native-elements";

export default function Vehicle() {
  const [vehicle, setVehicle] = useState(null);
  useEffect(() => {
    const getVehicle = async () => {
      const { data, error } = await supabase.from("vehicle").select();
      console.log(data);
      setVehicle(data[0]);
    };
    getVehicle();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconSection}>
        <Icon styles={styles.icon} name="directions-car" size={150} />
      </View>
      <View style={styles.detailsSection}>
        <DetailProfile icon="directions-car" subtitle={vehicle?.brand} />
        <DetailProfile icon="local-taxi" subtitle={vehicle?.model} />
        <DetailProfile icon="today" subtitle={vehicle?.year} />
        <DetailProfile icon="check-circle" subtitle={vehicle?.licenseplate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B762C1",
    paddingTop: 50
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white",
  },
});
