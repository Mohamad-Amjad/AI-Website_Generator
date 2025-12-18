import React from 'react'
import './SignupPage.css'
import { SignUp ,useUser} from "@clerk/clerk-react";


const SignupPage = () => {
  const {isSignedIn,user}=useUser();
  return (
    <div className='signup'>
      <SignUp/>
    </div>
  )
}

export default SignupPage
