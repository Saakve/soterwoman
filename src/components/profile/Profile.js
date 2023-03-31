import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Thumbnail from "./Thumbnail";
import DetailProfile from "./DetailProfile";
import { supabase } from "../../services/supabase";

export default function Profile() {
  const [profile, setProfile] = useState(null)
  useEffect(() =>{
      const getUser = async () => {
        const { data, error } = await supabase.from("user").select()
        console.log(data)
        return data
      };
      setProfile(getUser())
  }, [])


  getUser()
  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Thumbnail />
      </View>
      <View style={styles.detailsSection}>
        <DetailProfile icon="mail" title="Email" subtitle={profile} />
        <DetailProfile icon="phone" title="Work" />
        <DetailProfile icon="smartphone" title="Personal" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "purple",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white",
  },
});
