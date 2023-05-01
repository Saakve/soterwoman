import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import Thumbnail from "./Avatar";
import { supabase } from "../services/supabase";
import UserContext from "../context/UserContext";
import { Input, Button } from "@rneui/themed";
import { Icon } from "react-native-elements";
import {
  validateCity,
  validateDrivingLicenseAndCity,
  validateEmail,
  validateEmergencyPhone,
  validateName,
  validatePhone,
  validateNewPassword,
} from "../utils/validateInputs";
import { InputStyled } from "./InputStyled.js";
import { FlatList } from "react-native-gesture-handler";

const ChangePassword = ({ onPress, userData }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordValidation, setNewPasswordValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOnPress = async () => {
    setErrorMessage(null);    
      if (newPassword !== newPasswordValidation) {
        setErrorMessage("Contraseñas diferentes");
        return;
      }
      const { data, error } = await supabase.rpc("equalPassword", {
        userid: userData.id,
        passwordtovalidate: password,
      });
      console.log(data, error);
      if (!data) {
        setErrorMessage("Contraseña actual no coincide");
        return;
      }

       try {
         validateNewPassword(newPassword, newPasswordValidation);
       } catch (error) {
         console.log("soy el maldito", error);
         setErrorMessage(error);
         return;
       }

    const { dataNewPassword, errorNewPassword } =
      await supabase.auth.updateUser({ password: newPassword });
    console.log("PASSWORD", dataNewPassword, errorNewPassword);

    onPress();
  };
  return (
    <View>
      <View style={styles.avatarSection}>
        <Thumbnail
          name={userData?.name}
          url={userData?.idImage}
        />
      </View>
      <InputStyled
        name="password"
        secureTextEntry
        label="Contraseña actual"
        onChangeText={(password) => {
          setPassword(password);
        }}
        inputMode="text"
        placeholder="Contraseña actual"
        errorMessage={errorMessage}
      />
      <InputStyled
        name="newpassword"
        secureTextEntry
        label="Nueva contraseña"
        onChangeText={(newPassword) => {
          setNewPassword(newPassword);
        }}
        errorMessage={errorMessage}
        placeholder="Contraseña"
        inputMode="text"
      />
      <InputStyled
        label="Nueva contraseña"
        name="newpasswordvalidation"
        secureTextEntry
        onChangeText={(newPasswordValidation) => {
          setNewPasswordValidation(newPasswordValidation);
        }}
        errorMessage={errorMessage}
        placeholder="Contraseña"
        inputMode="text"
      />
      <Button
        title="Guardar cambios"
        style={styles.button}
        color="#8946A6"
        onPress={handleOnPress}
      />
    </View>
  );
};

