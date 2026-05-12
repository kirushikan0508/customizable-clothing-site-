"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  data?: any;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Hello! I'm your AI fashion assistant. How can I help you style your perfect outfit today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate or retrieve session ID
    let currentSession = sessionStorage.getItem("chatSessionId");
    if (!currentSession) {
      currentSession = "session_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("chatSessionId", currentSession);
    }
    setSessionId(currentSession);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessageContent = inputMessage.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("accessToken") || undefined;
      
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessageContent,
          auth_token: token
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI agent.");
      }

      const data = await response.json();
      
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data.message,
        timestamp: new Date(),
        data: data.data
      };
      
      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Chat Container */}
        <div className="flex h-[80vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-white/80 p-5 backdrop-blur-md">
            <div className="flex items-center space-x-4">
              <Link href="/" className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black">
                <ChevronLeft size={20} />
              </Link>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-black to-neutral-700 text-white shadow-md">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                  Style Assistant
                  <Sparkles size={16} className="text-yellow-500" />
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-500">Online and ready</span>
                </div>
              </div>
            </div>
            <Link href="/" className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black">
              <X size={20} />
            </Link>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                        message.role === "user"
                          ? "bg-neutral-200 text-neutral-600"
                          : "bg-black text-white"
                      }`}
                    >
                      {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-5 py-3.5 shadow-sm ${
                        message.role === "user"
                          ? "rounded-tr-none bg-black text-white"
                          : "rounded-tl-none bg-white text-neutral-800 ring-1 ring-neutral-200"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <span
                        className={`mt-2 block text-xs font-medium ${
                          message.role === "user" ? "text-neutral-400" : "text-neutral-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Render Products Data if present */}
                  {message.data?.products && message.data.products.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 pl-11 w-full max-w-[90%]">
                      {message.data.products.slice(0, 3).map((product: any, idx: number) => (
                        <div key={product._id || idx} className="w-full">
                           <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Cart Data if present */}
                  {message.data?.cart_response && (
                    <div className="mt-2 pl-11">
                       <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                         Cart updated successfully
                       </span>
                    </div>
                  )}
                  {message.data?.order && (
                    <div className="mt-2 pl-11">
                       <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                         Order confirmed! ID: {message.data.order._id || "processing"}
                       </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="flex items-center space-x-1.5 rounded-2xl rounded-tl-none bg-white px-5 py-4 shadow-sm ring-1 ring-neutral-200">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-100 bg-white p-4 sm:p-6">
            <form
              onSubmit={handleSendMessage}
              className="flex items-end space-x-4 rounded-xl bg-neutral-50 p-2 ring-1 ring-neutral-200 focus-within:ring-2 focus-within:ring-black"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask about styles, sizes, or trends..."
                className="max-h-32 min-h-[44px] w-full resize-none bg-transparent py-3 pl-4 pr-2 text-[15px] outline-none placeholder:text-neutral-400"
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="mb-1 mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-all hover:bg-neutral-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
            <div className="mt-3 text-center text-xs font-medium text-neutral-400">
              AI can make mistakes. Please verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
