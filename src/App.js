import "./App.css";
import {Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/common/Navbar";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Dashboard from "./components/core/Dashboard/Dashboard";

function App() {


  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
   <Navbar/>
    <Routes>
      
      <Route 
            path='/' 
            element={<HomePage/>}>
      </Route>
      
      <Route 
            path='/login' 
            element={
              <OpenRoute>
                <LoginPage/>
              </OpenRoute>
            }>
      </Route>

      <Route 
            path="/signup" 
            element={
              <OpenRoute>
                <SignupPage/>
              </OpenRoute>
            }>
      </Route>

      <Route 
             path='/verify-email' 
             element={ 
              <OpenRoute>
                <VerifyEmailPage/>
              </OpenRoute>
             }>
      </Route>
      
      <Route 
            path='/forgot-password' 
            element={
              <OpenRoute>
                <ForgotPasswordPage/>
              </OpenRoute>
            }>
      </Route>


      <Route 
            path='/reset-password/:id' 
            element={
              <OpenRoute>
                <UpdatePasswordPage/>
              </OpenRoute>
            }>
      </Route>
      
      <Route
            path='/dashboard'
            element={
              <OpenRoute>
                <Dashboard/>
              </OpenRoute>
            }>

      </Route>

      <Route path='*' element={<ErrorPage/>}></Route>
    </Routes>

   </div>
  );
}

export default App;