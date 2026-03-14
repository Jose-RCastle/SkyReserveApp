import { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAppDispatch } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos obligatorios", "Por favor complete todos los campos.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Correo inválido", "Ingrese un correo electrónico válido.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña inválida", "Debe tener al menos 6 caracteres.");
      return;
    }

    dispatch(login(email));
    navigation.replace("Tabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../../assets/plane.png")} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>SkyReserve</Text>
        <Text style={styles.subtitle}>Sistema de Reservación de Vuelos</Text>

        <CustomInput
          placeholder="Ingrese su correo"
          value={email}
          onChange={setEmail}
          typeInput="email"
        />

        <CustomInput
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={setPassword}
          typeInput="password"
        />

        <View style={styles.buttonWrap}>
          <CustomButton title="Iniciar Sesión" onClick={handleLogin} />
        </View>
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
});
