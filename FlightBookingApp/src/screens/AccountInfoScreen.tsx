import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import i18n from "../i18n";

type ProfileData = {
  first_name: string;
  last_name: string;
  age: number;
  phone: string;
  email: string;
};

export default function AccountInfoScreen() {
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
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(i18n.t("genericError"), i18n.t("userNotFound"));
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, age, phone, email")
        .eq("id", user.id)
        .single();

      if (error) {
        Alert.alert(i18n.t("genericError"), error.message);
        return;
      }

      setProfile(data);
    } catch (error: any) {
      Alert.alert(
        i18n.t("genericError"),
        error?.message || i18n.t("infoCouldNotBeLoaded")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5fb2" />
        <Text style={styles.loadingText}>{i18n.t("loadingInfo")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{i18n.t("accountInfoTitle")}</Text>

      <View style={styles.card}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>{i18n.t("firstName")}</Text>
          <Text style={styles.value}>{profile?.first_name || "-"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>{i18n.t("lastName")}</Text>
          <Text style={styles.value}>{profile?.last_name || "-"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>{i18n.t("email")}</Text>
          <Text style={styles.value}>{profile?.email || "-"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>{i18n.t("age")}</Text>
          <Text style={styles.value}>{profile?.age ?? "-"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>{i18n.t("phone")}</Text>
          <Text style={styles.value}>{profile?.phone || "-"}</Text>
        </View>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  infoBox: {
    backgroundColor: "#f8f9fc",
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 13,
    color: "#7f8796",
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1d2533",
  },
});