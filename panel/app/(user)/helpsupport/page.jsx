"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { BsArrowLeft, BsSend, BsChevronRight } from "react-icons/bs";
import { AuthContext } from "../context/authprovider";
import API_URL from "@/config";

export default function FullScreenChatSupport() {
  const { user } = useContext(AuthContext);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! How can I assist you today? Please select an option:",
      isCategories: true 
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [awaitingUsername, setAwaitingUsername] = useState(false);
  const [awaitingIssueDetails, setAwaitingIssueDetails] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // FAQ data structure
  const faqData = {
    "Account Statement": [
      {
        question: "How can I check my account balance?",
        answer: "You can view your account balance in the 'Wallet' section of your account dashboard."
      },
      {
        question: "Where can I see my transaction history?",
        answer: "Go to 'Account Statement' in your profile to view all transactions."
      },
      {
        question: "How do I download my account statement?",
        answer: "In the 'Account Statement' section, click 'Download' and select the date range."
      }
    ],
    "Deposit Issues": [
      {
        question: "My deposit is not reflecting in my account",
        answer: "Please share your transaction ID and we'll check the status for you."
      },
      {
        question: "What are the deposit methods available?",
        answer: "We accept UPI, Net Banking, Credit/Debit Cards, and Cryptocurrency."
      },
      {
        question: "Is there a minimum deposit amount?",
        answer: "Yes, the minimum deposit amount is ₹500."
      }
    ],
    "Withdrawal Problems": [
      {
        question: "Why is my withdrawal pending?",
        answer: "Withdrawals typically take 5-15 minutes for crypto and up to 24 hours for bank transfers."
      },
      {
        question: "What is the minimum withdrawal amount?",
        answer: "The minimum withdrawal amount is ₹1000."
      },
      {
        question: "My withdrawal failed, what should I do?",
        answer: "Please provide your username and transaction ID for us to investigate."
      }
    ],
    "Technical Support": [
      {
        question: "The app is not working properly",
        answer: "Try clearing your cache or reinstalling the app. If issue persists, let us know."
      },
      {
        question: "I can't login to my account",
        answer: "Please try resetting your password or contact us with your username."
      },
      {
        question: "The website is not loading",
        answer: "Check your internet connection or try accessing from a different device."
      }
    ]
  };

  const saveMessageToAPI = (message) => {
    fetch(`${API_URL}/user/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...message,
        userId: user?.id,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      }),
    }).catch(error => {
      console.error("Error saving message:", error);
    });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    const newConversationId = crypto.randomUUID();
    setConversationId(newConversationId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputText.trim() === "") return;

    const userMessage = { sender: "user", text: inputText };
    setMessages(prev => [...prev, userMessage]);
    saveMessageToAPI(userMessage);
    setInputText("");

    if (awaitingUsername) {
      setAwaitingUsername(false);
      setAwaitingIssueDetails(true);
      const botResponse = { 
        sender: "bot", 
        text: "Thank you for sharing your username. Please describe your issue in detail:",
        showInput: true
      };
      setMessages(prev => [...prev, botResponse]);
      saveMessageToAPI(botResponse);
      return;
    }

    if (awaitingIssueDetails) {
      setAwaitingIssueDetails(false);
      const botResponse = { 
        sender: "bot", 
        text: "We've received your issue details. Our support team will contact you shortly. For immediate assistance, you can also contact us on WhatsApp.",
        isWhatsApp: true
      };
      setMessages(prev => [...prev, botResponse]);
      saveMessageToAPI(botResponse);
      return;
    }

    // For normal messages
    const botResponse = { 
      sender: "bot", 
      text: "We've received your message. Would you like to browse our FAQ for quick answers?",
      isCategories: true
    };
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      saveMessageToAPI(botResponse);
    }, 1000);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const userMessage = { sender: "user", text: category };
    const botResponse = { 
      sender: "bot", 
      text: `You selected: ${category}. Please choose your query:`,
      isQuestions: true,
      questions: faqData[category]
    };
    setMessages(prev => [...prev, userMessage, botResponse]);
    saveMessageToAPI(userMessage);
    saveMessageToAPI(botResponse);
  };

  const handleQuestionSelect = (questionObj) => {
    setSelectedQuestion(questionObj);
    const userMessage = { sender: "user", text: questionObj.question };
    const botResponse = { 
      sender: "bot", 
      text: questionObj.answer,
      showOptions: true
    };
    setMessages(prev => [...prev, userMessage, botResponse]);
    saveMessageToAPI(userMessage);
    saveMessageToAPI(botResponse);
  };

  const showCategories = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    const botResponse = { 
      sender: "bot", 
      text: "Please select a category:",
      isCategories: true
    };
    setMessages(prev => [...prev, botResponse]);
    saveMessageToAPI(botResponse);
  };

  const requestCustomSupport = () => {
    const botResponse = { 
      sender: "bot", 
      text: "To help you better, please provide your username:",
      showInput: true
    };
    setMessages(prev => [...prev, botResponse]);
    saveMessageToAPI(botResponse);
    setAwaitingUsername(true);
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when needed
  useEffect(() => {
    if (awaitingUsername || awaitingIssueDetails) {
      inputRef.current?.focus();
    }
  }, [awaitingUsername, awaitingIssueDetails]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ paddingBottom: "80px" }}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                
                {msg.isCategories && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.keys(faqData).map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="p-2 border border-gray-600 rounded-md hover:bg-gray-700 text-sm text-left transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                    <button
                      onClick={requestCustomSupport}
                      className="p-2 rounded-md text-sm text-left md:col-span-2 bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      Need Custom Support
                    </button>
                  </div>
                )}
                
                {msg.isQuestions && (
                  <div className="mt-3 space-y-2">
                    {msg.questions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuestionSelect(item)}
                        className="block w-full p-2 border border-gray-600 rounded-md hover:bg-gray-700 text-sm text-left transition-colors"
                      >
                        {item.question}
                      </button>
                    ))}
                    <button
                      onClick={showCategories}
                      className="mt-2 text-gray-400 text-sm flex items-center hover:text-gray-300 transition-colors"
                    >
                      <BsArrowLeft className="mr-1" /> Back to main menu
                    </button>
                  </div>
                )}
                
                {msg.showOptions && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={showCategories}
                      className="p-2 border border-gray-600 rounded-md hover:bg-gray-700 text-sm w-full text-left transition-colors"
                    >
                      Back to main menu
                    </button>
                    <button
                      onClick={requestCustomSupport}
                      className="p-2 rounded-md text-sm w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      I need more help
                    </button>
                  </div>
                )}
                
                {msg.showInput && (
                  <div className="mt-3">
                    <form onSubmit={handleSubmit} className="flex mt-2">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder={
                          awaitingUsername 
                            ? "Type your username..." 
                            : "Describe your issue..."
                        }
                        value={inputText}
                        onChange={handleInputChange}
                        className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-100 rounded-l-lg py-2 px-3 focus:outline-none placeholder-gray-500 text-sm focus:border-gray-500"
                      />
                      <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-r-lg px-3 flex items-center justify-center transition-colors border border-gray-600"
                      >
                        <BsSend size={16} />
                      </button>
                    </form>
                  </div>
                )}
                
                {msg.isWhatsApp && (
                  <button
                    onClick={openWhatsApp}
                    className="flex justify-between w-full mt-3 bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-md text-sm font-medium items-center transition-colors border border-gray-600"
                  >
                    <span>Chat with us on WhatsApp</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Main input area */}
      {!awaitingUsername && !awaitingIssueDetails && (
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto flex">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 min-w-0 border border-gray-700 bg-gray-800 text-gray-100 rounded-l-lg py-3 px-4 focus:outline-none placeholder-gray-500 focus:border-gray-600"
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-r-lg px-4 flex items-center justify-center border border-gray-700"
            >
              <BsSend size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}