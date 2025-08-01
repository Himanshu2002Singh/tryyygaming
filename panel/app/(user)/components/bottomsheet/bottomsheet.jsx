import { RxCrossCircled } from "react-icons/rx";
import { useState, useEffect } from "react";

const BottomSheet = ({
  isVisible,
  onClose,
  Component,
  bgColor = "#1e1e1e",
  dragHandle = false,
  closeicon = true,
  fullscreen = false,
  preventClose = false, // New prop to prevent closing
}) => {
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);

  // Update isFullscreen when the prop changes
  useEffect(() => {
    setIsFullscreen(fullscreen);
  }, [fullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 z-[49] transition-opacity duration-300 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleClose}
      ></div>

      {/* Centered Bottom Sheet with dynamic sizing based on fullscreen state */}
      <div
        style={{ backgroundColor: bgColor }}
        className={`flex flex-col justify-between fixed z-50 rounded-lg shadow-xl overflow-y-auto transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${
          isFullscreen
            ? "inset-0 w-full h-full rounded-none"
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/5 md:w-4/7 lg:w-2/7 h-max"
        }`}
      >
        {/* Drag Handle */}
        {dragHandle && (
          <div className="flex justify-center pt-0 pb-4">
            <div className="w-full md:w-2/4 h-1.5 bg-[var(--color-primary)] rounded-b-full"></div>
          </div>
        )}
        {closeicon && (
          <div className="absolute left-2 top-2 flex gap-2">
            {/* Close Button */}
            <div
              className={`w-4 h-4 rounded-full text-[10px] text-black flex items-center justify-center ${
                preventClose
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 cursor-pointer"
              }`}
              onClick={handleClose}
            >
              {/* × */}
            </div>

            {/* Minimize Button */}
            <div
              className="w-4 h-4 rounded-full bg-yellow-400 text-[10px] text-black flex items-center justify-center cursor-pointer"
              onClick={() => setIsFullscreen(false)}
            >
              {/* – */}
            </div>

            {/* Maximize Button */}
            <div
              className="w-4 h-4 rounded-full bg-green-500 text-[10px] text-black flex items-center justify-center cursor-pointer"
              onClick={toggleFullscreen}
            ></div>
          </div>
        )}

        <div className={`flex justify-center ${isFullscreen ? "h-full" : ""}`}>
          {Component && <Component onClose={onClose} />}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
