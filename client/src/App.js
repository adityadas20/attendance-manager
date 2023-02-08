import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import About from "./components/About";
import Logout from "./components/Logout";
import { createContext, useReducer } from "react";
import { initialState, reducer, initialToken, tokenReducer } from "./reducer/UseReducer";


export const UserContext = createContext();


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [stateToken, dispatchToken] = useReducer(tokenReducer, initialToken)

  return (
    <Router>
      <UserContext.Provider value={{ state, dispatch, stateToken, dispatchToken }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  )
}

export default App;
