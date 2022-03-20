import "../styles/globals.css";
import { useAuth, setUserData } from "../firebase";
import { useEffect } from "react";
import Login from "./login";
import { ContextProvider } from "../store/context";

function MyApp({ Component, pageProps }) {
  const user = useAuth();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (!user) return <Login />;
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp;
