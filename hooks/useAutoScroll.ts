import { useRef, useLayoutEffect } from "react";

export function useAutoScroll(deps: unknown[] = []) {
    const chatEndRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return chatEndRef;
}
