import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CustomButtonProps {
  title: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomButton({
  title,
  onClick,
  variant = "primary",
  fullWidth = true,
  style,
  textStyle,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.85}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        variant === "primary" ? styles.primary : styles.secondary,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: "#ec0b7b",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dfe3ea",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
  },
  primaryText: {
    color: "#ffffff",
  },
  secondaryText: {
    color: "#1d2533",
  },
});
