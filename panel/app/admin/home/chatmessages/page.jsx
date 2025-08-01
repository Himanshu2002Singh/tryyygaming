"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BsChat,
  BsChevronDown,
  BsChevronRight,
  BsCalendar,
  BsPerson,
  BsSearch,
  BsFilter,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaUserCircle, FaRobot } from "react-icons/fa";
import API_URL from "@/config";
import { HiRefresh } from "react-icons/hi";

export default function AdminChatMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedConversations, setExpandedConversations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, user, bot

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/messages`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.data.messages) {
        // Group messages by conversationId
        const grouped = groupMessagesByConversation(response.data.messages);
        setConversations(grouped);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const groupMessagesByConversation = (messages) => {
    const grouped = {};

    messages.forEach((message) => {
      const conversationId = message.conversationId;

      if (!grouped[conversationId]) {
        grouped[conversationId] = {
          id: conversationId,
          messages: [],
          user: message.User,
          startDate: new Date(message.createdAt),
          lastMessageDate: new Date(message.createdAt),
          messageCount: 0,
        };
      }

      grouped[conversationId].messages.push(message);
      grouped[conversationId].messageCount++;

      // Update the last message date if this message is newer
      const messageDate = new Date(message.createdAt);
      if (messageDate > grouped[conversationId].lastMessageDate) {
        grouped[conversationId].lastMessageDate = messageDate;
      }
    });

    // Convert to array and sort by most recent message
    return Object.values(grouped).sort(
      (a, b) => b.lastMessageDate - a.lastMessageDate
    );
  };

  const toggleConversation = (conversationId) => {
    setExpandedConversations((prev) => ({
      ...prev,
      [conversationId]: !prev[conversationId],
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredConversations = conversations.filter((conversation) => {
    // Apply search filter
    const hasMatchingMessage = conversation.messages.some((msg) =>
      msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasMatchingUser =
      conversation.user &&
      conversation.user.name &&
      conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    return hasMatchingMessage || hasMatchingUser;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button
          onClick={fetchMessages}
          className="mt-2 bg-red-500 text-black px-4 py-2 rounded-md hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#D9D9D9] text-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-black">
            Customer Conversations
          </h1>
          <div className="flex gap-2">
            <button
              onClick={fetchMessages}
              className=" text-black px-4 py-2 rounded-md "
            >
              <HiRefresh />
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search messages or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-black-300 rounded-md focus:outline-none "
              />
              <BsSearch className="absolute left-3 top-3 text-black-400" />
            </div>
            <div className="bg-white flex items-center gap-2">
              <BsFilter className="text-black" size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-xs sm:text-sm border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              >
                <option value="all">All Messages</option>
                <option value="user">User Messages</option>
                <option value="bot">Bot Messages</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
              <BsChat size={48} className="mx-auto text-black-400 mb-4" />
              <p className="text-black-500">No conversations found.</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-lg shadow-2xl"
              >
                {/* Conversation header */}
                <div
                  className="p-4 border-b cursor-pointer "
                  onClick={() => toggleConversation(conversation.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {expandedConversations[conversation.id] ? (
                        <BsChevronDown className="text-black" />
                      ) : (
                        <BsChevronRight className="text-black" />
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <BsPerson className="text-gray-600" />
                          <span className="font-medium text-xs">
                            {conversation.user
                              ? conversation.user.name
                              : "Anonymous User"}
                          </span>
                        </div>
                        <div className="sm:text-sm text-black flex items-center gap-1 mt-1">
                          <BsCalendar size={12} />
                          <span className="text-[10px] sm:text-sm">
                            Started {formatDate(conversation.startDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-white text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {conversation.messageCount} messages
                      </span>
                      <span className="text-xs sm:text-sm  text-gray-500">
                        Last activity:{" "}
                        {formatDate(conversation.lastMessageDate)}
                      </span>
                      {/* <div className="relative group">
                        <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
                        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-secondary)] rounded-md shadow-lg hidden group-hover:block z-10">
                          <div className="py-1">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export Conversation
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete Conversation
                            </a>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Conversation messages */}
                {expandedConversations[conversation.id] && (
                  <div className="p-4 space-y-4 bg-grey-100">
                    {conversation.messages
                      .filter((msg) => {
                        if (filter === "all") return true;
                        if (filter === "user") return msg.sender === "user";
                        if (filter === "bot") return msg.sender === "bot";
                        return true;
                      })
                      .map((message, index) => (
                        <div
                          key={`${conversation.id}-${index}`}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-lg shadow-sm flex ${
                              message.sender === "user"
                                ? "bg-[var(--color-gray)] border border-gray-200"
                                : "bg-grey border border-blue-100"
                            }`}
                          >
                            <div className="mr-3 mt-1">
                              {message.sender === "user" ? (
                                <FaUserCircle
                                  size={20}
                                  className="text-gray-600"
                                />
                              ) : (
                                <FaRobot size={20} className="text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex justify-between">
                                <span
                                  className={`text-xs font-medium ${
                                    message.sender === "user"
                                      ? "text-gray-500"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {message.sender === "user" ? "User" : "Bot"}
                                </span>
                                <span className="text-xs text-gray-400 ml-4">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{message.text}</p>
                              {message.isWhatsApp && (
                                <div className="mt-1 text-xs flex items-center gap-1 text-green-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                  <span>WhatsApp message</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
