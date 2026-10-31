/**
 * Static stand-in for the Neural Lattice hero scene (Phase 3).
 * It stays in the codebase permanently as the poster shown before the 3D scene
 * loads and for reduce-motion / low-power visitors. Pure SVG, no JavaScript.
 */

const COLS = 9;
const ROWS = 7;
const GAP = 72;

const nodes = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: (i % COLS) * GAP + 36,
  y: Math.floor(i / COLS) * GAP + 36,
}));

// The brand's S path traced through the lattice, ending at the orange output node.
// Spans 4 lattice gaps each way: ring at (468,108), output node at (180,396).
const S_PATH = "M459 108H216L180 144v72l36 36h216l36 36v72l-36 36H190";

export function LatticePoster({ className }: { className?: string }) {
  const width = (COLS - 1) * GAP + 72;
  const height = (ROWS - 1) * GAP + 72;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="lp-glow">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lp-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="lp-mask">
          <rect width={width} height={height} fill="url(#lp-fade)" />
        </mask>
      </defs>

      <g mask="url(#lp-mask)">
        {/* lattice connections */}
        <g stroke="var(--color-text)" strokeOpacity="0.07" strokeWidth="1">
          {nodes.map((n, i) => (
            <g key={`l${i}`}>
              {i % COLS < COLS - 1 && <line x1={n.x} y1={n.y} x2={n.x + GAP} y2={n.y} />}
              {i < COLS * (ROWS - 1) && (
                <line x1={n.x} y1={n.y} x2={n.x} y2={n.y + GAP} />
              )}
            </g>
          ))}
        </g>
        {/* nodes */}
        <g fill="var(--color-text)" fillOpacity="0.22">
          {nodes.map((n, i) => (
            <circle key={`n${i}`} cx={n.x} cy={n.y} r="2" />
          ))}
        </g>
        {/* signal path */}
        <path
          d={S_PATH}
          stroke="var(--color-text)"
          strokeOpacity="0.55"
          strokeWidth="3"
        />
        <circle
          cx="468"
          cy="108"
          r="9"
          stroke="var(--color-text)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <circle cx="180" cy="396" r="56" fill="url(#lp-glow)" />
        <circle cx="180" cy="396" r="10" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}
