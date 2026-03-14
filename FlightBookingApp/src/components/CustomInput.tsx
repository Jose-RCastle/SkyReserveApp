import { TextInput, View, Text, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
  placeholder: string;
  onChange: (text: string) => void;
  value: string;
  typeInput?: "password" | "email" | "number" | "text";
  error?: string;
};

export default function CustomInput({
  placeholder,
  onChange,
  value,
  typeInput = "text",
  error: externalError,
}: Props) {
  const [isSecureText, setIsSecureText] = useState(typeInput === "password");
  const isPasswordField = typeInput === "password";

  const icon: typeof MaterialIcons.name | undefined =
    typeInput === "email" ? "email" : typeInput === "password" ? "lock" : undefined;

  const keyboardType: KeyboardTypeOptions =
    typeInput === "email" ? "email-address" : typeInput === "number" ? "numeric" : "default";

  const getInternalError = () => {
    if (value.length === 0) return null;

    if (typeInput === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return "Formato de correo incorrecto";
      }
    }

    if (typeInput === "password" && value.length < 6) {
      return "Mínimo 6 caracteres";
    }

    return null;
  };

  const errorToShow = externalError || getInternalError();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, errorToShow && styles.inputError]}>
        {icon && <MaterialIcons name={icon as any} size={20} color="#7f8796" />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9aa1ae"
          value={value}
          onChangeText={onChange}
          secureTextEntry={isSecureText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
            <Ionicons name={isSecureText ? "eye-off" : "eye"} size={20} color="#7f8796" />
          </TouchableOpacity>
        )}
      </View>
      {errorToShow && <Text style={styles.errorText}>{errorToShow}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dde2ea",
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 52,
    backgroundColor: "white",
  },
  input: {
    paddingHorizontal: 10,
    flex: 1,
    fontSize: 16,
    color: "#1f2430",
  },
  inputError: {
    borderColor: "#d62839",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#d62839",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 10,
  },
});
