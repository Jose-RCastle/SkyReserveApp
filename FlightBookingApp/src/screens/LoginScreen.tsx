import { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
const handleLogin = () => {

    if (!email || !password) {
      Alert.alert("Campos obligatorios", "Por favor complete todos los campos.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña inválida", "Debe tener al menos 6 caracteres.");
      return;
    }

    // Simulación de login exitoso
    navigation.replace("Tabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        
        <Image 
          source={require("../../assets/plane.png")} 
          style={styles.logo}
          resizeMode="contain"
          
        />

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

        <CustomButton
          title="Iniciar Sesión"
          onClick={handleLogin}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0fa",
  },
  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e4566",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },
});