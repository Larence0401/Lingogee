import React from "react";

const LanguageDropDown = ({ setLangOne, setLangTwo, side }) => {

  return (
    <select
      name=""
      id="language_select"
      className="mr-4 p-2"
      onChange={
        side === "one"
          ? (e) => setLangOne(e.target.value)
          : side === "two"
          ? (e) => setLangTwo(e.target.value)
          : null
      }
    >
      <option value="British">English</option>
      <option value="Chinese">Chinese</option>
      <option value="French">French</option>
      <option value="German">German</option>
      <option value="Italian">Italian</option>
      <option value="Japanese">Japanese</option>
      <option value="Portuguese">Portuguese</option>
      <option value="Russian">Russian</option>
      <option value="Spanish">Spanish</option>
    </select>
  );
};

export default LanguageDropDown;
