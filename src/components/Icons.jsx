export function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const paths = {
    arrowLeft: <><path d="m15 18-6-6 6-6"/><path d="M9 12h12"/></>,
    volume: <><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></>,
    volumeOff: <><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></>,
    sparkles: <><path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2L12 3Z"/><path d="m5 13-.8 2.2L2 16l2.2.8L5 19l.8-2.2L8 16l-2.2-.8L5 13Z"/><path d="m18.5 14-.7 1.8-1.8.7 1.8.7.7 1.8.7-1.8 1.8-.7-1.8-.7-.7-1.8Z"/></>,
    timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9 2h6"/></>,
    moves: <><path d="M7 7h10v10H7z"/><path d="m4 4 3 3M20 4l-3 3M4 20l3-3M20 20l-3-3"/></>,
    flame: <path d="M12 22c4 0 7-2.7 7-6.5 0-2.7-1.4-5.2-4.2-7.5.2 2-1 3.3-2.3 4.1.1-3.4-1.7-6.5-4.5-8.1.2 3.2-3 5.7-3 9.5C5 18.2 8 22 12 22Z"/>,
    rotate: <><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></>,
    play: <path d="m8 5 11 7-11 7V5Z"/>,
    trophy: <><path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
