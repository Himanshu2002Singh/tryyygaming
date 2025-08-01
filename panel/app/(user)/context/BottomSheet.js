"use client";
import React, { createContext, useContext, useState } from "react";
import Bottomsheet from "../components/bottomsheet/bottomsheet";

export const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ComponentToRender, setComponentToRender] = useState(null);
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [closeicon, setCloseIcon] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [preventClose, setPreventClose] = useState(false); // New state

  const openBottomSheet = (Component, options = {}) => {
    console.log("openBottomSheet called with component:", Component);
    setComponentToRender(() => Component);
    setBgColor(options.bgColor || "#1e1e1e");
    setCloseIcon(options.closeicon !== undefined ? options.closeicon : true);
    setIsVisible(true);
    setFullscreen(options.fullscreen || false);
    setPreventClose(options.preventClose || false); // New option

    return Promise.resolve();
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    setComponentToRender(null);
    setPreventClose(false); // Reset prevent close
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <Bottomsheet
        isVisible={isVisible}
        onClose={closeBottomSheet}
        Component={ComponentToRender}
        bgColor={bgColor}
        closeicon={closeicon}
        fullscreen={fullscreen}
        preventClose={preventClose} // New prop
      />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};
