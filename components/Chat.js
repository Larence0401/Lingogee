import React from "react";
import { Avatar } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuth, db } from "../firebase";
import { useRouter } from "next/router";

//The chat component displays data of the users you have had a chat with
//The UI of this component is being rendered in the sidebar

const Chat = ({ id, users, search }) => {
  const router = useRouter();
  const user = useAuth();
  const ref = collection(db, "users");
  const q = query(ref, where("email", "==", getRecipientEmail(users, user)));
  const [recipientSnapshot] = useCollection(q);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);
  const photoURL = recipient && recipient.photoURL ? recipient.photoURL : "";
  const firstLetter = recipient && recipient.photoURL ? recipientEmail[0] : "";
  const username = recipient && recipient.username ? recipient.username : null
 

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <>
      {!search || (search.length > 0 && recipientEmail.includes(search)) ? (
        <div
          className="flex items-center cursor-pointer p-4 break-words hover:bg-slate-100 border-b border-slate-200 md:border-0"
          onClick={enterChat}
        >
          <Avatar className="m-2 mr-4" src={photoURL}>
            {firstLetter}
          </Avatar>
          <p>{username ? username : recipientEmail}</p>
        </div>
      ) : null}
      
    </>
  );
};

export default Chat;
