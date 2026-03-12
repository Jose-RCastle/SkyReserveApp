import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../redux/hooks";

export default function MyReservationsScreen() {
  const reservations = useAppSelector((state) => state.reservations.reservations);

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>

      {reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="airplane-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No tienes reservas aún</Text>
          <Text style={styles.emptySubtext}>¡Busca un vuelo y reserva ahora!</Text>
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
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Salida: {flight.departDate}</Text>
                </View>

                {flight.returnDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>Regreso: {flight.returnDate}</Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {getPassengerText(flight.passengers)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    Reservado: {flight.reservationDate}
                  </Text>
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
    padding: 20,
    backgroundColor: "#e6f0fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e4566",
    marginBottom: 20,
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },
  route: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e4566",
    lineHeight: 24,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e4566",
    minWidth: 70,
    textAlign: "right",
  },
  cardBody: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
});