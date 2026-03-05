import { View, Text, StyleSheet } from "react-native";

export default function FlightDetailScreen({ route }: any) {

  const { origin, destination, price } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Detalle del vuelo</Text>

      <Text style={styles.info}>Origen: {origin}</Text>
      <Text style={styles.info}>Destino: {destination}</Text>
      <Text style={styles.info}>Precio: {price}</Text>

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
    fontSize:24,
    fontWeight:"bold",
    marginBottom:20,
    color:"#2e4566"
  },
  info:{
    fontSize:18,
    marginVertical:5
  }
});