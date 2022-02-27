import React from 'react'
import {useAuth} from '../firebase'
import moment from 'moment'

const Message = ({user, message}) => {
  const userLoggedIn = useAuth()

  const sender = "ml-auto bg-green-200 border-2 border-green-300"
  const receiver = "bg-slate-50 text-left border-2 border-slate-200"

  const typeOfMessage = user === userLoggedIn?.email ? sender : receiver

  return (
    <div>
        <p className={`w-fit p-4 rounded-lg m-4 min-w-64 max-w-[60%] pb-8 pl-8 relative text-right ${typeOfMessage}`}>
                  {message.message}
                  <span className="text-gray-600 p-4 text-xs absolute bottom-0 align-right right-0 whitespace-nowrap">{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</span>
        </p>
    </div>
  )
}

export default Message