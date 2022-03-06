import React from 'react'
import {Avatar} from "@mui/material"
import getRecipientEmail from '../utils/getRecipientEmail'
import { collection, where, query} from "firebase/firestore"
import { useCollection } from 'react-firebase-hooks/firestore'
import {useAuth, db} from '../firebase'
import {useRouter} from 'next/router'

const Chat = ({id,users}) => {
const router = useRouter()
const user = useAuth()
const ref = collection(db,"users")
const q = query(ref, where('email', '==', getRecipientEmail(users, user)))
const [recipientSnapshot] = useCollection(q)
const recipient = recipientSnapshot?.docs?.[0]?.data()

const recipientEmail = getRecipientEmail(users, user) 


const enterChat = () => {router.push(`/chat/${id}`)}


  return (
    <div className="flex items-center cursor-pointer p-4 break-words hover:bg-slate-100" onClick={enterChat}>
          {(recipient && recipient.photoURL) ? (
              <Avatar className="m-2 mr-4" src={recipient?.photoURL}/>
          ) : (
               <Avatar className="m-2 mr-4">{recipientEmail[0]}</Avatar>
          )}
            
            <p>{recipientEmail}</p>
    </div>
  )
}

export default Chat