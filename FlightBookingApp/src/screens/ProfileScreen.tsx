import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { setLanguage, Language } from "../redux/slices/languageSlice";
import { supabase } from "../lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";
import { setI18nLanguage } from "../i18n";
import {
  getHistoryArray,
  getLastAction,
  HistoryAction,
  undoLastAction,
} from "../services/historyService";

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
  const [historyVisible, setHistoryVisible] = useState(false);
  const [recentActions, setRecentActions] = useState<HistoryAction[]>([]);
  const [lastAction, setLastAction] = useState<HistoryAction | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const refreshHistory = useCallback(() => {
    setRecentActions(getHistoryArray());
    setLastAction(getLastAction());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshHistory();
    }, [refreshHistory])
  );

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

  const handleViewHistory = () => {
    refreshHistory();
    setHistoryVisible(true);
  };

  const handleRemoveLastAction = () => {
    const removedAction = undoLastAction();

    if (!removedAction) {
      Alert.alert("Historial reciente", "Aún no hay acciones recientes.");
      return;
    }

    refreshHistory();
  };

  const formatHistoryDate = (value: string) => {
    return new Date(value).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="time-outline" size={22} color="#6b7380" />
          </View>
          <View style={styles.historyHeaderText}>
            <Text style={styles.historyTitle}>Historial reciente</Text>
            <Text style={styles.historySubtitle}>
              {lastAction ? lastAction.title : "Aún no hay acciones recientes."}
            </Text>
          </View>
        </View>

        {lastAction ? (
          <View style={styles.lastActionBox}>
            <Text style={styles.lastActionDescription}>{lastAction.description}</Text>
            <Text style={styles.lastActionDate}>
              {formatHistoryDate(lastAction.createdAt)}
            </Text>
          </View>
        ) : null}

        <View style={styles.historyButtons}>
          <TouchableOpacity style={styles.historyPrimaryButton} onPress={handleViewHistory}>
            <Text style={styles.historyPrimaryButtonText}>Ver historial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.historySecondaryButton}
            onPress={handleRemoveLastAction}
          >
            <Text style={styles.historySecondaryButtonText}>Eliminar última acción</Text>
          </TouchableOpacity>
        </View>
      </View>

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
      </ScrollView>

      <Modal
        visible={historyVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHistoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historial reciente</Text>
              <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7380" />
              </TouchableOpacity>
            </View>

            {recentActions.length === 0 ? (
              <View style={styles.historyEmptyBox}>
                <Text style={styles.historyEmptyText}>
                  Aún no hay acciones recientes.
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {recentActions.map((action) => (
                  <View key={action.id} style={styles.historyItem}>
                    <Text style={styles.historyItemTitle}>{action.title}</Text>
                    <Text style={styles.historyItemDescription}>
                      {action.description}
                    </Text>
                    <Text style={styles.historyItemDate}>
                      {formatHistoryDate(action.createdAt)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
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
  historyCard: {
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
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  historyHeaderText: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d2533",
  },
  historySubtitle: {
    marginTop: 3,
    fontSize: 14,
    color: "#636b78",
    fontWeight: "600",
  },
  lastActionBox: {
    backgroundColor: "#f8fbff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8f1ff",
    marginBottom: 12,
  },
  lastActionDescription: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d2533",
  },
  lastActionDate: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#7b8494",
  },
  historyButtons: {
    gap: 10,
  },
  historyPrimaryButton: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#1f6ed4",
    alignItems: "center",
    justifyContent: "center",
  },
  historyPrimaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  historySecondaryButton: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#fff0f7",
    alignItems: "center",
    justifyContent: "center",
  },
  historySecondaryButtonText: {
    color: "#c40868",
    fontSize: 15,
    fontWeight: "800",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "78%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  historyEmptyBox: {
    backgroundColor: "#f8fbff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e8f1ff",
  },
  historyEmptyText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#636b78",
  },
  historyList: {
    maxHeight: 420,
  },
  historyItem: {
    backgroundColor: "#f8fbff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8f1ff",
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1d2533",
  },
  historyItemDescription: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
    lineHeight: 20,
  },
  historyItemDate: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#7b8494",
  },
});