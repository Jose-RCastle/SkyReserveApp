import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { supabase } from "../lib/supabase"

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.auth.userEmail);

  const handleLogout = async () => {
  await supabase.auth.signOut()
  dispatch(logout())
  navigation.replace("Login")
}

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Cuenta</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={40} color="#ffffff" />
        </View>
        <Text style={styles.email}>{userEmail || "Correo no disponible"}</Text>
      </View>

      <View style={styles.logoutCard}>
        <View style={styles.logoutHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="log-out-outline" size={22} color="#6b7380" />
          </View>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </View>
        <CustomButton
          title="Salir"
          onClick={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#d7dff0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  email: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2a3140",
    textAlign: "center",
  },
  logoutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#f3f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d2533",
  },
  logoutButton: {
    borderRadius: 16,
  },
  logoutButtonText: {
    fontWeight: "700",
  },
});
