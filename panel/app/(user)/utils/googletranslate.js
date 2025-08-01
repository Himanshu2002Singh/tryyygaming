"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const GoogleTranslate = () => {
  const [showTranslate, setShowTranslate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN"); // Default language
  const buttonRef = useRef(null);
  const translateContainerRef = useRef(null);
  const languageCodeRef = useRef("EN"); // Keep a ref to prevent translation of the code

  // Map of language codes to display codes
  const langMap = {
    en: "EN",
    ne: "NE",
    // hi: "HI",
    kn: "KN",
    ml: "ML",
    ta: "TA",
    te: "TE",
    // Add Nepali

    // Add more languages as needed
  };

  useEffect(() => {
    // Add CSS to hide Google Translate toolbar and customize the appearance
    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd, .VIpgJd-ZVi9od-ORHb-OEVmcd {
        display: none !important;
      }
      /* Hide the default Google translate trigger icon */
      .goog-te-gadget-icon, .goog-te-gadget-simple img {
        display: none !important;
      }
      /* Hide the default Google text */
      .goog-te-gadget-simple span {
        display: none !important;
      }
      /* Style the Google translate container */
      .goog-te-gadget-simple {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
        font-size: 0 !important;
        cursor: pointer;
      }
      /* Make the dropdown appear directly */
      #google_translate_element {
        display: inline-block;
        width: 100%;
      }
      /* Style the language dropdown */
      .goog-te-menu-value {
        display: none !important;
      }
      /* Force show the menu when our container is visible */
      #translate-container.show .goog-te-menu-frame {
        display: block !important;
        visibility: visible !important;
      }
      /* Prevent language code from being translated */
      .notranslate {
        white-space: nowrap !important;
      }
    `;
    document.head.appendChild(style);

    const addGoogleTranslateScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ne,kn,ml,ta,te", // Add more languages as needed
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // Set up a more reliable language change detector
        setupLanguageChangeDetector();
      }
    };

    // More robust language change detection
    const setupLanguageChangeDetector = () => {
      // Initial check for language
      detectCurrentLanguage();

      // Check for Google's translate cookie
      const checkCookie = () => {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
          cookie = cookie.trim();
          // Google Translate stores the selected language in a cookie
          if (cookie.startsWith("googtrans=")) {
            const langCode = cookie.split("/")[2];
            if (langCode && langMap[langCode]) {
              updateLanguage(langCode);
              return;
            }
          }
        }

        // Fallback to checking HTML lang attribute
        detectCurrentLanguage();
      };

      // Set interval to periodically check
      const langCheckInterval = setInterval(checkCookie, 1000);

      // Also monitor DOM changes that might indicate language changes
      const observer = new MutationObserver(() => {
        detectCurrentLanguage();
      });

      // Watch for changes to the html element's lang attribute
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });

      return () => {
        clearInterval(langCheckInterval);
        observer.disconnect();
      };
    };

    // Helper function to detect current language
    const detectCurrentLanguage = () => {
      const htmlElement = document.querySelector("html");
      if (htmlElement) {
        let lang = htmlElement.lang || "en";

        // Google sometimes adds a dash with country code
        if (lang.indexOf("-") !== -1) {
          lang = lang.split("-")[0].toLowerCase();
        }

        updateLanguage(lang);
      }
    };

    // Update language state and reference
    const updateLanguage = (lang) => {
      const displayCode = langMap[lang] || lang.toUpperCase().substring(0, 2);
      languageCodeRef.current = displayCode;
      setSelectedLanguage(displayCode);
    };

    addGoogleTranslateScript();

    // Fix for the body shifting up issue
    const fixBodyPosition = () => {
      if (document.body.style.top) {
        const top = document.body.style.top;
        document.body.style.top = "";
        window.scrollTo(0, parseInt(top || "0"));
      }
    };

    // Check periodically for the body position issue
    const interval = setInterval(fixBodyPosition, 500);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        translateContainerRef.current &&
        !translateContainerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowTranslate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle translate and trigger Google's dropdown
  const toggleTranslate = () => {
    setShowTranslate((prevState) => {
      const newState = !prevState;

      // Use setTimeout to ensure state update has propagated
      if (newState) {
        setTimeout(() => {
          const googleElement = document.querySelector(
            ".goog-te-gadget-simple"
          );
          if (googleElement) {
            googleElement.click();
          }
        }, 100);
      }

      return newState;
    });
  };

  return (
    <div className="relative">
      {/* Language Icon Button */}
      <button
        onClick={toggleTranslate}
        className="py-2 flex-col transition cursor-pointer z-10"
        ref={buttonRef}
        aria-label="Change language"
      >
        <div className="pointer-events-none">
          <Image
            src="/globe.gif"
            alt="Language"
            width={16}
            height={16}
            className="h-4"
            priority
          />
          <h6 className="text-[6px] notranslate">{languageCodeRef.current}</h6>
        </div>
      </button>
      {/* Google Translate Dropdown */}
      <div
        id="translate-container"
        ref={translateContainerRef}
        className={`absolute top-0 sm:top-4 sm:right-1.5 -mt-1 p-2 rounded-md transition-all duration-200 z-50 ${
          showTranslate ? "inline-block show" : "hidden"
        }`}
      >
        <div id="google_translate_element" className="bg-transparent"></div>
      </div>
    </div>
  );
};

export default GoogleTranslate;
