"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { IoIosMove } from "react-icons/io";
import { FaChevronCircleLeft, FaFileUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import html2canvas from "html2canvas-pro";
import { BsArrowLeft, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiChevronRight } from "react-icons/hi";
import axios from "axios";
import API_URL from "@/config";
import { AuthContext } from "../context/authprovider";
import { useBottomSheet } from "../context/BottomSheet";
import DemoUseralert from "../components/demouser";
import LoginAlert from "../components/notloggedalert";
const CustomPosters = () => {
  const { user, Logout, loginWithDemoAccount } = useContext(AuthContext);
  const { openBottomSheet } = useBottomSheet();

  // Modified flow state - removed selectTemplate step
  const [currentStep, setCurrentStep] = useState("selectTemplateCategory");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel state for each category
  const [activeSlides, setActiveSlides] = useState({});

  // Template categories and images from API
  const [templateCategories, setTemplateCategories] = useState([]);
  const [templateImages, setTemplateImages] = useState({});

  // Fetch poster data from API
  useEffect(() => {
    const fetchPosters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/admin/posters`);
        if (response.data.success) {
          const categories = response.data.data;

          // Set template categories
          setTemplateCategories(
            categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              previewImage: cat.images[0]?.src || "/api/placeholder/400/300",
              description: `${cat.name} templates collection`,
              coinCost: cat.coinCost || 0,
            }))
          );

          // Set template images
          const imagesMap = {};
          categories.forEach((cat) => {
            // Only include active images
            const activeImages = cat.images
              .filter((img) => img.isActive)
              .map((img) => img.src);

            // If no active images, use placeholder
            imagesMap[cat.id] =
              activeImages.length > 0
                ? activeImages
                : ["/api/placeholder/600/400"];
          });
          setTemplateImages(imagesMap);

          // Initialize active slides state
          const initialActiveSlides = {};
          categories.forEach((cat) => {
            initialActiveSlides[cat.id] = 0;
          });
          setActiveSlides(initialActiveSlides);

          // Initialize focused indices
          const initialFocusedIndices = {};
          categories.forEach((cat) => {
            initialFocusedIndices[cat.id] = 0;
          });
          setFocusedIndices(initialFocusedIndices);
        } else {
          setError("Failed to fetch posters");
        }
      } catch (error) {
        console.error("Error fetching posters:", error);
        setError("Error loading posters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosters();
  }, []);

  // Auto-scrolling effect
  useEffect(() => {
    // Set up auto-scrolling timer
    const autoScrollTimer = setInterval(() => {
      // Auto-scroll each category
      setFocusedIndices((prev) => {
        const newIndices = { ...prev };

        // Update each category's focused index
        templateCategories.forEach((category) => {
          const categoryId = category.id;
          const totalImages = templateImages[categoryId]?.length || 0;
          if (totalImages > 0) {
            newIndices[categoryId] = (newIndices[categoryId] + 1) % totalImages;
          }
        });

        return newIndices;
      });
    }, 3000); // 3 seconds interval

    // Clean up timer on component unmount
    return () => clearInterval(autoScrollTimer);
  }, [templateCategories, templateImages]); // Depend on the actual data

  // Form data state
  const [formData, setFormData] = useState({
    logo: null,
    websiteUrl: "",
    phoneNumber: "",
    instagramLink: "",
    telegramLink: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);

  // Elements for positioning
  const [elements, setElements] = useState([
    { id: "logo", label: "Logo", position: { x: 50, y: 50 }, active: false },
    {
      id: "website",
      label: "Website",
      position: { x: 50, y: 150 },
      active: false,
    },
    { id: "phone", label: "Phone", position: { x: 50, y: 250 }, active: false },
    {
      id: "instagram",
      label: "Instagram",
      position: { x: 70, y: 50 },
      active: false,
    },
    {
      id: "telegram",
      label: "Telegram",
      position: { x: 30, y: 60 },
      active: false,
    },
  ]);
  const imageRef = useRef(null);
  const downloadRef = useRef(null);

  // Add this near the top of your component, after your other imports

  // Handle carousel navigation

  // Select specific template image and move to form step
  const handleSelectTemplate = (categoryId, imageIndex) => {
    setSelectedTemplate({
      templateId: categoryId,
      imageIndex,
      src: templateImages[categoryId][imageIndex],
    });
    setCurrentStep("fillForm");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setFormData((prev) => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Create an independent state for each category's focused card
  const [focusedIndices, setFocusedIndices] = useState(
    Object.fromEntries(templateCategories.map((category) => [category.id, 0]))
  );

  // Handle navigation within a specific category's carousel
  const handleCarouselNav = (categoryId, direction) => {
    setActiveSlides((prev) => {
      const currentIndex = prev[categoryId];
      const totalSlides = templateImages[categoryId].length;
      const newIndex = (currentIndex + direction + totalSlides) % totalSlides;
      return { ...prev, [categoryId]: newIndex };
    });
  };

  // Get card style for stacked effect
  const getCardStyle = (categoryId, index) => {
    const focusedIndex = focusedIndices[categoryId];
    const totalImages = templateImages[categoryId].length;
    const position = (index - focusedIndex + totalImages) % totalImages;

    // Center card (active)
    if (position === 0) {
      return {
        zIndex: 30,
        transform: "scaleX(0.9) scaleY(1.1) translateY(0)", // Taller but narrower
        opacity: 1,
        filter: "brightness(1)",
        pointerEvents: "auto",
      };
    }
    // Card to the left
    else if (position === totalImages - 1) {
      return {
        zIndex: 20,
        transform: "scale(0.85) translateY(-20px) translateX(-40px)",
        opacity: 0.7,
        filter: "brightness(0.9)",
        pointerEvents: "none",
      };
    }
    // Card to the right
    else if (position === 1) {
      return {
        zIndex: 20,
        transform: "scale(0.85) translateY(-20px) translateX(40px)",
        opacity: 0.7,
        filter: "brightness(0.9)",
        pointerEvents: "none",
      };
    }
    // Other cards (hidden)
    else {
      return {
        zIndex: 10,
        transform: "scale(0.7) translateY(-30px)",
        opacity: 0,
        pointerEvents: "none",
      };
    }
  };

  // Navigate between cards in a stack
  const goToNext = (categoryId) => {
    setFocusedIndices((prev) => {
      const currentIndex = prev[categoryId];
      const totalImages = templateImages[categoryId].length;
      return { ...prev, [categoryId]: (currentIndex + 1) % totalImages };
    });
  };

  const goToPrev = (categoryId) => {
    setFocusedIndices((prev) => {
      const currentIndex = prev[categoryId];
      const totalImages = templateImages[categoryId].length;
      return {
        ...prev,
        [categoryId]: (currentIndex - 1 + totalImages) % totalImages,
      };
    });
  };

  const handlePosterUsageAndDownload = async () => {
    try {
      // First, call the poster usage API
      const usePosterResponse = await axios.post(
        `${API_URL}/admin/posters/use`,
        {
          posterId: selectedTemplate.templateId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based authentication
          },
        }
      );

      // If API call is successful, proceed with download
      if (usePosterResponse.data.success) {
        // Update user's coin balance in context or state
        // This depends on how you manage user state
        // For example:
        // updateUserCoins(usePosterResponse.data.remainingCoins);

        // Proceed with download
        await handleDownload();
      }
    } catch (error) {
      console.error("Error using poster:", error);

      // Handle specific error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 400:
            // Insufficient coins
            openBottomSheet(InsufficientCoinsAlert, {
              requiredCoins: selectedTemplate.coinCost,
              userCoins: user.coins,
            });
            break;
          case 404:
            // Poster not found
            setError("Selected poster is no longer available");
            break;
          default:
            setError("Failed to use poster. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  // Handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setCurrentStep("positionElements");
    // Activate all elements
    setElements((prev) => prev.map((el) => ({ ...el, active: true })));
  };

  // Start dragging an element
  const startDrag = (id, e) => {
    setDragging(id);
    e.preventDefault();
  };

  // Handle element dragging// Handle element dragging for both mouse and touch
  const handleDrag = (e) => {
    if (!dragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    let x, y;

    // Handle touch events
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    }
    // Handle mouse events
    else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    setElements((prev) =>
      prev.map((el) =>
        el.id === dragging ? { ...el, position: { x, y } } : el
      )
    );
  };

  // Stop dragging
  const stopDrag = () => {
    setDragging(null);
  };

  // Handle image download - actual implementation using html2canvas
  const preloadBackgroundImage = () => {
    return new Promise((resolve, reject) => {
      if (!selectedTemplate || !selectedTemplate.src) {
        reject("No template selected");
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = (err) => reject("Failed to load background image");
      img.src = selectedTemplate.src;
    });
  };

  // Handle image download with improved error handling
  const handleDownload = async () => {
    if (!downloadRef.current) {
      setDownloadError("Download reference not available");
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Ensure background image is loaded
      await preloadBackgroundImage();

      // Apply explicit background before capture
      const originalBackgroundImage = downloadRef.current.style.backgroundImage;
      downloadRef.current.style.backgroundImage = `url(${selectedTemplate.src})`;

      const canvas = await html2canvas(downloadRef.current, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        backgroundColor: null,
        onclone: (clonedDoc, clonedElement) => {
          // Ensure background is visible in the cloned element
          clonedElement.style.backgroundImage = `url(${selectedTemplate.src})`;
          clonedElement.style.backgroundSize = "cover";
          clonedElement.style.backgroundPosition = "center";
          clonedElement.style.backgroundRepeat = "no-repeat";
        },
      });

      // Restore original style
      downloadRef.current.style.backgroundImage = originalBackgroundImage;

      // Create and trigger download
      const link = document.createElement("a");
      link.download = "customized-banner.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
      setDownloadError(err.toString() || "Failed to generate image");
    } finally {
      setIsDownloading(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "selectTemplateCategory":
        return (
          <div className="space-y-8 relative z-10">
            {" "}
            {/* Lower z-index than footer */}
            <h2 className="text-sm sm:text-xl font-bold text-center">
              Select a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {templateCategories.map((category) => (
                <div key={category.id} className="relative px-2">
                  <div className="max-w-md mx-auto relative h-64">
                    {/* Stack of images for this category */}
                    <div className="relative w-full h-full">
                      {templateImages[category.id].map((image, imageIndex) => (
                        <div
                          key={`${category.id}-${imageIndex}`}
                          className="absolute top-0 left-0 right-0 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 border-2 border-gray-200 hover:border-blue-500"
                          style={{
                            ...getCardStyle(category.id, imageIndex),
                            transition: "all 0.5s ease",
                          }}
                        >
                          <div className="h-48">
                            {" "}
                            {/* Fixed height that works with your layout */}
                            <img
                              src={image}
                              alt={`${category.name} template ${
                                imageIndex + 1
                              }`}
                              className="w-full h-max object-cover cursor-pointer"
                              onClick={() => {
                                user && !user.isDemo
                                  ? handleSelectTemplate(
                                      category.id,
                                      imageIndex
                                    )
                                  : openBottomSheet(LoginAlert, {
                                      closeicon: false,
                                    });
                              }}
                            />
                          </div>
                          {/* Space for padding if needed */}
                          <div className="p-2"></div>
                        </div>
                      ))}
                    </div>

                    {/* Category name label below stack */}
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <h2 className="text-sm font-bold text-white">
                        {category.coinCost} coins
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "fillForm":
        return (
          <div className="space-y-6 pb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentStep("selectTemplateCategory")}
                className="text-[var(--color-primary)] font-medium flex items-center"
              >
                <BsArrowLeft />
              </button>
              <h2 className="text-lg mx-auto  font-bold">
                Customize Your Template
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img
                  src={selectedTemplate?.src}
                  alt="Selected template"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
              </div>

              <div className="md:w-1/2">
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload Logo
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FaFileUpload size={24} className="text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="websiteUrl"
                      className="block text-sm font-medium mb-1"
                    >
                      Website URL
                    </label>
                    <input
                      type="text"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (123) 456-7890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instagramLink"
                      className="block text-sm font-medium mb-1"
                    >
                      Instagram Link
                    </label>
                    <input
                      type="url"
                      id="instagramLink"
                      name="instagramLink"
                      value={formData.instagramLink}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="telegramLink"
                      className="block text-sm font-medium mb-1"
                    >
                      Telegram Link
                    </label>
                    <input
                      type="url"
                      id="telegramLink"
                      name="telegramLink"
                      value={formData.telegramLink}
                      onChange={handleInputChange}
                      placeholder="https://t.me/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[var(--color-primary)] text-black  font-medium rounded-md transition-colors"
                  >
                    Continue to Positioning
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case "positionElements":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentStep("fillForm")}
                className="text-blue-600 font-medium flex items-center"
              >
                ←
              </button>
              {/* <h2 className="text-2xl font-bold">Position Your Elements</h2> */}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full relative">
                <div
                  ref={downloadRef}
                  className="relative border-2 rounded-lg overflow-hidden"
                  onMouseMove={handleDrag}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onTouchMove={handleDrag}
                  onTouchEnd={stopDrag}
                >
                  <img
                    ref={imageRef}
                    src={selectedTemplate?.src}
                    alt="Selected template"
                    className="w-full"
                  />

                  {elements
                    .filter((el) => el.active)
                    .map((el) => (
                      <div
                        key={el.id}
                        className={`absolute bg-black cursor-move flex items-center justify-center ${
                          dragging === el.id
                            ? "z-49 ring-2 ring-blue-500"
                            : "z-10"
                        }`}
                        style={{
                          left: `${el.position.x}px`,
                          top: `${el.position.y}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={(e) => startDrag(el.id, e)}
                        onTouchStart={(e) => startDrag(el.id, e)}
                      >
                        {el.id === "logo" && logoPreview ? (
                          <div className="h-12 w-12 flex items-center justify-center">
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className={`
                          px-3 py-2 rounded text-xs sm:text-base
                          ${el.id === "logo" ? "bg-black" : "bg-black"}
                          ${
                            dragging === el.id
                              ? "border border-dashed border-blue-500"
                              : ""
                          }
                        `}
                          >
                            {el.id === "logo" && (
                              <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-xs">
                                LOGO
                              </div>
                            )}
                            {el.id === "website" && formData.websiteUrl}
                            {el.id === "phone" && formData.phoneNumber}
                            {el.id === "instagram" && (
                              <div className="flex items-center">
                                <span className="font-medium">Instagram:</span>
                                <span className="ml-1">
                                  {formData.instagramLink}
                                </span>
                              </div>
                            )}
                            {el.id === "telegram" && (
                              <div className="flex  items-center">
                                <span className="font-medium">Telegram:</span>
                                <span className="ml-1">
                                  {formData.telegramLink}
                                </span>
                              </div>
                            )}
                            {/* <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1 rounded-full">
                              <IoIosMove size={12} />
                            </div> */}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                <div className="mt-6 mb-5 flex justify-center">
                  <button
                    onClick={() => {
                      // Check user authentication and demo status
                      if (!user) {
                        openBottomSheet(LoginAlert, { closeicon: false });
                        return;
                      }

                      if (user.isDemo) {
                        openBottomSheet(DemoUseralert, { closeicon: false });
                        return;
                      }

                      // Check if the selected template has a coin cost
                      const templateCoinCost = selectedTemplate?.coinCost || 0;

                      // Check if user has enough coins
                      if (user.coins < templateCoinCost) {
                        // Open bottom sheet for insufficient coins
                        openBottomSheet(InsufficientCoinsAlert, {
                          requiredCoins: templateCoinCost,
                          userCoins: user.coins,
                        });
                        return;
                      }

                      // Proceed with poster usage and download
                      handlePosterUsageAndDownload();
                    }}
                    className="flex items-center space-x-2 py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                  >
                    <FaDownload size={18} />
                    <span>Download Image</span>
                  </button>
                </div>
              </div>

              {/* <div className="lg:w-1/3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-lg mb-4">
                    Positioning Instructions
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded">
                        1
                      </span>
                      <span>
                        Drag each element to position it on the template
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded">
                        2
                      </span>
                      <span>Elements are centered on the cursor position</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded">
                        3
                      </span>
                      <span>
                        When satisfied with the positioning, click the Download
                        button
                      </span>
                    </li>
                  </ul>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">Element Status</h4>
                    <ul className="space-y-2">
                      {elements
                        .filter((el) => el.active)
                        .map((el) => (
                          <li
                            key={el.id}
                            className="flex items-center justify-between"
                          >
                            <span className="capitalize">{el.label}</span>
                            <span className="text-green-600 flex items-center">
                              <FaCheckCircle size={16} className="mr-1" />
                              Positioned
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[var(--color-secondary)] w-full h-6/6 mb-20 overflow-y-auto max-w-6xl mx-auto px-4 py-8">
      {/* <div className="mb-8 pb-4 border-b">
        <h1 className="text-xl font-bold text-center">
          Banner Template Customizer
        </h1>
        <div className="mt-4 flex justify-center">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "selectTemplateCategory"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              1
            </div>
            <div
              className={`w-12 h-1 ${
                currentStep !== "selectTemplateCategory"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-gray-200 text-black"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "fillForm"
                  ? "bg-[var(--color-primary)] text-black"
                  : currentStep === "positionElements"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              2
            </div>
            <div
              className={`w-12 h-1 ${
                currentStep === "positionElements"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-gray-200 text-black"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "positionElements"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              3
            </div>
          </div>
        </div>
      </div> */}

      {renderStepContent()}
    </div>
  );
};

export default CustomPosters;
