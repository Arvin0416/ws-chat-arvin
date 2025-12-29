
'use client';
import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { formatChatTimestamp } from "@/lib/helper";
import { useAutoScroll } from "@/hooks/useAutoScroll";

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
    username: string;
}
export function ChatMessages({ messages, username }: Readonly<ChatMessagesProps>) {
    const chatEndRef = useAutoScroll([messages]);
    return (
        <Card className="flex-1 w-full mb-4 border-none overflow-y-auto min-h-80 max-h-200" >
            <CardContent className="p-4">
                {messages.map((msg, idx) => {
                    const isOwn = msg.username && msg.username === username;
                    const messageText = msg.content ?? msg.text ?? "";
                    const displayTime = formatChatTimestamp(msg.timestamp);

                    // Custom color for special users
                    let userClass = "";
                    if (msg.username === "SystemHelper") {
                        userClass = "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border border-yellow-300";
                    } else if (msg.username === "Developer") {
                        userClass = "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 border border-blue-300";
                    } else if (msg.username === "ChatBot") {
                        userClass = "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 border border-purple-300";
                    }

                    return (
                        <div
                            key={msg.timestamp + idx}
                            className={clsx(
                                "mb-3 flex",
                                isOwn ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={clsx(
                                    "max-w-xs px-4 py-2 rounded-lg shadow text-sm wrap-break-word",

                                    msg.type !== "system" && isOwn && "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border border-green-300",
                                    msg.type !== "system" && !isOwn && !userClass && " bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-300",
                                    userClass
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
