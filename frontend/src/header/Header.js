import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useUser,SignOutButton} from "@clerk/clerk-react";

const Header = () => {
  const {isSignedIn,user}=useUser();
  return (
    <div className="header">
      <Link to={'/'}>
      <div className="logo">
        <img src='/logo.png' alt="logo"/>
      </div>
      </Link>
      <div className="title">
      <h1>SITEGEN AI</h1>
      <p>AI Website Generator</p>
      </div>
      <ul className="menu-item">
                {!isSignedIn && (
          <Link to="/Sign Up">
            <li>Sign Up</li>
          </Link>
        )}
        {!isSignedIn && (
          <Link to="/login">
            <li>Login</li>
          </Link>
        )}
        {isSignedIn && (
          <SignOutButton>
              <li>
              Logout
            </li>
            </SignOutButton>
          
        )}
      </ul>
    </div>
  );
};

export default Header;

