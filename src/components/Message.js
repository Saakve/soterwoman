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
import Thumbnail from "./Thumbnail";

export default function Message() {
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState(["INICIAL"]);
  const [message, setMessage ] = useState("")
  const { userData } = useContext(UserContext);

    useEffect(() => {
      const channel = makeChannel({
        channelName: "messages",
        eventType: "broadcast",
        filter: { event: userData.id },
        callback: (response) =>
          setMessages((latestMessages) => [
            ...latestMessages,
            response.payload,
          ])
      })

      setChannel(channel);
      console.log("LISTENING");

      return () => supabase.removeChannel(channel);
    }, [supabase]);

    const sendMessage = async () => {
      await channel.send({
        type: "broadcast",
        event: userData.id, //id del usuario 
        payload: message,
      });
      console.log(message)
    };

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Thumbnail
          name={userData?.name}
          url={userData?.idImage}
        />
      </View>
      <View style={styles.header}>
      </View>
      <FlatList
        style={styles.messageList}
        data={messages}
        keyExtractor={(item) => item.id}
      />
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
    backgroundColor: "#fff",
  },
  avatarSection: {
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B762C1",
  },
  header: {
    backgroundColor: "#B762C1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "space-between",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  message: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#B762C1",
    paddingVertical: 10,
    paddingHorizontal: 30,
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

