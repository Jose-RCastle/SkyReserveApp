import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { ReservationProvider } from "./src/context/ReservationContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
  <ReservationProvider>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  </ReservationProvider>
</AuthProvider>
  );
}