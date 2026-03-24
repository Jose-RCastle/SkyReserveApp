import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { setLanguage, Language } from "../redux/slices/languageSlice";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";
import { setI18nLanguage } from "../i18n";

type ProfileData = {
  first_name: string;
  last_name: string;
  age: number;
  phone: string;
  email: string;
};

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        Alert.alert("Error", userError.message);
        return;
      }

      if (!user) {
        Alert.alert("Error", "No se encontró el usuario autenticado.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, age, phone, email")
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      setProfile(data);
    } catch (error: any) {
      Alert.alert(
        "Error inesperado",
        error?.message || "No se pudo cargar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLanguage = async (language: Language) => {
  try {
    await AsyncStorage.setItem("app_language", language);
    setI18nLanguage(language);
    dispatch(setLanguage(language));
  } catch {
    Alert.alert("Error", "No se pudo cambiar el idioma.");
  }
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5fb2" />
        <Text style={styles.loadingText}>{i18n.t("loadingProfile")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{i18n.t("accountTitle")}</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={40} color="#ffffff" />
        </View>

        <Text style={styles.name}>
          {profile ? `${profile.first_name} ${profile.last_name}` : "Usuario"}
        </Text>

        <Text style={styles.email}>
          {profile?.email || i18n.t("unavailableEmail")}
        </Text>
      </View>

      <View style={styles.languageCard}>
        <View style={styles.logoutHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="language-outline" size={22} color="#6b7380" />
          </View>
          <Text style={styles.logoutText}>{i18n.t("languageTitle")}</Text>
        </View>

        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              currentLanguage === "es" && styles.languageOptionActive,
            ]}
            onPress={() => handleChangeLanguage("es")}
          >
            <Text
              style={[
                styles.languageOptionText,
                currentLanguage === "es" && styles.languageOptionTextActive,
              ]}
            >
              ES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageOption,
              currentLanguage === "en" && styles.languageOptionActive,
            ]}
            onPress={() => handleChangeLanguage("en")}
          >
            <Text
              style={[
                styles.languageOptionText,
                currentLanguage === "en" && styles.languageOptionTextActive,
              ]}
            >
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => navigation.navigate("AccountInfo")}
      >
        <View style={styles.optionHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="person-circle-outline" size={22} color="#6b7380" />
          </View>
          <Text style={styles.optionText}>{i18n.t("accountInfo")}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9aa3b2" />
      </TouchableOpacity>

      <View style={styles.logoutCard}>
        <View style={styles.logoutHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="log-out-outline" size={22} color="#6b7380" />
          </View>
          <Text style={styles.logoutText}>{i18n.t("logoutTitle")}</Text>
        </View>

        <CustomButton
          title={i18n.t("logoutButton")}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f7fb",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#636b78",
  },
  screenTitle: {
    marginTop: 25,
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
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2a3140",
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6b7380",
    textAlign: "center",
    marginTop: 6,
  },
  languageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  languageButtons: {
    flexDirection: "row",
    gap: 10,
  },
  languageOption: {
    flex: 1,
    backgroundColor: "#f3f5f9",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  languageOptionActive: {
    backgroundColor: "#dfe9ff",
  },
  languageOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4b5563",
  },
  languageOptionTextActive: {
    color: "#2d5fb2",
  },
  optionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2533",
    flexShrink: 1,
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