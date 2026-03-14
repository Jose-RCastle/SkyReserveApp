import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: string;
  onPress?: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  editable?: boolean;
  placeholder?: string;
};

export const InputField = ({
  label,
  value,
  onPress,
  icon,
  editable = true,
  placeholder,
}: Props) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Container
        style={styles.inputContainer}
        onPress={onPress}
        disabled={!editable}
        activeOpacity={0.85}
      >
        <Ionicons name={icon} size={22} color="#8c93a3" />
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder || `Selecciona ${label.toLowerCase()}`}
        </Text>
        {onPress && <Ionicons name="chevron-down" size={20} color="#8c93a3" />}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#7d8390",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#dde2ea",
  },
  inputText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    color: "#1f2430",
  },
  placeholder: {
    color: "#9aa1ae",
  },
});
