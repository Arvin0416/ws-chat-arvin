'use client';
import { useEffect } from "react";

export const useTheme = (mode: string) => {
    useEffect(() => {
        if (globalThis.window !== undefined) {
            document.documentElement.classList.add(mode);
        }
    }, [mode]);
}