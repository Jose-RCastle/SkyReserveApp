import { View, Text, StyleSheet, ScrollView } from "react-native";
import FlightCard from "../components/FlightCard";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {

  const navigation: any = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vuelos disponibles</Text>

      <FlightCard
        origin="San Pedro Sula"
        destination="Miami"
        price="$320"
        onPress={() => navigation.navigate("FlightDetail", {
          origin: "San Pedro Sula",
          destination: "Miami",
          price: "$320"
        })}
      />

      <FlightCard
        origin="San Pedro Sula"
        destination="Madrid"
        price="$850"
        onPress={() => navigation.navigate("FlightDetail", {
          origin: "San Pedro Sula",
          destination: "Madrid",
          price: "$850"
        })}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 20,
    color: "#2e4566",
  },
});