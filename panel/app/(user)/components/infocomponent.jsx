"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { AuthContext } from "../context/authprovider";
import axios from "axios";
import API_URL from "@/config";

const Infocomponent = () => {
  const { user } = useContext(AuthContext);
  const [buttons, setButtons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchButtons = async () => {
      try {
        // Only fetch when we know the authentication status for sure
        // if (isLoading && user === undefined) {
        //   return; // Wait until user state is resolved
        // }
        let loginStatus;
        setIsLoading(true);
        if (user) {
          loginStatus = user ? "loggedin" : "notloggedin";
        } else {
          console.log("here");
          loginStatus = "notloggedin";
        }

        console.log("Current login status:", loginStatus); // Debugging log

        const response = await axios.get(
          `${API_URL}/admin/addbuttons/foruser/${loginStatus}`
        );

        setButtons(response.data.data);
      } catch (error) {
        console.error("Error fetching buttons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchButtons();
  }, [user]); // This effect depends on user

  return (
    <>
      {isLoading ? (
        <div className="bg-black"></div>
      ) : (
        <div className="bg-black mx-2 mt-[-12px]">
          {buttons.map((button, index) => (
            <Link href={`info/${button.id}`} key={index}>
              <div className="flex justify-between items-center bg-[var(--color-primary)] my-3 p-2 rounded-2xl">
                <div className="flex items-center gap-2 py-1">
                  <IoIosAddCircle className="text-black text-xl" />
                  <h3 className="text-black text-sm font-bold">
                    {button.heading}
                  </h3>
                </div>
                <FaArrowRight className="text-black text-xl" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Infocomponent;
