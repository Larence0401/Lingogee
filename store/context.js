import { createContext, useReducer, useContext, useMemo } from "react";
const Context = createContext();
Context.displayName = "Context";

export const useTranslationContext = () => useContext(Context);

export const ContextProvider = ({ children }) => {
  const initialState = {
    userLanguage: "DE",
    recipientLanguage: "ES",
    modeOne: 0,
    modeTwo: 0,
    showSignUp: false,
    showModal: false,
    profilePicture: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "setUserLanguage": {
        return {
          ...state,
          userLanguage: action.payload.userLanguage,
          modeOne: action.payload.mode,
        };
      }
      case "setRecipientLanguage": {
        return {
          ...state,
          recipientLanguage: action.payload.recipientLanguage,
          modeTwo: action.payload.mode,
        };
      }
      case "showSignUp": {
        return {
          ...state,
          showSignUp: action.payload.showSignUp,
        };
      }
      case "showModal": {
        return {
          ...state,
          showModal: action.payload,
        };
      }
      case "setProfilePicture": {
        return {
          ...state,
          profilePicture: action.payload,
        };
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
