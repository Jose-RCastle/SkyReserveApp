import { TextInput, View, Text, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
    placeholder: string,
    onChange: (text: string) => void;
    value: string;
    typeInput?: 'password' | 'email' | 'number' | 'text';
    error?: string; //para errores externos
}

export default function CustomInput ({
    placeholder, 
    onChange, 
    value, 
    typeInput = "text",
    error: externalError //recibimos error del padre
}: Props) {
    const [isSecureText, setIsSecureText] = useState(typeInput === 'password'); 
    const isPasswordField = typeInput === 'password';

    const icon : typeof MaterialIcons["name"]|undefined =
        typeInput === "email" ? "email" : 
            typeInput === "password" ? "lock" : undefined

    const keyboardType: KeyboardTypeOptions = 
        typeInput === "email" ? "email-address" :
            typeInput === "number" ? "numeric" : "default"   

    //validaciones internas del componente
    const getInternalError = () => {
        if (value.length === 0) return null; //no muestra error si está vacío

        if (typeInput === "email") {
            //esta validación es solo informativa
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                return 'Formato de correo incorrecto';
            }
        }
        
        if (typeInput === "password" && value.length < 6) {
            return 'Mínimo 6 caracteres';
        }
        
        return null;
    };
    
    //pioridad: error externo (del padre) > error interno
    const errorToShow = externalError || getInternalError();
    
    return(
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, errorToShow && styles.inputError]}>
                <MaterialIcons 
                    name={icon as any}
                    size={20}
                    color={"#000000"}
                />
                <TextInput 
                    style={styles.input}
                    placeholder={placeholder}
                    value={value} 
                    onChangeText={(text) => {
                        onChange(text);
                        //no limpiamos errores internos aquí, eso lo hace el padre
                    }}
                    secureTextEntry={isSecureText}
                    keyboardType={keyboardType}
                />

                { isPasswordField && 
                    <TouchableOpacity onPress={()=>{setIsSecureText(!isSecureText)}}>
                        <Ionicons name={isSecureText ? "eye" : "eye-off"}  size={20} />
                    </TouchableOpacity> 
                }
            </View>
           {errorToShow && <Text style={styles.errorText}> {errorToShow} </Text> }
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:{
        marginBottom: 15,
        width: "100%",
        paddingHorizontal: 25,
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 13,
        backgroundColor: 'white',
    },
    input:{
        paddingHorizontal:10,
        flex: 1,
    },
    inputError:{
        borderColor: 'red',
        borderWidth: 2,
    },
    errorText:{
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 10,
    }
});