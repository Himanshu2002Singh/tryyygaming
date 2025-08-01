"use client";
import React, { useContext, useState, useEffect } from "react";
import { MdSms } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import API_URL from "@/config";
import axios from "axios";
import ProfilePage from "../components/Profile/Profile";
import { AuthContext } from "../context/authprovider";
import { useBottomSheet } from "../context/BottomSheet";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneOtpScreen = () => {
  const { fetchUserDetails } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { closeBottomSheet } = useBottomSheet();
  const { loginWithDemoAccount } = useContext(AuthContext);
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordLogin, setPasswordLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  // Timer effect for resend OTP countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/send_verification_code`, {
        phoneNumber: phoneNumber,

        // phoneNumber: `+91${String(phoneNumber).trim()}`,
      });
      if (res.status === 200) {
        setStep(2);
        setResendTimer(60); // Add this line to initialize the timer
      }
    } catch (err) {
      alert("Sorry some error occured");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/resend_verification_code`, {
        phoneNumber: phoneNumber,
      });
      if (res.status === 200) {
        // Reset the OTP input
        setOtp("");
        // Reset the timer
        setResendTimer(60);
      }
    } catch (err) {
      alert("Sorry some error occurred while resending OTP");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    // Only allow numbers
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    // Limit to 4 digits
    if (value.length <= 4) {
      setOtp(value);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/otpverify`, {
        phoneNumber: phoneNumber,
        otp: otp,
      });
      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          const resp = await fetchUserDetails();
          if (resp) {
            setIsLoading(false);
            !resp.profilecompleted ? setStep(3) : closeBottomSheet();
          } else {
            setStep(1);
            alert("something went wrong");
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Replace with your actual password login endpoint
      const res = await axios.post(`${API_URL}/login`, {
        phoneNumber: phoneNumber,
        password: password,
      });

      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          const resp = await fetchUserDetails();
          if (resp) {
            setIsLoading(false);
            !resp.profilecompleted ? setStep(3) : closeBottomSheet();
          } else {
            setStep(1);
            alert("something went wrong");
          }
        }
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setPasswordLogin(!passwordLogin);
    // Reset fields when toggling
    setOtp("");
    setPassword("");
  };

  const isOtpComplete = otpDigits.every((digit) => digit !== "");

  const handlereferalsubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="text-white bg-[#1e1e1e] rounded-2xl overflow-hidden w-full max-w-md">
      <div className="flex justify-center my-4">
        <img className="w-2/6 h-auto object-cover" src="logo-gs.png" />
      </div>

      {step === 1 ? (
        <div className="px-3 pb-3">
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-xl sm:text-2xl mb-1 mt-12"
              >
                Login | Signup
              </label>
              <div className="relative w-full max-w-md">
                <PhoneInput
                  country={"in"}
                  value={phoneNumber}
                  onChange={(value) => {
                    console.log("Phone number:", value);
                    setPhoneNumber(value);
                  }}
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                    autoComplete: "off",
                    className:
                      "block bg-white w-full py-3 border text-black border-gray-300 rounded-lg focus:outline-none",
                  }}
                  disableFormatting={true}
                  containerClass="flex items-center rounded-lg bg-transparent"
                  buttonClass="border-r rounded-lg bg-transparent"
                  dropdownClass="bg-white text-black absolute z-10 max-h-60 overflow-y-auto"
                  enableSearch={true}
                  countryCodeEditable={false}
                  inputStyle={{
                    paddingLeft: "45px",
                    width: "100%",
                    height: "48px",
                    borderLeft: "none", // Remove left border of input
                  }}
                />
              </div>
            </div>
            <div className="flex  justify-between gap-3">
              <button
                type="submit"
                className="w-full bg-white gap-1 text-xs sm:text-xs hover:cursor-pointer text-black font-medium py-3 sm:px-4 px-2 rounded-lg transition duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                <MdSms size={18} />
                Get OTP on SMS
              </button>
              <button
                type="submit"
                className="w-full bg-white gap-1 text-[10px] sm:text-xs hover:cursor-pointer text-black font-medium py-3 sm:px-4 px-2 rounded-lg transition duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                <FaWhatsapp size={18} color="green" />
                Get OTP on Whatsapp
              </button>
            </div>
            <h5 className="text-center my-2 text-xs">OR</h5>
            <button
              onClick={() => {
                loginWithDemoAccount();
                closeBottomSheet();
              }}
              className="w-full bg-white text-xs hover:cursor-pointer text-black font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading ? "Sending Code..." : "Login with Demo ID"}
            </button>
          </form>
        </div>
      ) : step === 2 ? (
        <div className="px-3 pb-3">
          {!passwordLogin ? (
            // OTP Login Form
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="block text-xl font-medium mt-6 mb-1">
                  Enter verification code
                </label>
                <label className="block text-xs font-medium mb-3">
                  We have sent code to {`${phoneNumber}`}
                </label>
                <div className="flex justify-between gap-3">
                  <input
                    type="text"
                    maxLength="4"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full bg-black focus:outline-none text-white py-3 px-4 text-center text-xl font-bold rounded-lg"
                    placeholder="* * * *"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full text-xs font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center ${
                  otp.length === 4
                    ? "bg-white text-black hover:cursor-pointer"
                    : "bg-white text-black hover:cursor-pointer"
                }`}
                disabled={otp.length !== 4 || isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : null}
                {isLoading ? "Verifying..." : "Login"}
              </button>
              <div className="text-start mt-2">
                <div className="text-xs flex items-center justify-between">
                  {resendTimer > 0 ? (
                    <span className="text-gray-400 font-medium ml-1">
                      Resend OTP in {formatTime(resendTimer)}
                    </span>
                  ) : (
                    <div className="">
                      <button
                        type="button"
                        className="text-white font-medium ml-1"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                      >
                        Resend Code
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className="text-white font-bold ml-1"
                    onClick={toggleLoginMethod}
                    disabled={isLoading}
                  >
                    Use password
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Password Login Form
            <form onSubmit={handlePasswordLogin}>
              <div className="mb-4">
                <label className="block text-xl font-medium mt-6 mb-1">
                  Enter password
                </label>
                <label className="block text-xs font-medium mb-3">
                  Enter password for {`${phoneNumber}`}
                </label>
                <div className="flex justify-between gap-3">
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full bg-black focus:outline-none text-white py-3 px-4 text-sm rounded-lg"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-xs font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center text-black hover:cursor-pointer"
                disabled={!password || isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : null}
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <div className="text-start mt-2">
                <p className="text-xs flex items-center justify-center">
                  {/* <span className="text-gray-400 font-medium ml-1">
                    Forgot password?
                  </span> */}
                  <button
                    type="button"
                    className="text-white"
                    onClick={toggleLoginMethod}
                    disabled={isLoading}
                  >
                    Login with OTP
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      ) : step === 3 ? (
        <ProfilePage />
      ) : null}
    </div>
  );
};

export default PhoneOtpScreen;
