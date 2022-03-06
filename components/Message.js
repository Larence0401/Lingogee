import React, {useState, useEffect} from 'react'
import {useAuth} from '../firebase'
import moment from 'moment'
import axios from 'axios'
import {useTranslationContext} from '../store/context'

const Message = ({user, message}) => {
  const userLoggedIn = useAuth()

  const sender = "ml-auto bg-green-200 border-2 border-green-300"
  const receiver = "bg-slate-50 text-left border-2 border-slate-200"
  const isSender = user === userLoggedIn?.email
  const typeOfMessage = isSender ? sender : receiver
  const {state} = useTranslationContext()
  const [translation, setTranslation] = useState('')
  const isSideBySide = (isSender && state.modeTwo === 2 || !isSender && state.modeOne === 2)



const languageCodes = new Map()
languageCodes.set('langCodes', {'British' : 'EN', 'German' : 'DE' , 'Spanish' : 'ES', 'Italian' : 'IT', 'French' : 'FR'})

  useEffect(() => {
    getTranslation()
  },[message,state])

const getLanguage = () => {
    let language = ""
    isSender 
        ? language = languageCodes.get('langCodes')[state.recipientLanguage]
        : language = languageCodes.get('langCodes')[state.userLanguage]
    return language
}

const getDisplayMode = mode => {
      if(mode === 0) {
          return translation
      } else if(mode === 1) {
          return message.message
      } else if(mode === 2) {
        return null
      }
}

const output = isSender ? getDisplayMode(state.modeTwo) : getDisplayMode(state.modeOne)

const getTranslation = async() => {
     const language = getLanguage()
     console.log(language)
     const result = await axios
    .get(`https://api-free.deepl.com/v2/translate`,
      {params: {
        auth_key: "2f007cef-851d-627f-d8aa-e9c889c8323e:fx",
        text: message.message,
        target_lang: language
      },
      proxy: {
        host: "localhost",
        port: 3000
      }})
    const translation = result.data.translations[0].text
    setTranslation(translation)
 
}
    
  return (
    <div>
        <p className={`w-fit p-4 rounded-lg m-4 min-w-64 max-w-[60%] pb-8 pl-8 relative text-right ${typeOfMessage}`}>
                  {/* {message.message} <br></br><span className="italic text-blue-900">{translation}</span> */}
                  {isSideBySide ? <>
                                {message.message} <br></br><span className="italic text-blue-900">{translation}</span>
                                  </> 
                    : output}
                  <span className="text-gray-600 p-4 text-xs absolute bottom-0 align-right right-0 whitespace-nowrap">{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</span>
        </p>
    </div>
  )
}

export default Message