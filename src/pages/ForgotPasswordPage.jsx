import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import useSingleToast from "../hooks/useSingleToast";
import { sendForgetPasswordTokenToMail } from "../services/operations/authApi";

const ForgotPasswordPage = () => {
  const { loading } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const { errorToast } = useSingleToast();
  const dispatch = useDispatch();

  const submitHandler = async (event) => {
    event.preventDefault();
    const resp = await dispatch(
      sendForgetPasswordTokenToMail({ email }, errorToast)
    );
    if (resp?.success && !emailSent) {
      setEmailSent(!emailSent);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[calc(100vh-56px)] w-[100vw] flex justify-center items-center">
          <div className="p-4 flex flex-col gap-5 w-10/12 md:w-6/12 lg:w-5/12 xl:w-4/12">
            {/* heading */}

            <div className="flex flex-col gap-2">
              <div className="text-richblack-5 font-semibold text-2xl">
                {!emailSent ? "Reset your password" : "Check Email"}
              </div>
              <div className="text-richblack-100">
                {!emailSent
                  ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                  : `We have sent the reset email to ${email}`}
              </div>
            </div>

            {/* email label and input field  */}
            {
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                {!emailSent && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-richblack-5">
                      Email Address
                      <sup className="text-pink-200">*</sup>
                    </label>
                    <input
                      id="email"
                      required
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="relative text-richblack-5 bg-richblack-800 rounded-md shadow-[0px_2px] shadow-[#FFFFFF2E] p-2 w-full"
                    />
                  </div>
                )}
                {/* button  */}
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="bg-yellow-50 text-richblack-900 rounded-md text-center hover:scale-95 transition-all duration-200 w-full p-2"
                  >
                    {!emailSent ? "Reset Password" : "Resend Email"}
                  </button>
                  <div>
                    <Link to="/login">
                      <div className="flex items-center gap-2 text-richblack-5">
                        <FaArrowLeftLong />
                        <p>Back to login</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
