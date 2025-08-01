import React from "react";

const Help = () => {
  return (
    <div className="w-full pb-3 overflow-hidden bg-[#393939]">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        Help
        <p className="text-[var(--color-text)]">
          Need Help! Feel free to contact.
        </p>
      </div>
      <div className="px-3 pt-3">
        <button className="flex items-center justify-center gap-2  text-sm py-3 w-full rounded-lg text-black bg-[var(--color-primary)] cursor-pointer transition">
          Chat with us on <img src="/whatsapp-icon.png" className="h-5" />
        </button>
      </div>
    </div>
  );
};

export default Help;
