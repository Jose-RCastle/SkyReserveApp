import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TabsNavigator from "./TabsNavigator";
import FlightDetailScreen from "../screens/FlightDetailScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FlightDetail" component={FlightDetailScreen} />
    </Stack.Navigator>
  );
}