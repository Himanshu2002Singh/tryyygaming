import API_URL from "@/config";
import { useContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/authprovider";
import axios from "axios";
import { BottomSheetContext } from "../../context/BottomSheet";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProfilePage({}) {
  const { fetchUserDetails, user, setUser } = useContext(AuthContext);
  const { closeBottomSheet } = useContext(BottomSheetContext);
  const [loading, setLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSent, setOtpSent] = useState({ email: false, phone: false });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    alternateNumber: "",
    username: "",
    password: "",
  });

  // Load user data when component mounts
  // Initial form data setup
  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        // Only update if fields are empty or if this is initial load
        name: prevFormData.name || user.name || "",
        email: prevFormData.email || user.email || "",
        alternateNumber:
          prevFormData.alternateNumber ||
          (user.alternateNumber ? String(user.alternateNumber) : ""),
        username: prevFormData.username || user.username || "",
        password: prevFormData.password || user.password || "",
      }));
    }
  }, [user]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/profile-update`,
        {
          name: formData.name,
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        await fetchUserDetails();
        closeBottomSheet();
      } else if (
        response.status === 400 &&
        response.data.message === "Username already taken"
      ) {
        toast.error("Username already taken"); // Specific error message
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Send email OTP
  const sendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/send_email_otp`,
        { email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setOtpSent({ ...otpSent, email: true });
        setVerifyingEmail(true);
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast.error(error.response?.data?.error || "Failed to send email OTP");
    }
  };

  // Verify email OTP
  const verifyEmailOtp = async (e) => {
    e.preventDefault();
    if (!emailOtp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/verify_email_otp`,
        { email: formData.email, otp: emailOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Email verified successfully");
        setVerifyingEmail(false);

        // Correctly update user without replacing the entire object
        setUser((prevUser) => ({
          ...prevUser,
          emailverified: true,
        }));

        // Keep the OTP sent state updated
        setOtpSent((prev) => ({ ...prev, email: false }));

        // DO NOT call fetchUserDetails() here as it may reset your form
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error(error.response?.data?.error || "Failed to verify email");
    }
  };

  // Send alternate phone OTP
  const sendPhoneOtp = async () => {
    if (!formData.alternateNumber) {
      toast.error("Please enter an alternate phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/send_alternate_number`,
        { phoneNumber: formData.alternateNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP sent to your alternate number");
        setOtpSent({ ...otpSent, phone: true });
        setVerifyingPhone(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(
          "This number is already associated with another user's account"
        );
      }
      console.error("Error sending phone OTP:", error);
      // toast.error(error.response?.data?.error || "Failed to send phone OTP");
    }
  };

  // Verify alternate phone OTP
  const verifyPhoneOtp = async () => {
    if (!phoneOtp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/verify_alternate_number_otp`,
        { alternateNumber: formData.alternateNumber, otp: phoneOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Alternate number verified successfully");
        setVerifyingPhone(false);

        // Correctly update user state
        setUser((prevUser) => ({
          ...prevUser,
          alternateNumberverified: true,
        }));

        setOtpSent((prev) => ({ ...prev, phone: false }));
        // DO NOT call fetchUserDetails() here
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      toast.error(
        error.response?.data?.error || "Failed to verify phone number"
      );
    }
  };
  return (
    <div className="flex justify-center items-center px-3 pb-3">
      <ToastContainer />
      <div className="rounded-lg shadow-lg w-full">
        <h2 className="text-2xl text-start">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2 text-xs">
          <div>
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block bg-white w-full pl-2 py-3 border text-black border-gray-300 rounded-lg focus:ring-0"
              required
            />
          </div>

          <div>
            <label className="block">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block bg-white w-full pl-2 py-3 border text-black border-gray-300 rounded-lg focus:ring-0"
              required
            />
          </div>
          <div>
            <label className="block">Password</label>

            <input
              type="text"
              name="password"
              className=" block bg-white text-xs w-full pl-2 pr-3 py-3  text-black  rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              // placeholder="your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block">Email</label>
            <div className="flex items-center gap-2">
              <div className="w-9/12">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full bg-white pl-2 py-3 border text-black border-gray-300 rounded-lg focus:ring-0"
                />
                {/* {user?.emailVerified ? (
                <span className="text-green-500 text-xs whitespace-nowrap">
                  ✓ Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendEmailOtp}
                  className="bg-[var(--color-primary)] w-3/12 text-black px-2 py-3 rounded text-xs whitespace-nowrap"
                >
                  Verify
                </button>
              )} */}
              </div>
              {user?.emailverified ? (
                <span className="text-green-500 text-xs whitespace-nowrap">
                  ✓ Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendEmailOtp}
                  className="bg-[var(--color-primary)] w-3/12 text-black px-2 py-3 rounded text-xs whitespace-nowrap"
                >
                  Verify
                </button>
              )}
            </div>
            {verifyingEmail && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="w-9/12 border border-white bg-black focus:outline-none text-white py-2 px-4 text-center text-lg font-bold rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={verifyEmailOtp}
                    className="bg-green-500 w-3/12 text-black px-2 py-3 rounded text-xs whitespace-nowrap"
                  >
                    Submit
                  </button>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  OTP sent to {formData.email}.
                  <button
                    type="button"
                    onClick={sendEmailOtp}
                    className="text-blue-500 ml-1"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block">Alternate Phone</label>
            <div className="flex items-center gap-2">
              <div className="w-9/12">
                {/* Ensure value is a string and provide a default empty string */}
                <PhoneInput
                  country={"in"}
                  value={formData.alternateNumber || ""}
                  onChange={(value) => {
                    setFormData({ ...formData, alternateNumber: value });
                  }}
                  inputProps={{
                    name: "alternateNumber",
                    autoComplete: "off",
                    className:
                      "block bg-white w-full py-3 border text-black border-gray-300 rounded-lg focus:outline-none",
                  }}
                  disableFormatting={true}
                  containerClass="flex items-center rounded-lg bg-transparent"
                  buttonClass="border-r rounded-lg bg-transparent"
                  dropdownClass="bg-white text-black"
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
              {user?.alternateNumberverified ? (
                <span className="text-green-500 text-xs whitespace-nowrap">
                  ✓ Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendPhoneOtp}
                  className="bg-[var(--color-primary)] w-3/12 text-black px-2 py-3 rounded text-xs whitespace-nowrap"
                >
                  Verify
                </button>
              )}
            </div>

            {verifyingPhone && (
              <div className="my-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="w-9/12 border border-white bg-black focus:outline-none text-white py-2 px-4 text-center text-xl font-bold rounded-lg"
                    placeholder="* * * *"
                  />
                  <button
                    type="button"
                    onClick={verifyPhoneOtp}
                    className="bg-green-500 w-3/12 text-black px-2 py-3 rounded text-xs whitespace-nowrap"
                  >
                    Submit
                  </button>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  OTP sent to {formData.alternateNumber}.
                  <button
                    type="button"
                    onClick={sendPhoneOtp}
                    className="text-blue-500 ml-1"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-[var(--color-primary)] gap-1 hover:cursor-pointer text-black font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
