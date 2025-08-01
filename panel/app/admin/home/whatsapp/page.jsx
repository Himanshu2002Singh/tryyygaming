"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";
import { BsPhone, BsPlus, BsTrash2 } from "react-icons/bs";

export default function Whatsapp() {
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchWhatsappNumbers();
  }, []);

  const fetchWhatsappNumbers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/get/whatsapp`);
      setWhatsappNumbers(response.data.whatsapp);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching numbers:", err);
      setError("Failed to load WhatsApp numbers");
    } finally {
      setIsLoading(false);
    }
  };

  const addNumber = () => {
    if (!newNumber || newNumber.trim() === "") return;

    // Basic validation
    const numberPattern = /^\+?[0-9\s\-()]+$/;
    if (!numberPattern.test(newNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `${API_URL}/admin/add/whatsapp`,
        { whatsapp: newNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      )
      .then((response) => {
        setWhatsappNumbers([...whatsappNumbers, response.data.whatsapp]);
        setNewNumber("");
        setError(null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error adding number:", error);
        setError("Failed to add number");
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNumber();
    }
  };
  const toggleEnable = (id) => {
    setIsLoading(true); // Start loading
    axios
      .put(
        `${API_URL}/admin/update/whatsapp/${id}`,
        {},
        {
          // No request body needed
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      )
      .then((response) => {
        // Correctly update the state with the returned data
        fetchWhatsappNumbers();
        setError(null);
      })
      .catch((error) => {
        console.error("Error toggling number:", error);
        setError("Failed to update number status");
      })
      .finally(() => {
        setIsLoading(false); // Stop loading, regardless of success/failure
      });
  };

  const deleteNumber = (id) => {
    axios
      .delete(`${API_URL}/admin/delete/whatsapp/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      })
      .then(() => {
        setWhatsappNumbers(
          whatsappNumbers.filter((number) => number.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting number:", error);
        setError("Failed to delete number");
      });
  };

  return (
    <div className="bg-[#D9D9D9] text-black rounded-lg shadow-lg p-6 h-screen mx-auto">
      <div className="flex items-center mb-8">
        <BsPhone className="h-8 w-8 text-green-500 mr-3" />
        <h1 className="text-2xl font-bold text-black">WhatsApp Numbers</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Add new WhatsApp number (e.g., +1234567890)"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white w-full p-3 text-black border border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={addNumber}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-black px-4 rounded-r-md flex items-center justify-center transition-colors duration-300"
          >
            <BsPlus className="h-5 w-5" />
            <span className="ml-1 font-medium">Add</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-black">
          Enter the WhatsApp number with country code
        </p>
      </div>

      {isLoading && whatsappNumbers.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
      ) : whatsappNumbers.length === 0 ? (
        <div className="text-center py-8 text-black">
          No WhatsApp numbers added yet
        </div>
      ) : (
        <div className="bg-white  rounded-md">
          <div className="grid grid-cols-12 px-6 py-3 font-medium text-sm text-black border-b border-gray-200">
            <div className="col-span-7">Number</div>
            <div className="col-span-3 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <ul className="divide-y divide-gray-200">
            {whatsappNumbers.length > 0 &&
              whatsappNumbers?.map((number) => (
                <li
                  key={number.id}
                  className="px-6 py-4 grid grid-cols-12 items-center"
                >
                  <div className="col-span-7 font-medium text-black flex items-center">
                    <BsPhone className="h-4 w-4 text-green-500 mr-2" />
                    {number.number || number.whatsapp}
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <button
                      onClick={() => toggleEnable(number.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                        number.disable ? "bg-red-600" : "bg-green-500"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          number.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => deleteNumber(number.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <BsTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        {whatsappNumbers.length} number{whatsappNumbers.length !== 1 ? "s" : ""}{" "}
        configured
      </div>
    </div>
  );
}
