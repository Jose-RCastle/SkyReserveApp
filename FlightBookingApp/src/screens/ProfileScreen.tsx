import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";

export default function ProfileScreen({ navigation }: any) {

  function logout(){
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Perfil</Text>
      <Text>Usuario</Text>

      <CustomButton
        title="Cerrar sesión"
        onClick={logout}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#e6f0fa"
  },
  title:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:20
  }
});