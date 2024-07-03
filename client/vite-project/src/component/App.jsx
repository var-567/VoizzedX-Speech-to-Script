import Loginpage from "./login.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditorPage from "./Editor.jsx";
//import Home from "./home.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
