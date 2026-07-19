import { colors } from "@/lib/colors"

export function Logo({
  size = 20,
  white = false,
}: {
  size?: number
  white?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={white ? colors.accent : colors.navy} />
          <stop offset="50%" stopColor={white ? colors.indigo : colors.indigo} />
          <stop offset="100%" stopColor={white ? colors.navy : colors.mauve} />
        </linearGradient>
        <linearGradient id="senseGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={white ? colors.accentLight : colors.accent} />
          <stop offset="100%" stopColor={white ? "rgba(15, 23, 42, 0.4)" : "rgba(74, 78, 105, 0.2)"} />
        </linearGradient>
      </defs>
      {/* Outer abstract flow rings */}
      <path
        d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16C26 21.5228 21.5228 26 16 26"
        stroke="url(#flowGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
      {/* Inner overlapping sensing loop */}
      <path
        d="M12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16Z"
        stroke="url(#senseGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
      {/* Central focal node */}
      <circle
        cx="16"
        cy="16"
        r="2"
        fill={white ? colors.navy : colors.navy}
      />
    </svg>
  )
}
