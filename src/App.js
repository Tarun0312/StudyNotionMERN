import "./App.css";
import {Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/common/Navbar";

function App() {


  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
   <Navbar/>
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path="/signup" element={<SignupPage/>}></Route>
    </Routes>

   </div>
  );
}

export default App;