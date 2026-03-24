import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import StackNavigator from "./src/navigation/StackNavigator";
import { store } from "./src/redux/store";
import LanguageInitializer from "./src/components/LanguageInitializer";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <LanguageInitializer />
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
