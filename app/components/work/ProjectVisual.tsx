import type { ProjectVisualKind } from "~/content/status";
import { cn } from "~/lib/cn";

/**
 * Illustrative visuals for projects without real screenshots. They are
 * abstract diagrams, always labelled "Illustration", never presented as a
 * product interface.
 */

const ink = "var(--color-text)";
const line = "var(--color-border-strong)";
const faint = "var(--color-border)";
const accent = "var(--color-accent)";

const scenes: Record<ProjectVisualKind, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="40" y="36" width="320" height="188" rx="10" stroke={line} />
      <path d="M40 64h320" stroke={faint} />
      <circle cx="56" cy="50" r="3" fill={faint} />
      <circle cx="68" cy="50" r="3" fill={faint} />
      <rect x="56" y="80" width="70" height="128" rx="6" stroke={faint} />
      {[96, 116, 136, 156].map((y) => (
        <rect key={y} x="66" y={y} width="50" height="6" rx="3" fill={faint} />
      ))}
      <rect x="140" y="80" width="204" height="70" rx="6" stroke={faint} />
      <path
        d="M152 134l26-18 22 10 26-26 24 14 26-22 24 8 24-16"
        stroke={accent}
        strokeWidth="2"
      />
      <circle cx="320" cy="84" r="0" />
      {/* pose skeleton */}
      <rect x="140" y="160" width="96" height="48" rx="6" stroke={faint} />
      <g stroke={ink} strokeWidth="1.5">
        <circle cx="188" cy="170" r="4" fill="none" />
        <path d="M188 174v14M188 180l-10 6M188 180l10-4M188 188l-8 12M188 188l8 12" />
      </g>
      <rect x="248" y="160" width="96" height="48" rx="6" stroke={faint} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={260 + i * 15}
          y={196 - (i + 1) * 5}
          width="9"
          height={(i + 1) * 5}
          rx="2"
          fill={i === 4 ? accent : faint}
        />
      ))}
    </>
  ),
  "qr-menu": (
    <>
      <rect x="64" y="52" width="104" height="104" rx="8" stroke={line} />
      {[0, 1, 2, 3, 4, 5, 6].map((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) =>
          (r * 7 + c * 3) % 5 < 2 ||
          (r < 2 && c < 2) ||
          (r > 4 && c < 2) ||
          (r < 2 && c > 4) ? (
            <rect
              key={`${r}-${c}`}
              x={76 + c * 11.5}
              y={64 + r * 11.5}
              width="9"
              height="9"
              rx="1.5"
              fill={ink}
              opacity={0.75}
            />
          ) : null,
        ),
      )}
      <path d="M168 104h40" stroke={accent} strokeWidth="2" strokeDasharray="3 4" />
      <rect x="216" y="32" width="120" height="196" rx="16" stroke={line} />
      <rect x="230" y="52" width="92" height="10" rx="5" fill={faint} />
      {[76, 112, 148, 184].map((y, i) => (
        <g key={y}>
          <rect
            x="230"
            y={y}
            width="92"
            height="26"
            rx="6"
            stroke={i === 1 ? accent : faint}
          />
          <rect x="238" y={y + 9} width="44" height="8" rx="4" fill={faint} />
        </g>
      ))}
      <text
        x="64"
        y="184"
        fill="var(--color-muted)"
        fontSize="9"
        fontFamily="var(--font-mono)"
      >
        TABLE 07
      </text>
    </>
  ),
  detection: (
    <>
      <rect x="40" y="36" width="320" height="188" rx="10" stroke={line} />
      {/* abstract seats */}
      {[80, 170, 260].map((x) => (
        <path
          key={x}
          d={`M${x} 196v-40a14 14 0 0 1 14-14h32a14 14 0 0 1 14 14v40`}
          stroke={faint}
          strokeWidth="1.5"
        />
      ))}
      {/* abstract passengers */}
      {[108, 288].map((x) => (
        <g key={x} stroke={ink} strokeWidth="1.5">
          <circle cx={x + 2} cy="110" r="12" fill="none" />
          <path d={`M${x - 20} 172c0-22 10-36 22-36s22 14 22 36`} fill="none" />
        </g>
      ))}
      <rect x="80" y="88" width="62" height="92" rx="2" stroke={accent} strokeWidth="2" />
      <rect x="80" y="76" width="66" height="12" fill={accent} />
      <text
        x="84"
        y="85"
        fill="var(--color-on-accent)"
        fontSize="8"
        fontFamily="var(--font-mono)"
      >
        PASSENGER
      </text>
      <rect
        x="260"
        y="88"
        width="62"
        height="92"
        rx="2"
        stroke={accent}
        strokeWidth="2"
      />
      <rect x="260" y="76" width="66" height="12" fill={accent} />
      <text
        x="264"
        y="85"
        fill="var(--color-on-accent)"
        fontSize="8"
        fontFamily="var(--font-mono)"
      >
        PASSENGER
      </text>
      <path d="M40 210h320" stroke={faint} />
    </>
  ),
  classification: (
    <>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={52 + c * 34}
            y={52 + r * 34}
            width="28"
            height="28"
            rx="3"
            fill={ink}
            opacity={0.08 + ((r * 4 + c) % 5) * 0.1}
          />
        )),
      )}
      <path d="M196 120h28" stroke={line} strokeWidth="1.5" />
      <path d="M220 115l6 5-6 5" stroke={line} strokeWidth="1.5" />
      {[
        ["T-shirt", 0.86],
        ["Shirt", 0.08],
        ["Pullover", 0.04],
        ["Coat", 0.02],
      ].map(([label, v], i) => (
        <g key={label as string}>
          <text
            x="238"
            y={76 + i * 32}
            fill="var(--color-muted)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            {(label as string).toUpperCase()}
          </text>
          <rect x="238" y={82 + i * 32} width="112" height="6" rx="3" fill={faint} />
          <rect
            x="238"
            y={82 + i * 32}
            width={Math.max(4, 112 * (v as number))}
            height="6"
            rx="3"
            fill={i === 0 ? accent : line}
          />
        </g>
      ))}
    </>
  ),
  evaluation: (
    <>
      <path d="M60 200h280M60 200V48" stroke={line} />
      {[60, 100, 140, 180].map((y) => (
        <path key={y} d={`M60 ${y}h280`} stroke={faint} strokeDasharray="2 4" />
      ))}
      <path
        d="M60 196C100 120 150 88 200 74s100-18 140-20"
        stroke={accent}
        strokeWidth="2"
      />
      <path
        d="M60 196C110 160 160 128 210 116s90-10 130-12"
        stroke={ink}
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {[
        [110, 150],
        [150, 168],
        [196, 128],
        [240, 160],
        [280, 110],
        [310, 140],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="3.5" fill={ink} opacity="0.55" />
      ))}
      <text
        x="64"
        y="44"
        fill="var(--color-muted)"
        fontSize="9"
        fontFamily="var(--font-mono)"
      >
        SCORE
      </text>
      <text
        x="300"
        y="216"
        fill="var(--color-muted)"
        fontSize="9"
        fontFamily="var(--font-mono)"
      >
        PARAMS
      </text>
    </>
  ),
};

export function ProjectVisual({
  kind,
  className,
  label = true,
}: {
  kind: ProjectVisualKind;
  className?: string;
  label?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-border bg-bg",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="bg-blueprint absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden="true"
        className="glow-accent absolute -right-16 -bottom-24 -z-10 size-64 opacity-60"
      />
      <svg
        viewBox="0 0 400 260"
        fill="none"
        className="h-full w-full"
        role="img"
        aria-label="Illustrative diagram, not a product screenshot"
      >
        {scenes[kind]}
      </svg>
      {label && (
        <span className="text-label absolute top-3 left-3 rounded-full border border-border bg-bg/80 px-2.5 py-1.5 text-[0.625rem] text-muted backdrop-blur">
          Illustration
        </span>
      )}
    </div>
  );
}
