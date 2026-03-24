import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Reservation, setReservations } from "../redux/slices/reservationSlice";
import i18n from "../i18n";

type ReservationRow = {
  id: string;
  user_email: string;
  origin: string;
  destination: string;
  destination_name: string;
  depart_date: string;
  return_date: string | null;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  reservation_date: string;
};

export default function MyReservationsScreen() {
  const dispatch = useAppDispatch();

  const reservations = useAppSelector(
    (state) => state.reservations.reservations
  );
  const userEmail = useAppSelector((state) => state.auth.userEmail);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [userEmail]);

  const loadReservations = async () => {
    try {
      if (!userEmail) {
        dispatch(setReservations([]));
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });

      if (error) {
        Alert.alert(i18n.t("unexpectedError"), error.message);
        return;
      }

      const mappedReservations: Reservation[] = (data as ReservationRow[]).map(
        (item) => ({
          id: item.id,
          origin: item.origin,
          destination: item.destination,
          destinationName: item.destination_name,
          departDate: item.depart_date,
          returnDate: item.return_date ?? undefined,
          passengers: {
            adults: item.adults,
            children: item.children,
            infants: item.infants,
          },
          totalPrice: Number(item.total_price),
          reservationDate: item.reservation_date,
        })
      );

      dispatch(setReservations(mappedReservations));
    } catch (error: any) {
      Alert.alert(
        i18n.t("unexpectedError"),
        error?.message || i18n.t("loadingReservations")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert(
      i18n.t("cancelReservationTitle"),
      i18n.t("cancelReservationMessage"),
      [
        {
          text: i18n.t("no"),
          style: "cancel",
        },
        {
          text: i18n.t("yesCancel"),
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("reservations")
                .delete()
                .eq("id", reservationId);

              if (error) {
                Alert.alert(i18n.t("unexpectedError"), error.message);
                return;
              }

              Alert.alert(
                i18n.t("success"),
                i18n.t("reservationCancelled")
              );

              loadReservations();
            } catch (error: any) {
              Alert.alert(
                i18n.t("unexpectedError"),
                error?.message || ""
              );
            }
          },
        },
      ]
    );
  };

  const getPassengerText = (passengers: {
    adults: number;
    children: number;
    infants: number;
  }) => {
    const { adults, children, infants } = passengers;
    const total = adults + children + infants;

    const details = [];
    if (adults > 0) details.push(`${adults} adulto${adults > 1 ? "s" : ""}`);
    if (children > 0) details.push(`${children} niño${children > 1 ? "s" : ""}`);
    if (infants > 0) details.push(`${infants} bebé${infants > 1 ? "s" : ""}`);

    return `${total} pasajero${total > 1 ? "s" : ""} (${details.join(", ")})`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5fb2" />
        <Text style={styles.loadingText}>
          {i18n.t("loadingReservations")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>
        {i18n.t("reservationsTitle")}
      </Text>

      {reservations.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="airplane-outline" size={36} color="#2d5fb2" />
          </View>
          <Text style={styles.emptyTitle}>
            {i18n.t("emptyReservationsTitle")}
          </Text>
          <Text style={styles.emptyText}>
            {i18n.t("emptyReservationsText")}
          </Text>
        </View>
      ) : (
        reservations.map((flight) => {
          const originName = flight.origin.split(" (")[0];

          return (
            <View key={flight.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.route}>
                  {originName} ✈ {flight.destinationName}
                </Text>
                <Text style={styles.price}>${flight.totalPrice}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#7f8796" />
                  <Text style={styles.detailText}>
                    {i18n.t("departure")}: {flight.departDate}
                  </Text>
                </View>

                {flight.returnDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#7f8796" />
                    <Text style={styles.detailText}>
                      {i18n.t("return")}: {flight.returnDate}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="#7f8796" />
                  <Text style={styles.detailText}>
                    {getPassengerText(flight.passengers)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#7f8796" />
                  <Text style={styles.detailText}>
                    {i18n.t("reserved")}: {flight.reservationDate}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelReservation(flight.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#d11a2a" />
                <Text style={styles.cancelButtonText}>
                  {i18n.t("cancelReservation")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  content: {
    padding: 20,
    paddingTop: 26,
    paddingBottom: 40,
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
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eef4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    lineHeight: 32,
  },
  emptyText: {
    fontSize: 17,
    color: "#636b78",
    lineHeight: 26,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eff1f5",
    gap: 10,
  },
  route: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#1d2533",
    lineHeight: 28,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ec0b7b",
    minWidth: 80,
    textAlign: "right",
  },
  cardBody: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: "#636b78",
    lineHeight: 22,
  },
  cancelButton: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eff1f5",
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d11a2a",
  },
});