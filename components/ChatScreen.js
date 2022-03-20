import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../firebase";
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  addDoc,
  serverTimestamp,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import LanguageSelect from "./LanguageSelect";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import FileUpload from "./FileUpload";
import EmojiPicker from './EmojiPicker'

//This component displays the messages in a respective chat, the top menu bar and the input field for new messages

const Chatscreen = ({ chat, messages }) => {
  const user = useAuth();
  const router = useRouter();
  const [input, setInput] = useState();
  const endOfMessagesRef = useRef(null);

  const reference = collection(db, "chats", router.query.id, "messages");
  const usersRef = collection(db, "users");
  const recipientQuery = query(
    usersRef,
    where("email", "==", getRecipientEmail(chat.users, user))
  );
  const q = query(reference, orderBy("timestamp", "asc"));
  const [messagesSnapshot] = useCollection(q);
  const [recipientSnapshot] = useCollection(recipientQuery);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [EmojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
            id: message.id,
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const reference = doc(db, "users", user.uid);
    const chatRef = collection(db, "chats", router.query.id, "messages");
    setDoc(
      reference,
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    const docRef = await addDoc(chatRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
      image: "",
    });
    setInput("");
    scrollToBottom();
    if (!selectedFile) return;
    const imageRef = ref(storage, `messages/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        console.log(downloadURL);
        await updateDoc(
          doc(db, "chats", router.query.id, "messages", docRef.id),
          {
            image: downloadURL,
          }
        );
      }
    );
    setSelectedFile(null);
  };

  const handleClick = () => {
    setEmojiPickerIsOpen((EmojiPickerIsOpen) => !EmojiPickerIsOpen);
  };

  const inputRef = useRef(null);
  useEffect(() => {
    if (selectedFile) return;
    inputRef.current.focus();
    inputRef.current.selectionStart = inputRef.current.value.length;
    inputRef.current.selectionEnd = inputRef.current.value.length;
  }, [input]);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const username = recipient?.username ? recipient?.username : null
  const recipientPic = recipient?.profilePic
    ? recipient?.profilePic
    : recipient?.photoURL;

  return (
    <div className="w-full h-full">
      <div className="sticky z-50 top-0 flex p-4 border-b-2 border-slate-50 justify-between bg-white shadow-sm">
        <div className="flex items-center">
          {recipient ? (
            <Avatar src={recipientPic} />
          ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}
          <div className="ml-8 flex-1">
            <h3>{username ? username : recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>
                Last active:{" "}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}{" "}
              </p>
            ) : (
              <p>Loading Last active ...</p>
            )}
          </div>
        </div>
        <LanguageSelect />
        <div className="flex">
        </div>
      </div>
      <div
        id="message-container"
        className="p-12 bg-sky-50 h-[90vh] !overflow-y-auto"
      >
        {selectedFile ? (
          <FileUpload
            file={selectedFile}
            sendMessage={sendMessage}
            setInput={setInput}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          showMessages()
        )}
        <div ref={endOfMessagesRef} className="mb-16"></div>
      </div>
      {!selectedFile && (
        <form
          id="input-container"
          className="flex flex-col items-center p-4 sticky bottom-0 bg-white z-100"
        >
          {EmojiPickerIsOpen && <EmojiPicker setInput={setInput}/>}
          <div className="flex flex-row  items-center space-between w-full">
            <IconButton onClick={handleClick}>
              <InsertEmoticonIcon className="text-slate-800 hover:text-slate-900 text-2xl self-start"/>
            </IconButton>

            <input
              type="file"
              id="fileUpload"
              name="fileUpload"
              hidden
              onChange={addImageToPost}
            />
            <label htmlFor="fileUpload">
              <AttachFileIcon className="text-slate-800 text-2xl hover:text-slate-900 hover:text-black" />
            </label>
            <input
              type="text"
              className="flex-1 outline-0 border-0 rounded bg-slate-50 p-6 ml-4 mr-4"
              value={input}
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
            />
            <button hidden disabled={!input} onClick={sendMessage}>
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Chatscreen;
