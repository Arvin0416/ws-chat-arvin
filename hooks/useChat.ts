'use client';
import { initialMessages } from "@/constants/chat";
import { useState } from "react";

export function useChat() {
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [channel, setChannel] = useState("general");
    const [showModal, setShowModal] = useState(true);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");

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

    return {
        connected,
        userId,
        username,
        setUsername,
        channel,
        setChannel,
        showModal,
        setShowModal,
        messages,
        input,
        setInput,
        handleConnect,
        handleSend,
    };
}
