import '../styles/globals.css'
import {useAuth, setUserData} from '../firebase'
import {useEffect} from 'react'
import Login from './login'

function MyApp({ Component, pageProps }) {
  const user = useAuth()

  useEffect(() => {
    if(user) {
       setUserData(user)
    }
  },
  [user])

  if(!user) return <Login />
  return <Component {...pageProps} />
}

export default MyApp
