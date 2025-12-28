import React, { useState, useEffect, useRef } from "react";
import "./hover-border-gradient.css";

interface HoverBorderGradientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  clockwise?: boolean;
}

export const HoverBorderGradient: React.FC<HoverBorderGradientProps> = ({
  children,
  containerClassName = "",
  className = "",
  as: Component = "button",
  duration = 1,
  clockwise = true,
  ...props
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Component
      {...props}
      className={`hover-border-gradient-container ${containerClassName}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        "--duration": `${duration}s`,
        "--rotation-direction": clockwise ? "1" : "-1",
      } as React.CSSProperties}
    >
      <div className={`hover-border-gradient-bg ${hovered ? "hovered" : ""}`} />
      <div className={`hover-border-gradient-content ${className}`}>
        {children}
      </div>
    </Component>
  );
};
