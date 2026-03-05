import { TextInput, View, Text, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
    placeholder: string,
    onChange: (text: string) => void;
    value: string;
    typeInput?: 'password' | 'email' | 'number' | 'text';
}
export default function CustomInput ({placeholder, onChange, value, typeInput="text"}:Props){
//uso de variables en el estado local
        //sintaxis:
        //[nombreDeVariable, funcion] = useState(<valorInicial>);
    const [isSecureText, setIsSecureText] = useState(typeInput === 'password'); 
    const isPasswordField = typeInput === 'password';

    const icon : typeof MaterialIcons["name"]|undefined =
        typeInput === "email" ? "email" : 
            typeInput === "password" ? "lock" : undefined


    const keyboardType: KeyboardTypeOptions = 
    typeInput === "email" ? "email-address" :
           typeInput === "number" ? "numeric" : "default"   

    const getError = () =>{
        if (typeInput === "email" && !value.includes('@')) 
            return 'Correo Invalido';
        if (typeInput === "password" && value.length < 6)
            return 'La contraseña debe ser mas fuerte';
    };
    
    const error = getError();
    
    return(
        //wrapper
        <View style={styles.wrapper}>
            {/* //inputContainer */}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <MaterialIcons 
                    name={icon as any}
                    size={20}
                    color={"#000000"}
                />
                <TextInput 
                    style={styles.input}
                    placeholder={placeholder}
                    value={value} 
                    onChangeText={onChange}
                    secureTextEntry={isSecureText}
                    keyboardType={keyboardType}
                />

            { isPasswordField && 
                <TouchableOpacity onPress={()=>{setIsSecureText(!isSecureText)}}>
                    <Ionicons name={isSecureText ? "eye" : "eye-off"}  size={20} />
                </TouchableOpacity> 
            }
            </View>
           {error && <Text style={styles.inputError}> {error} </Text> }
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:{
        marginBottom:10,
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
    },
    input:{
        paddingHorizontal:10,
        width:'80%'
    },
    inputError:{
        borderColor: 'red',
        color: 'red',
    }
});