import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase";
import moment from "moment";
import axios from "axios";
import { useTranslationContext } from "../store/context";

const Message = ({ user, message }) => {
  const userLoggedIn = useAuth();

  const sender = "ml-auto bg-green-200 border-2 border-green-300";
  const receiver = "bg-slate-50 text-left border-2 border-slate-200";
  const isSender = user === userLoggedIn?.email;
  const typeOfMessage = isSender ? sender : receiver;
  const { state } = useTranslationContext();
  const [translation, setTranslation] = useState("");
  const isSideBySide =
    (isSender && state.modeTwo === 2) || (!isSender && state.modeOne === 2);

  const languageCodes = new Map();
  languageCodes.set("langCodes", {
    British: "EN",
    German: "DE",
    Spanish: "ES",
    Italian: "IT",
    French: "FR",
    Russian: "RU",
    Chinese: "ZH",
    Japanese: "JA",
    Portuguese: "PT"
  });

  useEffect(() => {
    if ((state.modeOne === 1 && state.modeTwo === 1) || !message) return;
    getTranslation();
  }, [message, state]);

  const getLanguage = () => {
    let language = "";
    isSender
      ? (language = languageCodes.get("langCodes")[state.recipientLanguage])
      : (language = languageCodes.get("langCodes")[state.userLanguage]);
    return language;
  };

  const getDisplayMode = (mode) => {
    if (mode === 0) {
      return translation;
    } else if (mode === 1) {
      return message.message;
    } else if (mode === 2) {
      return null;
    }
  };

  const output = isSender
    ? getDisplayMode(state.modeTwo)
    : getDisplayMode(state.modeOne);

  const getTranslation = async () => {
    const key = message.id + "_" + getLanguage();
    const sessionValue = sessionStorage.getItem(key);
    const sessionStorageExists = sessionValue !== null;
    let result = "";
    const language = getLanguage();
    if (!sessionStorageExists) {
      result = await axios.get(`https://api.deepl.com/v2/translate`, {
        params: {
          auth_key: process.env.deeplAPIKey,
          text: message.message,
          target_lang: language,
        },
        proxy: {
          host: "localhost",
          port: 3000,
        },
      });
    } else {
      null;
    }

    const translationFromAPI = !sessionStorageExists
      ? result.data.translations[0].text
      : null;
    const translation = !sessionStorageExists
      ? translationFromAPI
      : sessionValue;
    !sessionStorageExists
      ? sessionStorage.setItem(key, translationFromAPI)
      : null;
    setTranslation(translation);
  };
  return (
    <div>
      <p
        className={`w-fit p-4 rounded-lg m-4 min-w-64 max-w-[60%] pb-8 pl-8 relative text-right ${typeOfMessage}`}
      >
        {message?.image?.length > 0 && (
          <img src={message.image} className="pb-4" />
        )}
        {isSideBySide ? (
          <>
            {message.message} <br></br>
            <span className="italic text-blue-900">{translation}</span>
          </>
        ) : (
          output
        )}
        <span className="text-gray-600 p-4 text-xs absolute bottom-0 align-right right-0 whitespace-nowrap">
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </span>
      </p>
    </div>
  );
};

export default Message;
