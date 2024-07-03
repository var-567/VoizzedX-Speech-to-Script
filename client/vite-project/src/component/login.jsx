import "./loginpage.css";
import logo from "../images/Component 1.png";
import { auth } from "../cloud/logincloud";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
//import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const Navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  const signup = async () => {
    await createUserWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential);
        const user = userCredential.user;
        alert("Signed in as:", user.email);
        Navigate("/editor");
      })
      .catch((error) => {
        // Handle sign-in errors (e.g., wrong password)
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorCode, errorMessage);
      });
  };

  const login = async () => {
    await signInWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        alert(user.email + " Login successfully!!!");
        Navigate("/editor");
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
      });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log(token + user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode + errorMessage + email + credential);
      });
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div className="window">
      <div className="side1">
        <div>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "90px", height: "74px", flexShrink: 0 }}
          />
        </div>
        <div>
          <h1 className="head">SPEECH2SCRIPT</h1>
          <hr />
          <p className="content">
            Unlock the power of speech with our revolutionary Speech to Code
            system.{" "}
          </p>
        </div>
      </div>

      <div className="side2">
        <p className="welcome">Welcome back !!</p>
        <div>
          <div className="form-group">
            <label className="word1">Enter Your EMAIL ID:</label>
            <br />
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="word1">Enter Your PASSWORD:</label>
            <br />
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login">
            <button onClick={login} className="login-button">
              login
            </button>
          </div>
        </div>
        <a>FORGET PASSWORD?</a>
        <a onClick={toggleModal} className="btn-modal">
          NEW USER?: Create Account Here
        </a>
        <button className="input1">Sign in with Google</button>
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="one">
            <p className="welcome">REGISTER HERE !!</p>
          </div>
          <div className="two">
            <div className="form-group">
              <label className="word1">Enter Your EMAIL ID:</label>
              <br />
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="word1">Enter Your PASSWORD:</label>
              <br />
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="login">
              <button onClick={signup} className="login-button">
                REGISTER
              </button>
            </div>
          </div>
          <div className="three">
            <a>FORGET PASSWORD?</a>
            <a>HAVE AN ACCOUNT USER?: Login Here</a>
            <button className="input1" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Loginpage;
