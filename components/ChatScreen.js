import React, {useState, useRef, useEffect} from 'react'
import { useAuth } from '../firebase'
import {useRouter } from 'next/router'
import {Avatar} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';
import {collection, doc, orderBy, query, setDoc, addDoc, serverTimestamp, where} from "firebase/firestore"
import {db} from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from "timeago-react"
import LanguageSelect from './LanguageSelect'
import { ref, getDownloadURL, uploadString } from "@firebase/storage"



const Chatscreen = ({chat, messages}) => {
   const user = useAuth()
   const router = useRouter()
   const [input, setInput] = useState()
   const endOfMessagesRef = useRef(null)

 const ref = collection(db, "chats",router.query.id,"messages")
 const usersRef = collection(db,"users")
 const recipientQuery = query(usersRef, where("email", "==", getRecipientEmail(chat.users, user)))
 const q = query(ref, orderBy("timestamp","asc"))
 const [messagesSnapshot] = useCollection(q)
 const [recipientSnapshot] = useCollection(recipientQuery)
 const [selectedFile, setSelectedFile] = useState(null)
 const [loading, setLoading] = useState(false)

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
    if(messagesSnapshot) {     
      return messagesSnapshot.docs.map( message => (
            <Message 
                key={message.id} 
                user={message.data().user}
                message={{
                  ...message.data(),
                  timestamp: message.data().timestamp?.toDate().getTime()
                }}
                />)
            )
    } else {
        return JSON.parse(messages).map(message => (
          <Message key={message.id} user={message.user} message={message}/>
        ))
    }
  }

  const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const ref = doc(db,"users",user.uid)
    const chatRef = collection(db,"chats",router.query.id,"messages")
    setDoc(ref, {
      lastSeen: serverTimestamp()
    }, {merge: true})

    addDoc(chatRef, {
      timestamp:serverTimestamp(),
      message: input,
      user: user.email, 
      photoURL: user.photoURL
    })
    setInput("")
    scrollToBottom()
  }

  useEffect(() => {
    //
  })

  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <div className="w-full">
        <div className="sticky z-50 top-0 flex p-4 border-b-2 border-slate-50 justify-between bg-white shadow-sm">
          <div className="flex items-center">
            {recipient ? (
              <Avatar src={recipient?.photoURL} />
            ) : (
              <Avatar>{recipientEmail[0]}</Avatar>
            )}
            <div className="ml-8 flex-1">
              <h3>{recipientEmail}</h3>
              {recipientSnapshot ? (
                <p>Last active: {' '}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : "Unavailable"} </p>
              ) : (
                <p>Loading Last active ...</p>
              )}           
            </div>
            </div>
            <LanguageSelect/>
            <div className="flex">
              <IconButton>
                <AttachFileIcon/>                
              </IconButton>
              <IconButton>
                <MoreVertIcon/>
              </IconButton>
            </div>
        </div>
        <div id="message-container" className="p-12 bg-sky-50 min-h-[90vh]">
          {showMessages()}
          <div ref={endOfMessagesRef} className="mb-16"></div>
        </div>  
        <form id="input-container" className="flex items-center p-4 sticky bottom-0 bg-white z-100">

          <IconButton>
            <InsertEmoticonIcon className="text-slate-800 hover:text-slate-900 text-2xl"/>
          </IconButton>
 
          <input type="file" id="fileUpload" name="fileUpload" hidden onChange={addImageToPost}/>  
          <label htmlFor="fileUpload">
            <AttachFileIcon className="text-slate-800 text-2xl hover:text-slate-900 hover:text-black"/>
          </label>      
          <input type="text" className="flex-1 outline-0 border-0 rounded bg-slate-50 p-6 ml-4 mr-4" value={input} onChange={e => setInput(e.target.value)}/>
          <button hidden disabled={!input} onClick={sendMessage}>Send Message</button>
          <MicIcon/>
        </form> 
    </div>
  )
}

export default Chatscreen