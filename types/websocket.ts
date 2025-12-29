export type UseWebSocketProps = {
    url: string;
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    enabled?: boolean;
};
