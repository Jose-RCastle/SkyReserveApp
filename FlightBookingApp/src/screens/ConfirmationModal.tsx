import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
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
    passengers: {  // ← Cambiado de passengerCounts a passengers
      adults: number;
      children: number;
      infants: number;  // ← Cambiado de babies a infants
    };
    totalPrice: number;
  };
};

export default function ConfirmationModal({ visible, onClose, onConfirm, flightDetails }: Props) {
  const calculatePassengerCount = () => {
  const { adults, children, infants } = flightDetails.passengers;
  const total = adults + children + infants;
  
  let text = `${total} ${total === 1 ? 'pasajero' : 'pasajeros'}`;
  const details = [];
  if (adults > 0) details.push(`${adults} adulto${adults > 1 ? 's' : ''}`);
  if (children > 0) details.push(`${children} niño${children > 1 ? 's' : ''}`);
  if (infants > 0) details.push(`${infants} bebé${infants > 1 ? 's' : ''}`);
  
  return `${text}\n(${details.join(', ')})`;
};

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Resumen de tu vuelo</Text>
          
          <View style={styles.routeContainer}>
            <Text style={styles.route}>
              {flightDetails.origin} ✈ {flightDetails.destinationName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salida:</Text>
            <Text style={styles.detailValue}>{flightDetails.departDate}</Text>
          </View>

          {flightDetails.returnDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Regreso:</Text>
              <Text style={styles.detailValue}>{flightDetails.returnDate}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pasajeros:</Text>
            <Text style={styles.detailValue}>{calculatePassengerCount()}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio total:</Text>
            <Text style={styles.priceValue}>${flightDetails.totalPrice}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Reservar vuelo"
              onClick={onConfirm}
              variant="primary"
            />
            
            <CustomButton
              title="Cancelar"
              onClick={onClose}
              variant="secondary"
              
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e4566',
    marginBottom: 20,
    textAlign: 'center',
  },
  routeContainer: {
    backgroundColor: '#e6f0fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  route: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e4566',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e4566',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e4566',
  },
  buttonContainer: {
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});