import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { supabase } from "../services/supabase";
import TripContainer from "./TripContainer";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default function Trip() {
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    const getTrip = async () => {
      const { data, error } = await supabase
        .from("trip")
        .select()
        .order("done_on", { ascending: false })
        .limit(5);
      setTrip(data);
    };
    getTrip();
  }, []);

  const filterTrips = (range) => {
    const getFilterTrip = async () => {
      const { data, error } = await supabase.rpc(range, { rowstoshow: 15 });
      console.log(data);
      setTrip(data);
    };
    getFilterTrip();
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={[styles.title]}>Mis viajes</Text>
        <View style={styles.filterButons}>
          <Button
            title="Hoy"
            color="#841584"
            onPress={() => filterTrips("getTripsToday")}
          />
          <Button
            title="Semana"
            color="#841584"
            onPress={() => filterTrips("getTripsThisWeek")}
          />
          <Button
            title="Mes"
            color="#841584"
            onPress={() => filterTrips("getTripsThisMonth")}
          />
          <Button
            title="Año"
            color="#841584"
            onPress={() => filterTrips("getTripsThisYear")}
          />
        </View>
      </View>
      <View style={styles.details}>
        <Text></Text>
      </View>
      <ScrollView bounces={false} >
        <View style={styles.tripSection}>
          {trip.map((trips, index) => {
            return (
              <TripContainer
                key={trips.id}
                startingPoint={trips.startingpoint}
                endPoint={trips.endpoint}
                cost={trips.cost}
                status={trips.idstatus}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 45,
    color: "#FFF",
    marginTop: 100,
    marginLeft: 10,
  },
  filterSection: {
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#B762C1",
    padding: 0,
    height: 230,
  },
  filterButons: {
    flexDirection: "row",
    gap: 40,
    marginLeft: 10,
    marginTop: 20,
  },
  tripSection: {
    backgroundColor: "#FFF",
    marginTop: 0
  },
});