import { createContext, useState } from "react";

type AuthContextType = {
  userEmail: string;
  login: (email: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userEmail: "",
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState("");

  const login = (email: string) => {
    setUserEmail(email);
  };

  const logout = () => {
    setUserEmail("");
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}