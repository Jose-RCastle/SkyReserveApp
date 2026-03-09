import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { adults: number; children: number; infants: number }) => void; // Cambiado de babies a infants
  initialValues?: { adults: number; children: number; infants: number }; // Para poder pasar valores iniciales
};

export default function PassengerSelector({ 
  visible, 
  onClose, 
  onConfirm,
  initialValues = { adults: 1, children: 0, infants: 0 } // Valores por defecto
}: Props) {

  const [adults, setAdults] = useState(initialValues.adults);
  const [children, setChildren] = useState(initialValues.children);
  const [infants, setInfants] = useState(initialValues.infants); // Cambiado de babies a infants

  const increase = (setter: any, value: number) => setter(value + 1);
  const decrease = (setter: any, value: number) => {
    if (value > 0) setter(value - 1);
  };

  const handleConfirm = () => {
    onConfirm({ adults, children, infants }); // Cambiado de babies a infants
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>Pasajeros</Text>

          {/* Adultos */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Adultos</Text>
              <Text style={styles.subLabel}>+12 años</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => decrease(setAdults, adults)}
              >
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>

              <Text style={styles.count}>{adults}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => increase(setAdults, adults)}
              >
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Niños */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Niños</Text>
              <Text style={styles.subLabel}>2-11 años</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => decrease(setChildren, children)}
              >
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>

              <Text style={styles.count}>{children}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => increase(setChildren, children)}
              >
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bebés */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Bebés</Text>
              <Text style={styles.subLabel}>menores de 2 años</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => decrease(setInfants, infants)}
              >
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>

              <Text style={styles.count}>{infants}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => increase(setInfants, infants)}
              >
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#2e4566'
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontWeight: '500'
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  controls: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#e6f0fa",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e4566'
  },
  count: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'center'
  },
  confirm: {
    marginTop: 20,
    backgroundColor: "#2e4566",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }
});