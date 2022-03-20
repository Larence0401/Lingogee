import Image from "next/image";
import Head from "next/head";
import logo_2 from "../public/logo_2.png";
import LoginForm from "../components/LoginForm";
import { ContextProvider } from "../store/context";

const Login = () => {
  return (
    <ContextProvider>
      <div className="grid place-items-center h-screen bg-slate-50">
        <Head>
          <title>Login</title>
        </Head>
        <div className="flex flex-col items-center bg-white p-16 rounded-lg shadow-md items-center">
          <Image src={logo_2} width={150} height={150} objectFit="contain" />
          <LoginForm />
        </div>
      </div>
    </ContextProvider>
  );
};

export default Login;
