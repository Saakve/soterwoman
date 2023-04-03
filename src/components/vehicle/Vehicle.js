import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Thumbnail from "../Thumbnail";
import DetailProfile from "../DetailProfile";
import { supabase } from "../../services/supabase";


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
      <View style={styles.avatarSection}>
        <Thumbnail name={vehicle?.model} />
      </View>
      <View style={styles.detailsSection}>
        <DetailProfile icon="directions-car" subtitle={vehicle?.brand} />
        <DetailProfile icon="local-taxi" subtitle={vehicle?.model} />
        <DetailProfile icon="today" subtitle={vehicle?.year} />
        <DetailProfile icon="check-circle" subtitle={vehicle?.licensePlate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "purple",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white",
  },
});
