import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Thumbnail from "../Thumbnail";
import DetailProfile from "../DetailProfile";
import { supabase } from "../../services/supabase";

export default function Profile() {
  const [profile, setProfile] = useState(null)
  useEffect(() =>{
      const getProfile = async () => {
        const { data, error } = await supabase.from('profile').select()
        const {
          data: { user },
        } = await supabase.auth.getUser();
       // console.log(data[0])
       // console.log(user);
        const datos = {
          correo: user.email,
          id: user.id,
          datos: data[0]
        }
        console.log(datos.avatar_url)
        setProfile(datos)
      };
      getProfile();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Thumbnail
          name={profile?.datos.name}
          url={profile?.datos.idImage}
          onUpload={async (url) => {
           const {data, error} =  await supabase.from("profile").update({idImage:url}).eq('id', profile.id )
           console.log(data)
           console.log(error)
          }}
        />
      </View>
      <View style={styles.detailsSection}>
        <DetailProfile icon="person" subtitle={profile?.datos.name} />
        <DetailProfile icon="mail" subtitle={profile?.correo} />
        <DetailProfile icon="phone" subtitle={profile?.datos.phone} />
        <DetailProfile icon="smartphone" title="Número de emergencia" />
        <DetailProfile icon="lock" title="Contraseña" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "purple",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white",
  },
});
