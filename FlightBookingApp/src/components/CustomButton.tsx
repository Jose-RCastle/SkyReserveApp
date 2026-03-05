import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomButtonProps {
    title: string;
    onClick: () => void;
    variant?: "primary" | "secondary"; 
}
export default function CustomButton ({
    title,
    onClick,
    variant = "primary"
}: CustomButtonProps){
    const styles = getStyles(variant);
 
    return(
       <TouchableOpacity
            onPress={onClick}
            style={styles.container}>
                <Text
                style={styles.text}>
                    {title}
                </Text>
        </TouchableOpacity>
    );
}

const getStyles = (variant: 'primary' | 'secondary' ) => 
    StyleSheet.create({
    container: {
        paddingVertical: 15,
        alignItems: 'center',
        width: "80%",
        backgroundColor: 
            variant === "primary" ? "#2e4566": "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    text: {
        color: 
            variant === "primary" ?  "white" : "black",
        fontSize: 18,
        fontWeight: "500"
    }
});