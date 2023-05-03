import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { supabase } from "../services/supabase";
import TripContainer from "./TripContainer";
import { Input, Button } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { fonts } from "@rneui/base";
import UserContext from "../context/UserContext";

export default function Trip() {
  const { userData } = useContext(UserContext);
  const [trip, setTrip] = useState([]);
  const [stat, setStat] = useState([{}])

  useEffect(() => {
    const getTrip = async () => {
      const { data, error } = await supabase
        .from("trip")
        .select()
        .order("done_on", { ascending: false })
        .limit(5);
      setTrip(data);
      console.log(data)
    };
    getTrip();

  
    const getUserStats = async () => {
      const { data, error } = await supabase.rpc("getStats", {userid: userData.id,})
      setStat(data)
      console.log(data)
    }
    getUserStats()
    
  }, []);




  const filterTrips = (range) => {
    const getFilterTrip = async () => {
      const { data, error } = await supabase.rpc(range, { rowstoshow: 15 });
      console.log(data);
      setTrip(data);
      console.log(error)
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
            onPress={() => filterTrips("getTripsToday")}
            color="#FFFFFF"
            titleStyle={{ color: "#000000"}}
          />
          <Button
            title="Semana"
            onPress={() => filterTrips("getTripsThisWeek")}
            color="#FFFFFF"
            titleStyle={{ color: "#000000" }}
          />
          <Button
            title="Mes"
            color="#FFFFFF"
            titleStyle={{ color: "#000000" }}
            onPress={() => filterTrips("getTripsThisMonth")}
          />
          <Button
            title="Año"
            color="#FFFFFF"
            titleStyle={{ color: "#000000" }}
            onPress={() => filterTrips("getTripsThisYear")}
          />
        </View>
      </View>
      <View style={styles.statsSection}>
        <View style={styles.statsButtons}>
          <Button
            title={stat.trip_count + " Viajes"}
            color="#B762C1"
            titleStyle={{ color: "#FFFFFF" }}
          />
          <Button
            title="23 horas en línea"
            color="#B762C1"
            titleStyle={{ color: "#FFFFFF" }}
          />
          <Button
            title={stat.total_cost + " Gastado"}
            color="#B762C1"
            titleStyle={{ color: "#FFFFFF" }}
          />
          <Button
            title={stat.debt + " Debiendo"}
            color="#B762C1"
            titleStyle={{ color: "#FFFFFF" }}
          />
        </View>
      </View>
      <ScrollView bounces={false}>
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
  statsSection: {
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#B762C1",
    padding: 0,
    height: 100,
    zIndex: 1,
  },
  filterButons: {
    flexDirection: "row",
    gap: 40,
    marginLeft: 10,
    marginTop: 20,
  },
  statsButtons: {
    flexDirection: "row",
    maxWidth: "27%",
    margin: "2%",
  },
  tripSection: {
    backgroundColor: "#FFF",
    marginTop: 20,
    zIndex: 2,
  },
});