interface LogoProps {
  size?: number;
}

/** ClaimLens mark: a magnifier held over a claim document. */
export default function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label="ClaimLens logo"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="logo"
    >
      <rect width="48" height="48" rx="12" fill="#0f6b6f" />
      <rect x="9" y="8" width="20" height="26" rx="3" fill="#ffffff" />
      <path d="M13.5 15h11M13.5 20h11M13.5 25h6.5" stroke="#0f6b6f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="31" cy="31" r="6.5" fill="#cfeeee" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M36 36l4.5 4.5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
