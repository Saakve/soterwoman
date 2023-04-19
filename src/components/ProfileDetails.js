import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Thumbnail from "./Thumbnail";
import { supabase } from "../services/supabase";
import UserContext from "../context/UserContext";
import { Input, Button } from "@rneui/themed";
import { Icon } from "react-native-elements";

const ChangePassword = ({ onPress, userData }) => {
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordValidation, setNewPasswordValidation] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)

  const handleOnPress = async () => {
    setErrorMessage(null);
    if (newPassword !== newPasswordValidation) {
      setErrorMessage("Contraseñas diferentes")
      return
    }

    const { data, error } = await supabase.rpc("equalPassword", {
      userid: userData.id,
      passwordtovalidate: password,
    });
    console.log(data, error)
    if (!data) {
      setErrorMessage("Contraseña actual no coincide")
      return
    }
    const { dataNewPassword, errorNewPassword } =
      await supabase.auth.updateUser({ password: newPassword })
    console.log("PASSWORD", dataNewPassword, errorNewPassword)

    onPress()
  };
  return (
    <View>
      <View style={styles.avatarSection}>
        <Thumbnail
          name={userData?.name}
          url={userData?.idImage}
          onUpload={async (url) => {
            const { data, error } = await supabase
              .from("profile")
              .update({ idImage: url })
              .eq("id", userData.id);
            console.log(data);
            console.log(error);
          }}
        />
      </View>
      <Input
        label="Contraseña actual"
        onChangeText={(password) => {
          setPassword(password);
        }}
        errorMessage={errorMessage}
      />
      <Input
        label="Nueva contraseña"
        onChangeText={(newPassword) => {
          setNewPassword(newPassword);
        }}
        errorMessage={errorMessage}
      />
      <Input
        label="Nueva contraseña"
        onChangeText={(newPasswordValidation) => {
          setNewPasswordValidation(newPasswordValidation);
        }}
        errorMessage={errorMessage}
      />
      <Button title="Guardar" onPress={handleOnPress} />
    </View>
  );
}

export default function ProfileDetails() {
  const { userData } = useContext(UserContext);
  const [save, setSave] = useState(false);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState(userData.email);

  const [profile, setProfile] = useState({
    name: userData?.name,
    phone: userData?.phone,
  })

  const [driver, setDriver] = useState({
    drivinglicense: driver?.drivinglicense,
    city: driver?.city,
  })
  const [passenger, setPassenger] = useState({
    emergencyphone: passenger?.emergencyphone,
  })



  useEffect(() => {
    const userType = userData.idUserType === 1 ? "driver" : "passenger";
    if (userType === "passenger") {
      const getPassenger = async () => {
        const { data, error } = await supabase
          .from("passenger")
          .select("emergencyphone")
          .eq("id", userData.id);
        setPassenger(data[0]);
      };
      getPassenger();
    } else if (userType === "driver") {
      const getDriver = async () => {
        const { data, error } = await supabase
          .from("driver")
          .select("city, drivinglicense")
          .eq("id", userData.id);
        setDriver(data[0]);
      };
      getDriver();
    }
  }, []);

  const editProfile = (info, value) => {
    if (userData.idUserType === 1) {
      setDriver({ ...driver, [info]: value });
      table = "driver";
    }
    if (userData.idUserType === 2) {
      setPassenger({ ...passenger, [info]: value });
      table = "passenger";
    }
    setSave(true);
  };

  const updateData = async () => {
    console.log("DE TODO", { ...profile });
    const { data, error } = await supabase
      .from("profile")
      .update({ ...profile })
      .eq("id", userData.id)
      .select();
    console.log("PROFILE", data, error);
    const { data: dataDriver, error: errorDriver } = await supabase
      .from("driver")
      .update({ ...driver })
      .eq("id", userData.id)
      .select();
    console.log("CONDUCTOR", dataDriver, errorDriver);
    const { data: dataPassenger, error: errorPassenger } = await supabase
      .from("passenger")
      .update({ ...passenger })
      .eq("id", userData.id)
      .select();
    console.log("PASAJERO", dataPassenger, errorPassenger);

    const { data: dataEmail, error: errorMail } =
      await supabase.auth.updateUser({ email });
    console.log("EMAEL", dataEmail, errorMail);
  };

  return page === 1 ? (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Thumbnail
          name={userData?.name}
          url={userData?.idImage}
          onUpload={async (url) => {
            const { data, error } = await supabase
              .from("profile")
              .update({ idImage: url })
              .eq("id", profile.id);
            console.log(data);
            console.log(error);
          }}
        />
      </View>
      <View style={styles.detailsSection}>
        <Input
          leftIcon={<Icon name="person" size={30} />}
          value={profile?.name}
          onChangeText={(name) => {
            setProfile({ ...profile, name });
            setSave(true);
          }}
        />
        <Input
          leftIcon={<Icon name="mail" size={30} />}
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <Input
          leftIcon={<Icon name="phone" size={30} />}
          value={profile?.phone}
          onChangeText={(phone) => {
            setProfile({ ...profile, phone });
            setSave(true);
          }}
        />
        {userData.idUserType === 2 ? (
          <Input
            leftIcon={<Icon name="phone" size={30} />}
            value={passenger?.emergencyphone}
            onChangeText={(emergencyphone) =>
              editProfile("emergencyphone", emergencyphone)
            }
          />
        ) : (
          <View>
            <Input
              leftIcon={<Icon name="info" size={30} />}
              value={driver?.drivinglicense}
              onChangeText={(drivinglicense) =>
                editProfile("drivinglicense", drivinglicense)
              }
            />
            <Input
              leftIcon={<Icon name="place" size={30} />}
              value={driver?.city}
              onChangeText={(city) => editProfile("city", city)}
            />
          </View>
        )}
        <Button
          title="Contraseña"
          onPress={() => {
            setPage(2);
          }}
        />
        {save ? <Button title="Save" onPress={updateData} /> : null}
      </View>
    </View>
  ) : (
    <ChangePassword
      style={styles.changePassword}
      onPress={() => {
        setPage(1);
      }}
      userData={userData}
    />
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
    backgroundColor: "#B762C1",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white",
  },
  Button: {
    color: "#FFF",
  },
  changePassword: {
    marginTop: 500,
  },
});
