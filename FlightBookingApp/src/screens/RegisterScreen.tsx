import { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { supabase } from "../lib/supabase";
import i18n from "../i18n";

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setPhone("");
    setEmail("");
    setPassword("");
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !age || !phone || !email || !password) {
      Alert.alert(
        i18n.t("requiredFields"),
        i18n.t("completeAllFields")
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        i18n.t("invalidPassword"),
        i18n.t("passwordMin")
      );
      return;
    }

    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert(
        i18n.t("invalidAge"),
        i18n.t("validAge")
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert(i18n.t("genericError"), error.message);
        return;
      }

      if (!data.user) {
        Alert.alert(i18n.t("genericError"), i18n.t("userCouldNotBeCreated"));
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        age: parsedAge,
        phone,
        email,
      });

      if (profileError) {
        Alert.alert("Error", profileError.message);
        return;
      }

      Alert.alert(
        i18n.t("registrationSuccess"),
        i18n.t("accountCreated"),
        [
          {
            text: "OK",
            onPress: () => {
              clearForm();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        i18n.t("unexpectedError"),
        error?.message || i18n.t("registerCouldNotBeCompleted")
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/plane.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>{i18n.t("registerTitle")}</Text>
        <Text style={styles.subtitle}>{i18n.t("registerSubtitle")}</Text>

        <CustomInput
          placeholder={i18n.t("firstNamePlaceholder")}
          value={firstName}
          onChange={setFirstName}
          typeInput="text"
        />

        <CustomInput
          placeholder={i18n.t("lastNamePlaceholder")}
          value={lastName}
          onChange={setLastName}
          typeInput="text"
        />

        <CustomInput
          placeholder={i18n.t("agePlaceholder")}
          value={age}
          onChange={setAge}
          typeInput="number"
        />

        <CustomInput
          placeholder={i18n.t("phonePlaceholder")}
          value={phone}
          onChange={setPhone}
          typeInput="number"
        />

        <CustomInput
          placeholder={i18n.t("emailPlaceholder")}
          value={email}
          onChange={setEmail}
          typeInput="email"
        />

        <CustomInput
          placeholder={i18n.t("passwordPlaceholder")}
          value={password}
          onChange={setPassword}
          typeInput="password"
        />

        <View style={styles.buttonWrap}>
          <CustomButton
            title={i18n.t("registerButton")}
            onClick={handleRegister}
          />
        </View>

        <View style={styles.buttonWrap}>
          <CustomButton
            title={i18n.t("cancelButton")}
            onClick={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf1fb",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2e4a72",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "#636b78",
  },
  buttonWrap: {
    width: "100%",
    paddingHorizontal: 25,
    marginTop: 8,
  },
});