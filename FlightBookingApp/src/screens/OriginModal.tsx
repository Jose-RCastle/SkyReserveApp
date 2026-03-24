import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../i18n";

type Origin = {
  id: string;
  name: string;
  code: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (origin: Origin) => void;
  origins: Origin[];
};

export default function OriginModal({ visible, onClose, onSelect, origins }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t("selectOriginTitle")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1f2430" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={origins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.originItem}
                activeOpacity={0.85}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <View style={styles.leftContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="airplane-outline" size={18} color="#2d5fb2" />
                  </View>
                  <Text style={styles.originName}>{item.name}</Text>
                </View>
                <Text style={styles.originCode}>{item.code}</Text>
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
  originItem: {
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
  originName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2430",
    flex: 1,
  },
  originCode: {
    fontSize: 16,
    color: "#848b99",
    fontWeight: "600",
  },
});