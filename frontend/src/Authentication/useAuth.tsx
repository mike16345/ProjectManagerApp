import { useEffect, useState, useContext, createContext } from "react";
import secureLocalStorage from "react-secure-storage";

interface AuthContext {
  authed: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = createContext<AuthContext | undefined>(undefined);

function useAuth(): AuthContext {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserToken = () => {
    const userToken = secureLocalStorage.getItem("user-token");

    if (!userToken || userToken === "undefined") {
      setAuthed(false);
    } else {
      setAuthed(true);
    }
  };

  useEffect(() => {
    checkUserToken();
    setLoading(false);
  }, []);

  return {
    authed,
    loading,
    login() {
      return new Promise<void>((resolve) => {
        setAuthed(true);
        resolve();
      });
    },
    logout() {
      return new Promise<void>((resolve) => {
        secureLocalStorage.removeItem("user-token");
        setAuthed(false);
        resolve();
      });
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function AuthConsumer(): AuthContext {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("AuthConsumer must be used within an AuthProvider");
  }
  return context;
}

export default AuthConsumer;