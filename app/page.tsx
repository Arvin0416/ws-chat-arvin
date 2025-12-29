"use client";
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const initialMessages = [
  {
    id: 1,
    type: "system",
    username: "System",
    userId: "system",
    text: "Welcome to the general channel!",
    timestamp: "2025-12-29 10:00:00",
  },
  {
    id: 2,
    type: "user_connected",
    username: "Jane",
    userId: "u456",
    text: "Jane has joined the chat.",
    timestamp: "2025-12-29 10:01:00",
  },
  {
    id: 3,
    type: "message",
    username: "Jane",
    userId: "u456",
    text: "Hi there!",
    timestamp: "2025-12-29 10:01:10",
  },
];

export default function Home() {
  // Set dark mode as default
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Interactive state
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState("general");
  const [showModal, setShowModal] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate connection (replace with real logic later)
  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim()) {
      const newUserId = "u" + Math.floor(Math.random() * 1000);
      setUserId(newUserId);
      setConnected(true);
      setShowModal(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "user_connected",
          username,
          userId: newUserId,
          text: `${username} has joined the chat.`,
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        },
      ]);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !connected) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "message",
        username,
        userId,
        text: input,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      },
    ]);
    setInput("");
  }

  return (
    <div className={clsx("flex min-h-screen items-center justify-center bg-background")}>
      <Dialog open={!connected && showModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConnect} className="flex flex-col gap-4">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            <Input
              id="channel"
              type="text"
              placeholder="Channel"
              value={channel}
              onChange={e => setChannel(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Connect</Button>
          </form>
        </DialogContent>
      </Dialog>
      <main className={clsx("flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-12 px-2 sm:px-8")}>
        <h1 className={clsx("text-3xl font-bold text-zinc-900 dark:text-white mb-4 text-center")}>
          Arvin Berina Web Chat Interface
        </h1>
        {/* Status & User Info */}
        <div className={clsx("flex w-full justify-between items-center mb-2")}>
          <Badge variant={connected ? "default" : "destructive"}>
            Status: {connected ? "Connected" : "Not Connected"}
          </Badge>
          <Badge variant="secondary">
            User ID: {userId || "-"}
          </Badge>
        </div>
        {/* Chat Area */}
        <Card className="flex-1 w-full mb-4 border border-zinc-200 dark:border-zinc-700 overflow-y-auto" style={{ minHeight: 320, maxHeight: 400 }}>
          <CardContent className="p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "mb-3 flex",
                  msg.userId === userId ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-xs px-4 py-2 rounded-lg shadow text-sm break-words",
                    msg.type === "system" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-center mx-auto",
                    msg.type !== "system" && msg.userId === userId && "bg-green-500 text-white dark:bg-green-600",
                    msg.type !== "system" && msg.userId !== userId && "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  )}
                >
                  {msg.type !== "system" && (
                    <div className={clsx("font-semibold text-xs mb-1 opacity-80")}>
                      {msg.username} <span className={clsx("ml-1 text-[10px] opacity-60")}>({msg.userId})</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                  <div className={clsx("text-[10px] mt-1 opacity-60 text-right")}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </CardContent>
        </Card>
        {/* Message Input */}
        <form className={clsx("flex w-full gap-2")} onSubmit={handleSend}>
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!connected}
          />
          <Button type="submit" disabled={!connected || !input.trim()}>
            Send
          </Button>
        </form>
        <div className={clsx("w-full text-center text-xs text-zinc-400 mt-2")}>
          <span>{connected ? "WebSocket integration coming soon..." : "Please connect to start chatting."}</span>
        </div>
      </main>
    </div>
  )
};
