"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import API_URL from "@/config";
import Link from "next/link";

const CheckoutPanel = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Add this to your Navbar component

  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   // Fetch cart count when component mounts
  //   fetchCartCount();
  // }, []);

  // const fetchCartCount = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/user/cart`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     setCartCount(response.data.data.length);
  //   } catch (error) {
  //     console.error("Error fetching cart count:", error);
  //   }
  // };

  // // Then in your navbar JSX, add a cart icon with count
  // <Link href="/cart" className="relative">
  //   <FaShoppingCart size={20} />
  //   {cartCount > 0 && (
  //     <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
  //       {cartCount}
  //     </span>
  //   )}
  // </Link>

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/userpanel/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Transform the data to match our component structure
      const cartItems = response.data.data.map((item) => ({
        id: item.id,
        panelId: item.panelId,
        name: item.Panel?.name || "Unknown Panel",
        website: item.Panel?.website || "unknown.com",
        date: new Date(item.createdAt).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        rateType:
          item.rateType.charAt(0).toUpperCase() + item.rateType.slice(1),
        accountType: item.accountType,
        currency: item.currency,
        rate: item.rate.toString(),
        coins: item.coins.toLocaleString(),
        payableAmount: `₹ ${item.totalAmount.toLocaleString()}`,
        logo: item.Panel?.logo || item.Panel?.name?.substring(0, 2) || "UN",
        expanded: false,
      }));

      setItems(cartItems);
    } catch (error) {
      // console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const toggleItemExpand = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const removeItem = async (id) => {
    try {
      setIsProcessing(true);
      await axios.delete(`${API_URL}/userpanel/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setItems(items.filter((item) => item.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log("Error removing item:", error);
      // console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = async () => {
    try {
      if (items.length === 0) return;

      setIsProcessing(true);
      await axios.delete(`${API_URL}/userpanel/cart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setItems([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.log("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (items.length === 0) return;

      setIsProcessing(true);
      // Here you would implement the checkout logic
      // For example, redirect to a payment page or process the order

      toast.success("Proceeding to checkout...");
      // router.push("/checkout");
    } catch (error) {
      console.log("Error during checkout:", error);
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditItem = (panelId) => {
    // Redirect to the panel creation page with the panel ID
    router.push(`/paneldashboard/create/${panelId}`);
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen w-full mx-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-4 border-b border-gray-800">
        <h1 className="text-base ">Create Panel</h1>
        <div className="flex gap-4">
          <button
            className="text-red-500 text-xs hover:text-white transition-colors"
            onClick={clearAll}
            disabled={isProcessing || items.length === 0}
          >
            Clear All
          </button>
          <Link href="/paneldashboard">
            {" "}
            <button
              className="bg-[var(--color-primary)] text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors"
              // onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
            >
              Create Panel
            </button>
          </Link>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 flex flex-col gap-4 p-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-secondary)] rounded-md p-4 transition-all duration-200"
            >
              {/* Item Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-black text-xs font-bold">
                  <img src={item.logo} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-400 text-xs">{item.website}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Payable Amount</p>
                  <p className="text-yellow-500 font-semibold">
                    {item.payableAmount}
                  </p>
                </div>
              </div>

              {/* Date and Actions */}
              <div className="flex-col sm:flex-row sm:flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <FaCalendarAlt size={14} />
                  <span>{item.date}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-[var(--color-lgray)] text-gray-300 px-3 py-1 text-xs rounded transition-colors"
                    onClick={() => handleEditItem(item.panelId)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[var(--color-lgray)]  text-gray-300 px-3 py-1 text-xs rounded transition-colors"
                    onClick={() => removeItem(item.id)}
                    disabled={isProcessing}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-[var(--color-lgray)] text-gray-300 w-6 h-6 flex items-center justify-center text-xs rounded transition-colors"
                    onClick={() => toggleItemExpand(item.id)}
                  >
                    {item.expanded ? (
                      <FaChevronUp size={12} />
                    ) : (
                      <FaChevronDown size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Details - shown only when expanded */}
              {item.expanded && (
                <div className="grid grid-cols-3 gap-4 pt-2 text-sm border-t border-gray-800 animate-fadeIn">
                  <div>
                    <p className="text-gray-400 text-xs">Rate Type</p>
                    <p>{item.rateType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Account Type</p>
                    <p>{item.accountType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Currency</p>
                    <p>{item.currency}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs">Rate:</p>
                    <p>{item.rate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Coins:</p>
                    <p>{item.coins}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p className="mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push("/paneldashboard")}
              className="bg-yellow-500 text-sm text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors"
            >
              Browse Panels
            </button>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="mt-auto p-4">
        <button
          className={`${
            items.length > 0
              ? "bg-yellow-500 hover:bg-yellow-400"
              : "bg-gray-700 cursor-not-allowed"
          } text-black rounded-md py-3 w-full font-semibold flex items-center justify-center gap-2 transition-colors`}
          disabled={items.length === 0 || isProcessing}
          onClick={handleCheckout}
        >
          <FaShoppingCart size={18} />
          Check Out {items.length > 0 && `(${items.length})`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPanel;
