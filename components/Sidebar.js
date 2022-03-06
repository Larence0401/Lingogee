 import {useContext} from 'react'
 import {Avatar, IconButton, Button} from "@mui/material"
 import ChatIcon from '@mui/icons-material/Chat';
 import MoreVertIcon from '@mui/icons-material/MoreVert';
 import SearchIcon from '@mui/icons-material/Search';
 import * as EmailValidator from "email-validator"
 import {signOutUser, addChat, useAuth, userChatRef} from '../firebase'
 import { useCollection } from 'react-firebase-hooks/firestore'
 import Chat from './Chat';
 import {Context} from '../store/context'
 
 const Sidebar = () => {

    const user = useAuth()
    
        const mail = user ? user.email : "aventuras030@gmail.com"
        const [chatsSnapshot] = useCollection(userChatRef(mail))
         const chatAlreadyExists = recipientEmail => 
         !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
    

    const createChat = () => {
        const input = prompt('Please enter an email address for the user you want to chat with')
        if(!input) return null

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            addChat(user,input)
        }
    }

    chatsSnapshot?.docs.map(chat => (
        console.log("chat id: " + chat.id + ", users: " + chat.data().users)
    ))

   return (
     <div className="flex-[.45] border-r-2 br-slate-50 h-screen min-w-[300px] mx-w-[350px]">
                <div className="flex flex-col sticky top-0 bg-white z-40">
                    <div className="p-4 flex sticky top-0 bg-white z-10 justify-between items-center h-24 border-b-2 border-slate-50">
                        <Avatar className="cursor-pointer hover:opacity-70" src={user?.photoURL} onClick={signOutUser}/>
                        <div>
                            <IconButton>
                                <ChatIcon/>
                            </IconButton>
                            <IconButton>
                                <MoreVertIcon/>
                            </IconButton>
                            
                        </div>
                    </div>
                    <div className="flex items-center p-2 sticky top-0">
                        <SearchIcon/>
                        <input type="text" placeholder="" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <Button className="w-full uppercase bg-slate-50 text-slate-900 font-semibold" onClick={createChat}>
                        Start a new chat
                        {/* List of Chats */}
                    </Button>
                    </div>
         {chatsSnapshot?.docs.map(chat => (
             <Chat key={chat.id} id={chat.id} users={chat.data().users} />
         ))}
     </div>

   )
 }
 
 export default Sidebar  