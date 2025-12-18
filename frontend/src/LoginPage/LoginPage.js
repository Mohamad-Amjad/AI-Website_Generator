import React from 'react'
import './LoginPage.css';
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className='login'>
      <SignIn/>
    </div>
  )
}

export default LoginPage
