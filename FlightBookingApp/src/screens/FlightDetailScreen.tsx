/*import { View, Text, StyleSheet, Alert } from "react-native";
import CustomButton from "../components/CustomButton";
import { useContext } from "react";
import { ReservationContext } from "../context/ReservationContext";

export default function FlightDetailScreen({ route }: any) {

  const { origin, destination, price } = route.params;
  const { addReservation } = useContext(ReservationContext);

  const handleReserve = () => {

  addReservation({
    origin,
    destination,
    price
  });

  Alert.alert(
    "Reserva confirmada",
    `Vuelo reservado de ${origin} a ${destination}`
  );
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Detalle del vuelo</Text>

      <Text style={styles.info}>Origen: {origin}</Text>
      <Text style={styles.info}>Destino: {destination}</Text>
      <Text style={styles.info}>Precio: {price}</Text>

      <View style={{ marginTop: 30 }}>
        <CustomButton
          title="Reservar vuelo"
          onClick={handleReserve}
        />
      </View>

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
*/

