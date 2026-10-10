type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
};

/** SOMATISME's circuit-inspired S mark and wordmark. */
export default function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-3" aria-label="SOMATISME">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className={compact ? 'h-9 w-9 shrink-0' : 'h-11 w-11 shrink-0'}
        fill="none"
      >
        <rect x="1" y="1" width="46" height="46" rx="14" className="fill-slate-950" />
        <path d="M34 13H19a7 7 0 0 0 0 14h10a7 7 0 0 1 0 14H14" stroke="#35D4C5" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 13h4M14 41h-4" stroke="#F2A65A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="13" r="3" fill="#F2A65A" />
        <circle cx="10" cy="41" r="3" fill="#F2A65A" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`text-lg sm:text-xl font-extrabold tracking-[0.12em] ${inverse ? 'text-white' : 'text-slate-950'}`}>
            SOMATISME
          </span>
          <span className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.23em] ${inverse ? 'text-white/60' : 'text-slate-500'}`}>
            Automatisme · Industrie
          </span>
        </span>
      )}
    </span>
  );
}
