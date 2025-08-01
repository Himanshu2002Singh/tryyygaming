"use client";
import React, { createContext, useContext, useState } from "react";

// Create context
const NavContext = createContext();

export const NavProvider = ({ children }) => {
  const [selected, setSelected] = useState("home");
  return (
    <NavContext.Provider value={{ selected, setSelected }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
