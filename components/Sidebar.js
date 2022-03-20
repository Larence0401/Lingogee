import { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { addChat, useAuth, userChatRef, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { useTranslationContext } from "../store/context";
import Chat from "./Chat";
import EditProfile from "./EditProfile";
import { useRouter } from "next/router";

const Sidebar = () => {
  const user = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [timestampIsSet, setTimestampIsSet] = useState(false);
  const [input, setInput] = useState(null);
  const { state } = useTranslationContext();
  const timestampRef = useRef({});
  const router = useRouter();
  const chatsExist = () => {
    const chats = getAllChatIDs();
    if (chats.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const userPic = state.profilePicture ? state.profilePicture : user?.photoURL;

  const mail = user ? user.email : "aventuras030@gmail.com";
  const [chatsSnapshot] = useCollection(userChatRef(mail));
  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you want to chat with"
    );
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      addChat(user, input);
    }
  };

  const getAllChatIDs = () => {
    let chatIDs = [];
    chatsSnapshot?.docs.map((chat) => (chatIDs = [...chatIDs, chat.id]));
    return chatIDs;
  };

  const getLatestTimestamps = async () => {
    const timestampSet = new Set();
    const chatIDs = getAllChatIDs();
    chatIDs.map(async (chatID) => {
      const messagesRef = collection(db, "chats", chatID, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      const message = await getDocs(q);
      message.forEach((doc) => {
        timestampSet.add(doc.data().timestamp.seconds);
        const timestampArr = Array.from(timestampSet);
        timestampRef.current = timestampArr;
        timestampRef.current.length === chatIDs.length
          ? setTimestampIsSet(true)
          : null;
      });
    });
  };

  const getLatestChatID = () => {
    const arr = timestampRef.current;
    if (!Array.isArray(arr)) return;
    const max = Math.max(...arr);
    const index = arr.indexOf(max);
    const chatIDs = getAllChatIDs();
    const result = chatIDs[index];
    return result;
  };

  const loadLatestChat = async () => {
    if (router.pathname !== "/") return;
    await getLatestTimestamps();
    await getLatestChatID();
    const latestChatID = getLatestChatID();
    if (latestChatID !== undefined) {
      router.push(`/chat/${latestChatID}`);
    }
  };

  useEffect(async () => {
    if (!chatsExist) return;
    await loadLatestChat();
  }, [timestampIsSet, chatsSnapshot]);

  return (
    <div className="flex-[.45] border-r-2 br-slate-50 h-screen min-w-[300px] mx-w-[350px] relative">
      {isOpen ? (
        <EditProfile setIsOpen={setIsOpen} />
      ) : (
        <>
          <div className="flex flex-col sticky top-0 bg-white z-40">
            <div className="p-4 pl-8 flex sticky top-0 bg-white z-10 justify-between items-center h-28 border-b-2 border-slate-50">
              <Avatar
                className="cursor-pointer hover:opacity-70"
                src={userPic}
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div className="flex items-center p-2 sticky top-0">
              <SearchIcon />
              <input
                type="text"
                placeholder=""
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button
              className="w-full uppercase bg-slate-50 text-slate-900 font-semibold"
              onClick={createChat}
            >
              Start a new chat
            </Button>
          </div>
          <div className="flex flex-col overflow-y-auto h-full">
            {chatsSnapshot?.docs.map((chat) => (
              <Chat
                key={chat.id}
                id={chat.id}
                users={chat.data().users}
                search={input}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
