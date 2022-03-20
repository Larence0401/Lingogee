import Signup from "./SignUp";
import SignIn from "./SignIn";
import { useTranslationContext } from "../store/context";

const LoginForm = () => {
  const { state, dispatch } = useTranslationContext();

  const showLoginForm = () => setShowSignup(false);
  const showSignupForm = () => setShowSignup(true);
  const buttonActive =
    "bg-sky-600 hover:bg-sky-500 text-white border-sky-600 border-2";
  const buttonInactive =
    "bg-white text-sky-600 border-sky-600 hover:border-sky-400 border-2 hover:text-sky-400";
  const signInBtn = state.showSignUp ? buttonInactive : buttonActive;
  const signUpBtn = state.showSignUp ? buttonActive : buttonInactive;

  return (
    <>
      {state.showSignUp ? <Signup /> : <SignIn />}
      <div className="box-border mt-8 flex items-center justify-around">
        <button
          className={`px-8 py-2 mr-4 font-semibold uppercase rounded-md ${signInBtn}`}
          onClick={() =>
            dispatch({ type: "showSignUp", payload: { showSignUp: false } })
          }
        >
          Sign In
        </button>
        <button
          className={`px-8 py-2 mr-4 font-semibold uppercase rounded-md ${signUpBtn}`}
          onClick={() =>
            dispatch({ type: "showSignUp", payload: { showSignUp: true } })
          }
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default LoginForm;
