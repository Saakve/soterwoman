import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Icon } from "react-native-elements";
import { makeChannel } from "../services/makeChannel";
import UserContext from "../context/UserContext";
import { supabase } from "../services/supabase";
import { Input, Button } from "@rneui/themed";
import Thumbnail from "./Avatar";

export default function Message() {
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([{ message: "Inicial", from: 1 }]);
  const [message, setMessage] = useState("");
  const { userData } = useContext(UserContext);
  const userType =
    userData.idUserType !== 1
      ? "d3089cf9-5e52-4347-b094-70d4c6545677"
      : "afcfc3f6-4854-4976-88e8-57a8480fdd09";

  useEffect(() => {
    const channel = makeChannel({
      channelName: "messages",
      eventType: "broadcast",
      filter: { event: userData.id },
      callback: (response) => {
        setMessages((latestMessages) => [
          ...latestMessages,
          { message: response.payload.message, from: response.payload.from }
        ])
      } 
    });

    setChannel(channel);
    console.log("LISTENING");

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  console.log("SI SOY YO", messages);

  const sendMessage = async () => {
    setMessages((latestMessages) => [
      ...latestMessages,
      { message, from: userData.idUserType },
    ]);
    await channel.send({
      type: "broadcast",
      event: userType,
      payload: { message, from: userData.idUserType },
    });
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Thumbnail name={userData?.name} 
        url={userData?.idImage} />
      </View>
      <View style={styles.messageContainer}>
        <FlatList
          data={messages}
          style={styles.messages}
          renderItem={({ item }) =>
            item.from !== userData.idUserType ? (
              <View style={styles.messageDestinSection}>
                <Button
                  style={styles.messageDestin}
                  title={item.message}
                  color="#EFEFF4"
                  titleStyle={styles.contentMessageDestin}
                />
              </View>
            ) : (
              <View style={styles.messageOriginSection}>
                <Button
                  style={styles.messageOrigin}
                  title={item.message}
                  color="#EA99D5"
                  titleStyle={styles.contentMessageOrigin}
                />
              </View>
            )
          }
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#9b9b9b"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Icon name="send" size={15} color="#0084ff" onPress={sendMessage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B762C1",
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10%",
    paddingHorizontal: "15%",
    height: "15%",
  },
  messageContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  messageDestinSection: {
    alignItems: "flex-start",
    width: "100%",
  },
  messageOriginSection: {
    alignItems: "flex-end",
    width: "100%",
  },
  messageOrigin: {
    padding: 5,
    backgroundColor: "#EA99D5",
    color: "#FFFFFF",
    maxWidth: "50%",
    marginTop: 20,
    marginRight: "3%",
    borderRadius: 12,
  },
  contentMessageOrigin: {
    textAlign: "left",
    fontSize: 17,
  },
  messageDestin: {
    padding: 10,
    backgroundColor: "#EFEFF4",
    marginTop: 20,
    marginLeft: "3%",
    maxWidth: "50%",
    textAlign: "left",
    borderRadius: 12,
  },
  contentMessageDestin: {
    textAlign: "left",
    fontSize: 17,
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#B762C1",
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B762C1",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 5,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 20,
    paddingVertical: 10,
  },
});
