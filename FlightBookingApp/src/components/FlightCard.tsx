import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  origin: string;
  destination: string;
  price: string;
  onPress: () => void;
};


export default function FlightCard({ origin, destination, price, onPress }: Props) {
  return (

    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.route}>
        {origin} ✈ {destination}
      </Text>

      <Text style={styles.price}>{price}</Text>

      <Text style={styles.button}>Ver detalles</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    elevation: 4,
  },
  route: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e4566",
  },
  price: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    color: "#2e4566",
    fontWeight: "bold",
  },
});