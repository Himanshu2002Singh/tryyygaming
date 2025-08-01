import React, { useState } from "react";

const CompleteProfile = () => {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="w-full flex items-center justify-center bg-[var(--color-secondary)]">
      <div className="w-full rounded-lg  text-white">
        <div className="bg-black rounded-xl text-white text-center p-4 text-lg font-bold">
          <h2 className="text-sm ">Complete your profile</h2>
        </div>
        <p className=" mt-4 mb-1 text-gray-400  text-sm">Name</p>
        <div className="relative">
          <input
            id="name"
            className=" block bg-black w-full pl-2 py-2 text-base text-white  rounded-lg  outline-none"
            placeholder="Enter your name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <p className=" mt-3 mb-1 text-gray-400  text-sm">Email</p>{" "}
        <div className="relative">
          <input
            id="email"
            className=" block bg-black w-full pl-2 py-2 text-base text-white  rounded-lg  outline-none"
            placeholder="Enter your email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className=" mt-3 mb-1 text-gray-400  text-sm">New Password</p>
        <div className="relative">
          <input
            id="password"
            className=" block bg-black w-full pl-2 py-2 text-base text-white  rounded-lg  outline-none"
            placeholder="Enter new password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className=" mt-3 mb-1 text-gray-400  text-sm">
          Confirm New Password{" "}
        </p>
        <div className="relative">
          <input
            id="confirmpassword"
            className=" block bg-black w-full text-base pl-2 py-2  text-white  rounded-lg  outline-none"
            placeholder="Enter confirm password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="w-full mt-5 py-2 rounded-xl hover:cursor-pointer bg-[var(--color-primary)] text-center">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
