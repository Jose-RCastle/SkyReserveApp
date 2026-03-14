import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { adults: number; children: number; infants: number }) => void;
  initialValues?: { adults: number; children: number; infants: number };
};

export default function PassengerSelector({
  visible,
  onClose,
  onConfirm,
  initialValues = { adults: 1, children: 0, infants: 0 },
}: Props) {
  const [adults, setAdults] = useState(initialValues.adults);
  const [children, setChildren] = useState(initialValues.children);
  const [infants, setInfants] = useState(initialValues.infants);

  useEffect(() => {
    if (visible) {
      setAdults(initialValues.adults);
      setChildren(initialValues.children);
      setInfants(initialValues.infants);
    }
  }, [visible, initialValues]);

  const increase = (setter: (value: number) => void, value: number) => setter(value + 1);
  const decrease = (setter: (value: number) => void, value: number) => {
    if (value > 0) setter(value - 1);
  };

  const handleConfirm = () => {
    onConfirm({ adults, children, infants });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />
          <Text style={styles.title}>Pasajeros</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Adultos</Text>
              <Text style={styles.subLabel}>+12 años</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.button} onPress={() => decrease(setAdults, adults)}>
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>
              <Text style={styles.count}>{adults}</Text>
              <TouchableOpacity style={styles.button} onPress={() => increase(setAdults, adults)}>
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Niños</Text>
              <Text style={styles.subLabel}>2-11 años</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.button} onPress={() => decrease(setChildren, children)}>
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>
              <Text style={styles.count}>{children}</Text>
              <TouchableOpacity style={styles.button} onPress={() => increase(setChildren, children)}>
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Bebés</Text>
              <Text style={styles.subLabel}>Menores de 2 años</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.button} onPress={() => decrease(setInfants, infants)}>
                <Text style={styles.symbol}>-</Text>
              </TouchableOpacity>
              <Text style={styles.count}>{infants}</Text>
              <TouchableOpacity style={styles.button} onPress={() => increase(setInfants, infants)}>
                <Text style={styles.symbol}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.confirm} onPress={handleConfirm} activeOpacity={0.85}>
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
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 30,
  },
  handle: {
    alignSelf: "center",
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d9dde5",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 22,
    color: "#1f2430",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2430",
  },
  subLabel: {
    fontSize: 13,
    color: "#8a90a0",
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  button: {
    backgroundColor: "#edf2f8",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  symbol: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d5fb2",
  },
  count: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2430",
  },
  confirm: {
    marginTop: 12,
    backgroundColor: "#ec0b7b",
    borderRadius: 18,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
