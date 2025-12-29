
'use client';
import { useState } from "react";
import { showToast } from "@/components/ToastProvider";
import { useWebSocket } from "./useWebSocket";
import type { ChatMessage } from "@/types/chat";

function handleWsOpen(setConnected: (v: boolean) => void) {
    setConnected(true);
    showToast.success("Connected to chat server.");
}

function handleWsClose(setConnected: (v: boolean) => void) {
    setConnected(false);
    showToast.error("Disconnected from chat server.");
}

function handleWsError() {
    showToast.error("WebSocket error occurred.");
}
export function useChat() {
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [channel, setChannel] = useState("general");
    const [showModal, setShowModal] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";
    const wsUrl = !showModal && channel && username
        ? `${baseWsUrl}?channel=${channel}&username=${encodeURIComponent(username)}`
        : "";

    function handleWsMessage(event: MessageEvent, username: string, userId: string, setUserId: (id: string) => void, setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) {
        try {
            const data = JSON.parse(event.data);

            if (data.type === 'user_connected' && data.username === username && data.user_id && !userId) {
                setUserId(data.user_id);
            }
            setMessages(prev => {
                const safeData = {
                    ...data,
                    timestamp: typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString(),
                };
                return [...prev, safeData];
            });
        } catch (err) {
            console.warn('[FRONTEND-MESSAGE][PARSE-ERROR]', event.data, err);
        }
    }


    const { ws, send } = useWebSocket({
        url: wsUrl,
        onOpen: () => handleWsOpen(setConnected),
        onMessage: (event: MessageEvent) => handleWsMessage(event, username, userId, setUserId, setMessages),
        onClose: () => handleWsClose(setConnected),
        onError: handleWsError,
        enabled: Boolean(username && channel && !showModal),
    });

    function handleConnect(e: React.FormEvent) {
        e.preventDefault();
        if (!username.trim()) return;

        setShowModal(false);
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || !connected) return;
        const msg: ChatMessage = {
            type: "message",
            username,
            user_id: userId,
            content: input,
            timestamp: new Date().toISOString(),
            channel,
        };
        if (send) send(JSON.stringify(msg));
        setInput("");
    }

    function handleDisconnect() {
        ws.current?.close();
        setConnected(false);
        setShowModal(true);
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
        handleDisconnect,
    };
}

