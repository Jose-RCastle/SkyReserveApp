import { View, Text, StyleSheet } from "react-native";

export default function MyReservationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>
      <Text>Aquí aparecerán vuelos reservados.</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e4566",
    marginBottom: 10,
  },
});