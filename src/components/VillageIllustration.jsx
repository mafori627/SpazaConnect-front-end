export default function VillageIllustration() {
  return (
    <svg
      viewBox="0 0 400 140"
      className="village-illustration"
      role="img"
      aria-label="Illustration of a spaza shop street in a township"
    >
      <rect x="0" y="90" width="400" height="50" fill="#dcecd9" />
      <rect x="0" y="105" width="400" height="35" fill="#c7e3c2" />

      {/* pole */}
      <line x1="60" y1="40" x2="60" y2="105" stroke="#9a9a9a" strokeWidth="3" />
      <line x1="48" y1="52" x2="72" y2="52" stroke="#9a9a9a" strokeWidth="2" />

      {/* tree */}
      <line x1="340" y1="65" x2="340" y2="108" stroke="#8a5a3a" strokeWidth="4" />
      <circle cx="340" cy="52" r="22" fill="#5fae6b" />
      <circle cx="322" cy="62" r="14" fill="#5fae6b" />
      <circle cx="358" cy="62" r="14" fill="#5fae6b" />

      {/* shop building */}
      <rect x="120" y="55" width="120" height="50" fill="#f5e6c8" stroke="#c9a86a" strokeWidth="1.5" />
      <polygon points="112,55 180,28 248,55" fill="var(--green-dark)" />
      <rect x="140" y="72" width="26" height="33" fill="#8a5a3a" />
      <rect x="182" y="68" width="20" height="20" fill="#bfe0e8" stroke="#8a5a3a" strokeWidth="1.5" />
      <rect x="120" y="98" width="120" height="7" fill="var(--amber)" />

      {/* road */}
      <rect x="0" y="112" width="400" height="28" fill="#d9d2c2" />
      <rect x="30" y="124" width="24" height="4" rx="2" fill="#fff" opacity="0.7" />
      <rect x="90" y="124" width="24" height="4" rx="2" fill="#fff" opacity="0.7" />
      <rect x="260" y="124" width="24" height="4" rx="2" fill="#fff" opacity="0.7" />
      <rect x="320" y="124" width="24" height="4" rx="2" fill="#fff" opacity="0.7" />
    </svg>
  )
}
