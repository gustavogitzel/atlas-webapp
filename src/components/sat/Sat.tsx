import "./Sat.css";
import satImage from "../../assets/images/satImage.png";
import React from "react";

type SatProps = {
    text: string;
    // which side the bubble appears on: 'left' (satellite speaking) or 'right' (user)
    side?: "left" | "right";
    // optional avatar size in px
    avatarSize?: number;
    // typing speed in ms per character
    typingSpeed?: number;
    // show animated typing indicator before reveal
    showTypingIndicator?: boolean;
};

export const Sat: React.FC<SatProps> = ({
    text,
    side = "left",
    avatarSize = 90,
    typingSpeed = 24,
    showTypingIndicator = true,
}) => {
    const containerClass = `sat-container ${side}`;
    const [displayed, setDisplayed] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(showTypingIndicator && text.length > 0);

    React.useEffect(() => {
        let mounted = true;
        setDisplayed("");

        // if we show an animated typing indicator first, show dots for a short delay
        const initialDelay = showTypingIndicator ? Math.min(800, 40 * text.length) : 0;

        const startReveal = () => {
            if (!mounted) return;
            setIsTyping(false);
            // reveal characters one by one
            let i = 0;
            const tick = () => {
                if (!mounted) return;
                i += 1;
                setDisplayed(text.slice(0, i));
                if (i < text.length) {
                    window.setTimeout(tick, typingSpeed);
                }
            };
            if (text.length > 0) window.setTimeout(tick, typingSpeed);
        };

        const timer = window.setTimeout(startReveal, initialDelay);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [text, typingSpeed, showTypingIndicator]);

    return (
        <div className={containerClass}>
            {side === "left" && (
                <img
                    src={satImage}
                    alt="Satélite Terra"
                    className="sat-image"
                    style={{ width: avatarSize, height: avatarSize }}
                />
            )}

            <div className="sat-bubble" data-side={side}>
                <div className="sat-bubble-inner">
                    {isTyping ? (
                        <div className="typing-indicator" aria-hidden>
                            <span />
                            <span />
                            <span />
                        </div>
                    ) : (
                        <p className="sat-text">{displayed}</p>
                    )}
                </div>
                <div className="sat-bubble-tail" />
            </div>

            {side === "right" && (
                <img
                    src={satImage}
                    alt="Satélite Terra"
                    className="sat-image"
                    style={{ width: avatarSize, height: avatarSize }} 
                />
            )}
        </div>
    );
};

export default Sat;