import React from "react";

const LOGO_SRC =
  "https://media.base44.com/images/public/6a79856921942cd41c8e74c0/b019180bb_WhatsAppImage2026-08-03at173348.jpeg";

const heightMap = {
  sm: "h-6",
  default: "h-8",
  lg: "h-11",
};

const iconBoxMap = {
  sm: "w-6 h-6",
  default: "w-8 h-8",
  lg: "w-11 h-11",
};

export default function KadoshAILogo({ size = "default", showText = true }) {
  if (!showText) {
    const box = iconBoxMap[size] || iconBoxMap.default;
    return (
      <div className={`${box} overflow-hidden rounded-md shrink-0`}>
        <img
          src={LOGO_SRC}
          alt="KadoshAI"
          draggable={false}
          className="h-full w-auto object-cover select-none"
          style={{
            objectPosition: "left center",
            transform: "scale(1.8)",
            transformOrigin: "left center",
          }}
        />
      </div>
    );
  }

  const h = heightMap[size] || heightMap.default;
  return (
    <img
      src={LOGO_SRC}
      alt="KadoshAI"
      draggable={false}
      className={`${h} w-auto object-contain select-none`}
    />
  );
}