import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAppDispatch } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";
import { supabase } from "../lib/supabase";
import i18n from "../i18n";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        i18n.t("requiredFields"),
        i18n.t("completeAllFields")
      );
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(i18n.t("authError"), error.message);
      return;
    }

    if (!data.user) {
      Alert.alert(i18n.t("authError"), i18n.t("loginFailed"));
      return;
    }

    dispatch(login(data.user.email || email));
    navigation.replace("Tabs");

    console.log("Usuario guardado en Redux:", email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/plane.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>{i18n.t("loginTitle")}</Text>
        <Text style={styles.subtitle}>{i18n.t("loginSubtitle")}</Text>

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
          <CustomButton title={i18n.t("loginButton")} onClick={handleLogin} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            {i18n.t("noAccount")}{" "}
            <Text style={styles.registerLink}>{i18n.t("createAccount")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf1fb",
    paddingHorizontal: 20,
  },
  card: {
    width: "88%",
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
    width: 118,
    height: 118,
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
    marginTop: 6,
  },
  registerText: {
    marginTop: 18,
    fontSize: 14,
    color: "#636b78",
  },
  registerLink: {
    color: "#ec0b7b",
    fontWeight: "700",
  },
});