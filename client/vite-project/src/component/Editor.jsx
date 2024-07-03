import { useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditorWindow.css";
import axios from "axios";
import { auth } from "../cloud/logincloud";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function EditorPage() {
  const [value, Setvalue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [DecodedOutput, setDecodedOutput] = useState();
  const [language, setLanguage] = useState("javascript");
  const [languageid, setLanguageid] = useState("63");
  const Navigate = useNavigate();

  {
    /* FUNCTION TO STORE VALUE(CODE) TYPED IN CODE EDITOR SPACE COCURRENTLY*/
  }
  const OnChange = (value) => {
    Setvalue(value);
    console.log(value);
  };
  {
    /*TO STORE THE INPUT GIVEN TO THE CODE*/
  }
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleTextareaClick = () => {
    // Clear the content of the textarea when clicked
    setDecodedOutput("");
    setInputValue("");
  };

  const handleLanguageChange = (selectElement) => {
    const selectedIndex = selectElement.selectedIndex;
    const selectedOption = selectElement.options[selectedIndex];
    const selectedId = selectedOption.getAttribute("id"); // Get the 'id' attribute of the selected option
    const selectedValue = selectedOption.value;
    // Now you have the 'id' and 'value' of the selected option
    setLanguage(selectedValue);
    setLanguageid(selectedId);
    console.log(+selectedId);
    console.log(selectedValue);
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("you are logged out of the editor page!!");
        Navigate("/");
        alert("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  const handleSpeechRecognition = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/members");

      if (response.ok) {
        const data = await response.json();
        Setvalue(data.members);
      } else {
        console.error("Failed to convert speech to code.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //HANDLE COMPILE FUNCTION IS USED SEND THE CODE TO JUDGE0 SERVER USING RAPID API HOST AND COMPILE THE CODE .IT STORE THE TOKEN RECIVED.
  const handleCompile = async () => {
    const formData = {
      language_id: +languageid,
      // encode source code in base64
      source_code: btoa(value),
      stdin: btoa(inputValue),
    };

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "a7eae7ceffmsh3e30c7d5004bc78p148c53jsn2de1a7fd3ed3",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: formData,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      const Token = response.data.token;
      checkstatus(Token);
    } catch (error) {
      console.error(error);
      if (error.response.status === 422) {
        console.log(error.message);
      }
    }
  };

  // CHECKSTATUS FUNCTION IS USED TO REQUEST API THE RETUR THE EXCEUTED OUT AD STORE IT IN OUTPUTDETAILS VARIABLE.
  const checkstatus = async (Token) => {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/" + Token,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Key": "a7eae7ceffmsh3e30c7d5004bc78p148c53jsn2de1a7fd3ed3",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response);
      const statusid = response.data.status_id;
      if (statusid === 2 || statusid === 1) {
        setTimeout(() => {
          checkstatus(Token);
        }, 2000);
      } else {
        const stdoutput = response.data.stdout;
        const trimoutput = stdoutput.replace(/[\n]/gm, "");
        const b = atob(trimoutput);
        setDecodedOutput(b);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="web">
      <div style={{ display: "flex" }}>
        <div>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
        <button onClick={handleSpeechRecognition}>Convert to Code</button>
        <div className="language - dropdown">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target)}
            className="block appearance-none float-right selectstyles border border-gray-300 text-2xl text-slate-900 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          >
            <option
              id="63"
              name="JavaScript (Node.js 12.14.0)"
              label="JavaScript (Node.js 12.14.0)"
              value="javascript"
            >
              JavaScript
            </option>
            <option
              id="71"
              name="Python (3.8.1)"
              label="Python (3.8.1)"
              value="python"
            >
              Python
            </option>
            <option
              id="50"
              name="C (GCC 9.2.0)"
              label="C (GCC 9.2.0)"
              value="c"
            >
              C
            </option>
            <option
              id="54"
              name="C++ (GCC 9.2.0)"
              label="C++ (GCC 9.2.0)"
              value="cpp"
            >
              C++
            </option>
            <option
              id="62"
              name="Java (OpenJDK 13.0.1)"
              label="Java (OpenJDK 13.0.1)"
              value="java"
            >
              Java
            </option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="inoutput">
          {/* DIV TO CREATE CODE EDITOR*/}
          <div className="Input">
            <h1>Input</h1>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter text here"
            ></textarea>
          </div>
          {/* DIV TO DISPLAY OUTPUT FEILD*/}
          <div className="Output">
            <h1>Output</h1>
            <textarea
              value={DecodedOutput}
              // readOnly={DecodedOutput === "Initial Output"}
            ></textarea>
            <div>
              <button className="compilerunbutton" onClick={handleCompile}>
                Compile and Run
              </button>
            </div>
          </div>
          <div>
            <button className="clear" onClick={handleTextareaClick}>
              CLEAR
            </button>
          </div>
        </div>
        <div className="CodeEditor">
          <Editor
            width="80vh"
            height="100%"
            language={language}
            theme="vs-dark"
            value={value}
            onChange={OnChange}
          />
        </div>
      </div>
    </div>
  );
}
export default EditorPage;
