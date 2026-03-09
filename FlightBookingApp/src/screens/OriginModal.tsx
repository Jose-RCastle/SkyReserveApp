import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona tu origen</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#2e4566" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={origins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.originItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.originName}>{item.name}</Text>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e4566',
  },
  originItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  originName: {
    fontSize: 18,
    fontWeight: '500',
  },
  originCode: {
    fontSize: 16,
    color: '#666',
  },
});