import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { userEmail, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={120} color="#2e4566" />
      </View>

      <Text style={styles.emailLabel}>Información de la Cuenta</Text>
      <Text style={styles.email}>{userEmail || "Correo no disponible"}</Text>

      <View style={styles.separator} />

      <View style={styles.buttonContainer}>
  <CustomButton
    title="Cerrar sesión"
    onClick={handleLogout}
    variant="secondary"
  />
</View>

      <Text style={styles.version}>Versión 1.2.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: "center",
  backgroundColor: "#e6f0fa",
  paddingTop: 40,
  paddingHorizontal: 20,
},
  avatarContainer: {
  marginTop: 10,
  alignItems: "center",
},
  emailLabel: {
  fontSize: 16,
  color: "#7a7a7a",
  marginTop: 15,
},

email: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#2e4566",
  marginTop: 5,
  textAlign: "center",
},
  separator: {
  width: "80%",
  borderBottomWidth: 1,
  borderBottomColor: "#d9d9d9",
  marginVertical: 20,
},
buttonContainer: {
  marginTop: 20,
  width: "100%",
  alignItems: "center"
},
  version: {
  fontSize: 13,
  color: "#9a9a9a",
  marginTop: 290
  },
});