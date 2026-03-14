import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  flightType: "roundtrip" | "oneway";
  onSelect: (type: "roundtrip" | "oneway") => void;
};

export const FlightTypeSelector = ({ flightType, onSelect }: Props) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, flightType === "roundtrip" && styles.active]}
      onPress={() => onSelect("roundtrip")}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, flightType === "roundtrip" && styles.textActive]}>
        Ida y vuelta
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, flightType === "oneway" && styles.active]}
      onPress={() => onSelect("oneway")}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, flightType === "oneway" && styles.textActive]}>
        Vuelo de ida
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f1f1f5",
    borderRadius: 18,
    marginBottom: 18,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 15,
  },
  active: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#747b88",
    fontWeight: "600",
  },
  textActive: {
    color: "#1b2330",
  },
});
