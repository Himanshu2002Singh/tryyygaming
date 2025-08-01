"use client";
import React, { createContext, useContext, useState } from "react";
import BottomSheet from "../components/bottomsheet/bottomsheetadmin";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ComponentToRender, setComponentToRender] = useState(null);
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [closeicon, setCloseIcon] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const openBottomSheet = (Component, options = {}) => {
    console.log("openBottomSheet called with component:", Component);
    setComponentToRender(() => Component);
    setBgColor(options.bgColor || "#1e1e1e");
    setCloseIcon(options.closeicon !== undefined ? options.closeicon : true);
    setIsVisible(true);
    setFullscreen(options.fullscreen || false); // NEW LINE

    return Promise.resolve();
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    setComponentToRender(null);
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet
        isVisible={isVisible}
        onClose={closeBottomSheet}
        Component={ComponentToRender}
        bgColor={bgColor}
        closeicon={closeicon}
        fullscreen={fullscreen} // NEW PROP
      />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};
