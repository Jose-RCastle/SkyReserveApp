import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../i18n";

type Destination = {
  id: string;
  name: string;
  country: string;
  basePrice: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (destination: Destination) => void;
  destinations: Destination[];
};

export default function DestinationModal({
  visible,
  onClose,
  onSelect,
  destinations,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t("selectDestinationTitle")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1f2430" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={destinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.destinationItem}
                activeOpacity={0.85}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <View style={styles.leftContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location-outline" size={18} color="#2d5fb2" />
                  </View>
                  <View>
                    <Text style={styles.destinationName}>{item.name}</Text>
                    <Text style={styles.destinationCountry}>{item.country}</Text>
                  </View>
                </View>
                <Text style={styles.destinationPrice}>${item.basePrice}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "82%",
  },
  handle: {
    alignSelf: "center",
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d9dde5",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2430",
  },
  destinationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eef1f5",
    gap: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#edf4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2430",
  },
  destinationCountry: {
    fontSize: 14,
    color: "#848b99",
    marginTop: 2,
  },
  destinationPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ec0b7b",
  },
});