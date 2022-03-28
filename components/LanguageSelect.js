import React, { useState, useEffect } from "react";
import { findFlagUrlByNationality } from "country-flags-svg";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslationContext } from "../store/context";
import LanguageDropDown from "./LanguageDropDown.js"

const LanguageSelect = () => {
  const [langOne, setLangOne] = useState("German");
  const [langTwo, setLangTwo] = useState("Spanish");
  let [togglestate1, setTogglestate1] = useState(1);
  let [togglestate2, setTogglestate2] = useState(1);
  const [btnText1, setBtnText1] = useState("show translation");
  const [btnText2, setBtnText2] = useState("show translation");

  const flagUrlOne = findFlagUrlByNationality(langOne);
  const flagUrlTwo = findFlagUrlByNationality(langTwo);

  const { dispatch } = useTranslationContext();

  const toggleButton = (n) => {
    if (n === 1) {
      setTogglestate1((prevState) => (prevState + 1) % 3);
      showBtnText1();
    } else if (n === 2) {
      setTogglestate2((prevState) => (prevState + 1) % 3);
      showBtnText2();
    }
  };

  const showBtnText1 = () => {
    const buttonText =
      togglestate1 === 0
        ? "show side by side"
        : togglestate1 === 1
        ? "show translation"
        : togglestate1 === 2
        ? "show Original"
        : null;
    setBtnText1(buttonText);
  };

  const showBtnText2 = () => {
    const buttonText =
      togglestate2 === 0
        ? "show side by side"
        : togglestate2 === 1
        ? "show translation"
        : togglestate2 === 2
        ? "show Original"
        : null;
    setBtnText2(buttonText);
  };

  useEffect(() => {
    dispatch({
      type: "setUserLanguage",
      payload: { userLanguage: langOne, mode: togglestate1 },
    });
  }, [langOne, togglestate1]);

  useEffect(() => {
    dispatch({
      type: "setRecipientLanguage",
      payload: { recipientLanguage: langTwo, mode: togglestate2 },
    });
  }, [langTwo, togglestate2]);

  return (
    <div
      className="xl:-translate-x-16 flex flex-col md:flex-row items-center box-border"
      id="langSelectContainer"
    >
      <div className="flex md:border-2 md:border-sky-100 md:p-4 mr-4 rounded">
        <button
          className={`bg-sky-600 hover:bg-sky-700 rounded-md text-sky-50 text-xs md:text-sm p-0.5 px-2 md:p-2 md:px-4 uppercase font-semibold shadow-md mr-2 md:mr-4 w-[33%] md:w-44`}
          onClick={() => toggleButton(1)}
        >
          {btnText1}
        </button>
        <LanguageDropDown setLangOne={setLangOne} side="one"/>
        <div className="flex items-center">
          <img src={flagUrlOne} className="w-16" />
        </div>
      </div>

      <div className="hidden md:block p-4 text-blue-600 mr-4 hidden lg:block">
        <LanguageIcon style={{ fontSize: "3em" }} />
      </div>
      <hr className="block md:hidden pb-2"/>
      <div className="hidden md: flex md:border-2 md:border-sky-100 md:p-4 mr-4 rounded">
        <button
          className={`bg-sky-600 hover:bg-sky-700 rounded-md text-sky-50 text-xs md:text-sm p-0.5 px-2 md:p-2 md:px-4 uppercase font-semibold shadow-md mr-2 md:mr-4 w-[33%] md:w-44`}
          onClick={() => toggleButton(2)}
        >
          {btnText2}
        </button>
        <LanguageDropDown setLangTwo={setLangTwo} side="two"/>
        <div className="flex items-center">
          <img src={flagUrlTwo} className="w-16" />
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
