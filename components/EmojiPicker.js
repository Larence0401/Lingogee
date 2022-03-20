import { useState } from "react";
import dynamic from "next/dynamic";

const EmojiPicker = ({ setInput }) => {
  const Picker = dynamic(
    () => {
      return import("emoji-picker-react");
    },
    { ssr: false }
  );

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    if (chosenEmoji === undefined) return;
    setChosenEmoji(emojiObject);
  };

  return (
    <div>
      <Picker
        pickerStyle={{ width: "100%" }}
        onEmojiClick={(e, emojiObject) =>
          setInput((prevInput) => prevInput + emojiObject?.emoji)
        }
        disableAutoFocus={true}
        skinTone={Picker.SKIN_TONE_MEDIUM_DARK}
        groupNames={{ smileys_people: "PEOPLE" }}
        native
      />
    </div>
  );
};

export default EmojiPicker;
