import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setLanguage } from "../redux/slices/languageSlice";
import { setI18nLanguage } from "../i18n";

export default function LanguageInitializer() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("app_language");

      if (savedLanguage === "es" || savedLanguage === "en") {
        dispatch(setLanguage(savedLanguage));
        setI18nLanguage(savedLanguage);
        return;
      }

      const deviceLanguage = getLocales()?.[0]?.languageCode === "en" ? "en" : "es";
      dispatch(setLanguage(deviceLanguage));
      setI18nLanguage(deviceLanguage);
    };

    loadLanguage();
  }, [dispatch]);

  useEffect(() => {
    setI18nLanguage(currentLanguage);
  }, [currentLanguage]);

  return null;
}