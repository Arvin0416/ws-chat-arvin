export type ChatMessage = {
    type: string;
    username: string;
    user_id: string;
    content: string;
    timestamp?: string;
    channel?: string;
};
