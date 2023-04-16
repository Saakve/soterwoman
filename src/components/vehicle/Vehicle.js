import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { supabase } from "../../services/supabase";
import { Icon } from "react-native-elements";
import UserContext from "../../context/UserContext";
import { Input } from "@rneui/themed";

export default function Vehicle() {
  const userData = useContext(UserContext)
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const getVehicle = async () => {
      const { data, error } = await supabase.rpc("getVehicleFromIdDriver", {
        iddriver: userData.id,
      });
      console.log("Soy el vehiculo", data, error)
      setVehicle(data[0])
    };
    getVehicle();
    console.log(vehicle?.year)
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconSection}>
        <Icon name="directions-car" size={150} />
      </View>
      <View style={styles.detailsSection}>
        <Input
          leftIcon={<Icon name="directions-car" size={30} />}
          value={vehicle?.brand}
          disabled={true}
        />
        <Input
          leftIcon={<Icon name="local-taxi" size={30} />}
          value={vehicle?.model}
          disabled={true}
        />
        <Input
          leftIcon={<Icon name="today" size={30} />}
          value={vehicle?.year ? `${vehicle?.year}` : ""}
          disabled={true}
        />
        <Input
          leftIcon={<Icon name="check" size={30} />}
          value={vehicle?.licenseplate}
          disabled={true}
        />
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
