'use client';
import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useLayoutEffect } from "react";

export interface ChatMessage {
    id?: number;
    type: string;
    username: string;
    user_id?: string;
    userId?: string;
    content?: string;
    text?: string;
    timestamp: string;
    channel?: string;
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    userId: string;
}

export function ChatMessages({ messages, userId }: Readonly<ChatMessagesProps>) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="flex-1 w-full mb-4 border-none overflow-y-auto min-h-80 " >
            <CardContent className="p-4">
                {messages.map((msg, idx) => {
                    // Support both userId and user_id for compatibility
                    const msgUserId = msg.user_id || msg.userId || "";
                    const isOwn = msgUserId === userId;
                    // Prefer content, fallback to text
                    const messageText = msg.content ?? msg.text ?? "";
                    // Format timestamp as 'Month Day, Year, HH:MM AM/PM'
                    let displayTime = msg.timestamp;
                    try {
                        const d = new Date(msg.timestamp);
                        if (!Number.isNaN(d.getTime())) {
                            displayTime = d.toLocaleString('default', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                        }
                    } catch { }
                    return (
                        <div
                            key={msg.username + idx + (msg.timestamp || "")}
                            className={clsx(
                                "mb-3 flex",
                                isOwn ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={clsx(
                                    "max-w-xs px-4 py-2 rounded-lg shadow text-sm wrap-break-word",
                                    msg.type === "system" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-center mx-auto",
                                    msg.type !== "system" && isOwn && "bg-green-500 text-white dark:bg-green-600",
                                    msg.type !== "system" && !isOwn && "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                                )}
                            >
                                {msg.type !== "system" && (
                                    <div className={clsx("font-semibold text-xs mb-1 opacity-80")}>
                                        {msg.username}
                                    </div>
                                )}
                                <div>{messageText}</div>
                                <div className={clsx("text-[10px] mt-1 opacity-60 text-right")}>
                                    {displayTime}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </CardContent>
        </Card>
    );
}
