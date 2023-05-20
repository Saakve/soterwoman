import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { supabase } from "../services/supabase";
import { makeChannel } from "../services/makeChannel";

import UserContext from "../context/UserContext";
import SignInLikeContext from "../context/SingInLikeContext";

import { ModalRating } from "../components/ModalRating";
import { ModalTip } from '../components/ModalTip'

function HomePassenger({ navigation }) {
  const { userData, dataIsLoaded } = useContext(UserContext);
  const { signInLike } = useContext(SignInLikeContext);
  const [channel, setChannel] = useState(null);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === "passenger") navigation.navigate("CompletePassengerProfile");
      if (signInLike === "driver") navigation.navigate("CompleteDriverProfile");
    }
  }, [dataIsLoaded]);

  useEffect(() => {
    const channel = makeChannel({
      channelName: "trips",
      eventType: "broadcast",
      filter: { event: "accept" },
      callback: (response) => console.log(response),
    });
    setChannel(channel);
    console.log("LISTENING");

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  const sendRequest = async () => {
    await channel.send({
      type: "broadcast",
      event: "request",
      payload: `Hola soy ${userData.name}`,
    });
  };

  return (
    <View style={styles.container}>
      <ModalTip visible={userData.idUserType === 2} driverToSendTip={"acct_1N3CV3FauMmYefG2"} />
      <ModalRating visible={false} userToRate={'afcfc3f6-4854-4976-88e8-57a8480fdd09'} />
      <Text>Bienvenido a mi app</Text>
      <Text>Id:   {userData.id}</Text>
      <Text>Name: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone: {userData.phone}</Text>
      <Button title='Cerrar Sesión' onPress={() => signOut()} />
      <Button title='Solicitar viajes' onPress={sendRequest} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { HomePassenger };
