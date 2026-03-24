import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "es" | "en";

type LanguageState = {
  currentLanguage: Language;
};

const initialState: LanguageState = {
  currentLanguage: "es",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;