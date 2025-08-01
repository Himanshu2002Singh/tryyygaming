import React from "react";

const Help = ({ activeWhatsapp }) => {
  const openWhatsappChat = () => {
    if (activeWhatsapp) {
      const url = `https://wa.me/${activeWhatsapp}`;
      window.open(url, "_blank");
    } else {
      // Handle cases where there's no active WhatsApp number
      alert(
        "No WhatsApp number available at the moment. Please try again later."
      ); // Or a more user-friendly solution
    }
  };
  return (
    <div className="w-full pb-3 overflow-hidden bg-[#393939]">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        Help
        <p className="text-[var(--color-text)]">
          Need Help! Feel free to contact.
        </p>
      </div>
      <div className="px-3 pt-3">
        <button
          onClick={openWhatsappChat}
          className="flex items-center justify-center gap-2  text-sm py-3 w-full rounded-lg text-black bg-[var(--color-primary)] cursor-pointer transition"
        >
          Chat with us on <img src="/whatsapp-icon.png" className="h-5" />
        </button>
      </div>
    </div>
  );
};

export default Help;
