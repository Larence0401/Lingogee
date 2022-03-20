import { useState } from "react";
import { Button } from "@mui/material";
import { loginWithGoogle, loginUser } from "../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setError("Email or password is incorrect!");
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className=" border-[1px] border-sky-600 rounded py-1 px-4 w-full bg-gray-50"
          placeholder="your email ..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className=" border-[1px] border-sky-600 mt-6 rounded py-1 px-4 w-full bg-gray-50"
          placeholder="your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="outlined"
          className="mt-6 uppercase w-full font-semibold bg-sky-600 hover:bg-sky-500 text-sky-50"
          type="submit"
        >
          Submit
        </Button>
        {error.length > 0 && (
          <span className="italic text-red-500 mt-8">{error}</span>
        )}
      </form>
      <hr />
      <Button
        variant="outlined"
        className="mt-12 uppercase w-full font-semibold"
        onClick={loginWithGoogle}
      >
        Sign in with google
      </Button>
    </div>
  );
};

export default SignIn;
