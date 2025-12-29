import { useRef, useLayoutEffect } from 'react';

export function useAutoScroll(trigger: unknown) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [trigger]);

    return chatEndRef;
}
