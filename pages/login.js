import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import {Button} from "@mui/material"
import logo from '../public/logo.png'
import {signIn} from '../firebase'




const Login = () => {


  return (
     <div className="grid place-items-center h-screen bg-slate-50"> 
     <Head>
       <title>Login</title> 
       </Head>    
       <div className="flex flex-col items-center bg-white p-16 rounded-lg shadow-md">
         <Image src={logo} width={150} height={150} objectFit="contain"/>
         <Button variant="outlined" className="mt-6 uppercase" onClick={signIn} >Sign in with google</Button>
       </div>
     </div>
  )
}

export default Login