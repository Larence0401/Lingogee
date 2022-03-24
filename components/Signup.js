import { useState } from "react";
import { Button } from "@mui/material";
import { loginWithGoogle, signupUser } from "../firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
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
        <div className="mt-6 uppercase w-full font-semibold bg-sky-600 hover:bg-sky-500 text-sky-50 text-center text-white">
        <Button
          sx={{color: 'white'}}
          variant="outlined"
          className="uppercase w-full font-semibold bg-sky-600 text-sky-50"
          type="submit"
        >
          Submit
        </Button>
        </div>
      </form>
      <hr />
      <Button
        variant="outlined"
        className="mt-12 uppercase w-full font-semibold"
        onClick={loginWithGoogle}
      >
        Sign up with google
      </Button>
    </div>
  );
};

export default SignUp;
