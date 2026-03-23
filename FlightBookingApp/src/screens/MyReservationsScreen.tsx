import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function MyReservationsScreen() {
  const reservations = useAppSelector((state) => state.reservations.reservations);

  useEffect(() => {
  loadReservations()
}, [])

console.log("Reservas actuales en Redux:", reservations);
const loadReservations = async () => {

  const { data } = await supabase
    .from("reservations")
    .select("*")

  console.log("Reservas DB:", data)
}
  const getPassengerText = (passengers: any) => {
    const { adults, children, infants } = passengers;
    const total = adults + children + infants;

    const details = [];
    if (adults > 0) details.push(`${adults} adulto${adults > 1 ? "s" : ""}`);
    if (children > 0) details.push(`${children} niño${children > 1 ? "s" : ""}`);
    if (infants > 0) details.push(`${infants} bebé${infants > 1 ? "s" : ""}`);

    return `${total} pasajero${total > 1 ? "s" : ""} (${details.join(", ")})`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Reservas</Text>

      {reservations.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="airplane-outline" size={36} color="#2d5fb2" />
          </View>
          <Text style={styles.emptyTitle}>¡El mundo te está esperando!</Text>
          <Text style={styles.emptyText}>
            Agrega un viaje. Aquí podrás ver la información de los vuelos que hayas reservado.
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
                  <Text style={styles.detailText}>Salida: {flight.departDate}</Text>
                </View>

                {flight.returnDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#7f8796" />
                    <Text style={styles.detailText}>Regreso: {flight.returnDate}</Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="#7f8796" />
                  <Text style={styles.detailText}>{getPassengerText(flight.passengers)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#7f8796" />
                  <Text style={styles.detailText}>Reservado: {flight.reservationDate}</Text>
                </View>
              </View>
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
});