export default function ProfileDetails() {
  const { userData } = useContext(UserContext);
  const [save, setSave] = useState(false);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState(userData.email);
  const [name, setName] = useState(userData.name);
  const [phone, setPhone] = useState(userData.phone);
  const [emergencyPhone, setEmergencyPhone] = useState(emergencyPhone);
  const [drivingLicense, setDrivingLicense] = useState(drivingLicense);
  const [city, setCity] = useState(city);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validatedDrivingLicense, setValidatedDrivingLicense] = useState(
    validatedDrivingLicense
  );

  useEffect(() => {
    const userType = userData.idUserType === 1 ? "driver" : "passenger";
    if (userType === "passenger") {
      const getPassenger = async () => {
        const { data, error } = await supabase
          .from("passenger")
          .select("emergencyphone")
          .eq("id", userData.id);
        setEmergencyPhone(data[0].emergencyphone);
      };
      getPassenger();
    } else if (userType === "driver") {
      const getDriver = async () => {
        const { data, error } = await supabase
          .from("driver")
          .select("city, drivinglicense")
          .eq("id", userData.id);
        setDrivingLicense(data[0].drivinglicense);
        setValidatedDrivingLicense(data[0].drivinglicense);
        setCity(data[0].city);
      };
      getDriver();
    }
  }, []);

  const updateData = async () => {
    setErrorMessage(null);
    try {
      validateName(name);

      if (email !== userData.email) {
        await validateEmail(email.trim());
      }
      if (phone !== userData.phone) {
        await validatePhone(phone);
      }

      if (userData.idUserType === 1) {
        drivingLicense !== validatedDrivingLicense
          ? await validateDrivingLicenseAndCity(drivingLicense, city)
          : validateCity(city);
      } else if (userData.idUserType === 2) {
        validateEmergencyPhone(emergencyPhone);
      }
    } catch (error) {
      console.log("soy el maldito", error);
      setErrorMessage(error);
      return;
    }

    console.log("DE TODO", { name, phone });
    const { data, error } = await supabase
      .from("profile")
      .update({ name: name, phone: phone })
      .eq("id", userData.id)
      .select();
    console.log("PROFILE", data, error);
    const { data: dataDriver, error: errorDriver } = await supabase
      .from("driver")
      .update({ drivinglicense: drivingLicense, city: city })
      .eq("id", userData.id)
      .select();
    console.log("CONDUCTOR", dataDriver, errorDriver);
    const { data: dataPassenger, error: errorPassenger } = await supabase
      .from("passenger")
      .update({ emergencyphone: emergencyPhone })
      .eq("id", userData.id)
      .select();
    console.log("PASAJERO", dataPassenger, errorPassenger);

    const { data: dataEmail, error: errorMail } =
      await supabase.auth.updateUser({ email });
    console.log("EMAIL", dataEmail, errorMail);
  };

  return page === 1 ? (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.detailsSection}>
        <View style={styles.avatarSection}>
          <Thumbnail
            name={userData?.name}
            url={userData?.idImage}
            style={styles.avatar}
          />
        </View>

        <InputStyled
          leftIcon={<Icon name="person" size={30} />}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setSave(true);
          }}
          errorMessage={errorMessage}
          name="name"
          placeholder="Nombre"
          inputMode="text"
        />
        <InputStyled
          leftIcon={<Icon name="mail" size={30} />}
          value={email}
          onChangeText={(email) => {
            if (email !== userData.email) {
              setEmail(email);
              setSave(true);
            } else {
              setEmail(userData.email);
              setSave(true);
            }
          }}
          errorMessage={errorMessage}
          name="email"
          placeholder="Correo electrónico"
          inputMode="text"
        />
        <InputStyled
          leftIcon={<Icon name="phone" size={30} />}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setSave(true);
          }}
          errorMessage={errorMessage}
          name="phone"
          placeholder="Telefono"
          inputMode="tel"
        />
        {userData.idUserType === 2 ? (
          <InputStyled
            leftIcon={<Icon name="phone" size={30} />}
            value={emergencyPhone}
            onChangeText={(text) => {
              setEmergencyPhone(text);
              setSave(true);
            }}
            errorMessage={errorMessage}
            name="emergencyPhone"
            placeholder="Teléfono de emergencia"
            inputMode="tel"
          />
        ) : (
          <View>
            <InputStyled
              leftIcon={<Icon name="info" size={30} />}
              value={drivingLicense}
              onChangeText={(text) => {
                setDrivingLicense(text);
                setSave(true);
              }}
              errorMessage={errorMessage}
              name="drivingLicense"
              placeholder="Número de licencia de conducir"
              inputMode="text"
            />
            <InputStyled
              leftIcon={<Icon name="place" size={30} />}
              value={city}
              onChangeText={(text) => {
                setCity(text);
                setSave(true);
              }}
              name="city"
              placeholder="Ciudad"
              inputMode="text"
              errorMessage={errorMessage}
            />
          </View>
        )}
        <InputStyled
          leftIcon={<Icon name="lock" size={30} />}
          title="Contraseña"
          value={userData.name}
          secureTextEntry
          onChangeText={() => {
            setPage(2);
          }}
        />
        {save ? (
          <Button
            style={styles.button}
            //buttonStyle={{marginBottom: 60, marginTop: 20}}
            color="#8946A6"
            title="Guardar cambios"
            onPress={updateData}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: "#B762C1",
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B762C1",
    marginBottom: 20,
    padding: "1%",
    height: "20%"
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "white"
  },
  button: {
    marginTop: 5,
    color: "#8946A6",
    width: 330,
    height: 50,
    alignSelf: "center",
    borderRadius: 10,
  },
  changePassword: {
    marginTop: 500,
  },
});
