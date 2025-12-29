

export function TypingAnimation() {
    return (
        <div className="flex items-center gap-1 h-6">
            <span className="sr-only">Someone is typing...</span>
            <span className="block w-2 h-2 bg-primary rounded-full typing-dot" style={{ animationDelay: '0ms', }}></span>
            <span className="block w-2 h-2 bg-primary rounded-full typing-dot" style={{ animationDelay: '400ms', }}></span>
            <span className="block w-2 h-2 bg-primary rounded-full typing-dot" style={{ animationDelay: '800ms', }} ></span>
        </div >
    );
}
