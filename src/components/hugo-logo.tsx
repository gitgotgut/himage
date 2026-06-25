interface HugoLogoProps {
  size?: number;
  className?: string;
}

export function HugoLogo({ size = 24, className }: HugoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orbital ring */}
      <circle cx="20" cy="20" r="17" stroke="#4A6FA5" strokeWidth="2.5" fill="none" />
      {/* Letter h */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontWeight="600"
        fontSize="20"
        fill="#4A6FA5"
      >
        h
      </text>
      {/* Terracotta dot — active monitoring indicator */}
      <circle cx="33" cy="9" r="3.5" fill="#C8644A" />
    </svg>
  );
}
