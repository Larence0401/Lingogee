import React from 'react'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
import { collection, doc, query, orderBy, getDocs, getDoc } from "firebase/firestore"
import getRecipientEmail from '../../utils/getRecipientEmail'
import {db, useAuth} from '../../firebase'
import {ContextProvider} from '../../store/context'

const Chat = ({chat, messages}) => {
  const user = useAuth()
  return (
    <div className="flex">
        <Head>
            <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        </Head>
        <Sidebar/>
        <div className="flex w-full">
            <ChatScreen className="h-screen w-screen" chat={chat} messages={messages}/>
        </div>
    </div>
  )
}

export default Chat

export async function getServerSideProps(context) {


  //PREP the messages on the server
  const q = query(collection(db,'chats',context.query.id,'messages'), orderBy("timestamp","asc"))
  const ref = doc(db,"chats",context.query.id)
  const messagesRes = await getDocs(q)
  const messages = messagesRes.docs.map(doc => ({id: doc.id, ...doc.data()}))

  //PREP THE CHATS
  const chatRes = await getDoc(ref)
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  console.log(chat)
  console.log(messages)

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat
    }
  }

}



