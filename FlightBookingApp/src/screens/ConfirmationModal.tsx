import { View, Text, StyleSheet, Modal } from "react-native";
import CustomButton from "../components/CustomButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flightDetails: {
    origin: string;
    destination: string;
    destinationName: string;
    departDate: string;
    returnDate?: string;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
    totalPrice: number;
  };
};

export default function ConfirmationModal({ visible, onClose, onConfirm, flightDetails }: Props) {
  const calculatePassengerCount = () => {
    const { adults, children, infants } = flightDetails.passengers;
    const total = adults + children + infants;

    const details = [];
    if (adults > 0) details.push(`${adults} adulto${adults > 1 ? "s" : ""}`);
    if (children > 0) details.push(`${children} niño${children > 1 ? "s" : ""}`);
    if (infants > 0) details.push(`${infants} bebé${infants > 1 ? "s" : ""}`);

    return `${total} pasajero${total > 1 ? "s" : ""} (${details.join(", ")})`;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Resumen de tu vuelo</Text>

          <View style={styles.routeContainer}>
            <Text style={styles.route}>{flightDetails.origin}</Text>
            <Text style={styles.arrow}>✈</Text>
            <Text style={styles.route}>{flightDetails.destinationName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salida</Text>
            <Text style={styles.detailValue}>{flightDetails.departDate}</Text>
          </View>

          {flightDetails.returnDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Regreso</Text>
              <Text style={styles.detailValue}>{flightDetails.returnDate}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pasajeros</Text>
            <Text style={styles.detailValue}>{calculatePassengerCount()}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>${flightDetails.totalPrice}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton title="Reservar vuelo" onClick={onConfirm} variant="primary" />
            <CustomButton title="Cancelar" onClick={onClose} variant="secondary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 24,
    width: "100%",
    maxWidth: 420,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2430",
    marginBottom: 20,
    textAlign: "center",
  },
  routeContainer: {
    backgroundColor: "#eef4ff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: "center",
    gap: 6,
  },
  route: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d5fb2",
    textAlign: "center",
  },
  arrow: {
    fontSize: 20,
    color: "#ec0b7b",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#818896",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2430",
    textAlign: "right",
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eceff3",
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2430",
  },
  priceValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ec0b7b",
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
  },
});
