export function Icon({ children, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

export function SearchIcon() {
  return <Icon><path d="M15.5 15.5 21 21" /><circle cx="10" cy="10" r="5.5" /></Icon>;
}

export function HomeGlyph() {
  return <Icon><path d="M4 10.5 12 4l8 6.5" /><path d="M6.5 9.5V20h11V9.5" /></Icon>;
}

export function CompassGlyph() {
  return <Icon><circle cx="12" cy="12" r="8" /><path d="m15.8 8.2-2.4 6-6 2.4 2.4-6 6-2.4Z" /></Icon>;
}

export function PlusGlyph() {
  return <Icon><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M12 9v6M9 12h6" /></Icon>;
}

export function GridGlyph() {
  return <Icon><rect x="5" y="5" width="5" height="5" rx="1.2" /><rect x="14" y="5" width="5" height="5" rx="1.2" /><rect x="5" y="14" width="5" height="5" rx="1.2" /><rect x="14" y="14" width="5" height="5" rx="1.2" /></Icon>;
}

export function SunGlyph() {
  return <Icon><circle cx="12" cy="12" r="3.5" /><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" /></Icon>;
}

export function MoonGlyph() {
  return <Icon><path d="M18 14.8A6.8 6.8 0 1 1 9.2 6a5.8 5.8 0 0 0 8.8 8.8Z" /></Icon>;
}

export function ProfileGlyph() {
  return <Icon><circle cx="12" cy="8.4" r="3.2" /><path d="M5.5 18.2a7.5 7.5 0 0 1 13 0" /></Icon>;
}

export function SettingsGlyph() {
  return <Icon><circle cx="12" cy="12" r="2.2" /><path d="M12 3.8v2.1M12 18.1v2.1M20.2 12h-2.1M5.9 12H3.8M17.8 6.2l-1.5 1.5M7.7 16.3l-1.5 1.5M17.8 17.8l-1.5-1.5M7.7 7.7 6.2 6.2" /></Icon>;
}

export function ShieldGlyph() {
  return <Icon><path d="M12 3.8 18 6v4.8c0 4-2.3 6.6-6 9.4-3.7-2.8-6-5.4-6-9.4V6l6-2.2Z" /><path d="m9.7 12 1.7 1.7 3.1-3.4" /></Icon>;
}

export function LogoutGlyph() {
  return <Icon><path d="M10 6H7.5A2.5 2.5 0 0 0 5 8.5v7A2.5 2.5 0 0 0 7.5 18H10" /><path d="M14 16l4-4-4-4" /><path d="M18 12h-8" /></Icon>;
}

export function RailPeopleIcon() {
  return <Icon><path d="M16 19a4 4 0 0 0-8 0" /><circle cx="12" cy="9" r="3" /><path d="M20 18a3.5 3.5 0 0 0-3-3.46" /><path d="M7 14.54A3.5 3.5 0 0 0 4 18" /></Icon>;
}

export function RailCreateIcon() {
  return <Icon><rect x="4.5" y="5.5" width="15" height="13" rx="3" /><path d="M12 9v6M9 12h6" /></Icon>;
}

export function RailDashboardIcon() {
  return <Icon><path d="M5 13.5h5V19H5zM14 5h5v14h-5zM9.5 8.5h5V19h-5z" /></Icon>;
}

export function RailBookmarkIcon() {
  return <Icon><path d="M7 5h10v15l-5-3-5 3Z" /></Icon>;
}

export function RailGroupIcon() {
  return <Icon><circle cx="9" cy="9" r="2.5" /><circle cx="16.5" cy="10" r="2" /><path d="M4.5 18a5 5 0 0 1 9 0" /><path d="M14 18a4 4 0 0 1 6 0" /></Icon>;
}

export function RailClockIcon() {
  return <Icon><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></Icon>;
}

export function VideoIcon() {
  return <Icon className="h-5 w-5"><path d="M15 10.5 20 7v10l-5-3.5Z" /><rect x="4" y="7" width="11" height="10" rx="2.5" /></Icon>;
}

export function PhotoIcon() {
  return <Icon className="h-5 w-5"><rect x="4" y="6" width="16" height="12" rx="2.5" /><path d="m8 14 2.5-2.5L14 15l2-2 3 3" /><circle cx="9" cy="10" r="1.2" /></Icon>;
}

export function MapPinIcon() {
  return <Icon className="h-5 w-5"><path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" /><circle cx="12" cy="11" r="2" /></Icon>;
}

export function PlusSmallIcon() {
  return <Icon className="h-5 w-5"><path d="M12 5v14M5 12h14" /></Icon>;
}

export function DotsIcon() {
  return <Icon className="h-5 w-5"><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Icon>;
}

export function HeartIcon() {
  return <Icon className="h-5 w-5"><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" /></Icon>;
}

export function CommentIcon() {
  return <Icon className="h-5 w-5"><path d="M5 18.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 2.5Z" /></Icon>;
}

export function ShareIcon() {
  return <Icon className="h-5 w-5"><path d="m14 5 5 5-5 5" /><path d="M19 10H9a4 4 0 0 0-4 4v5" /></Icon>;
}

export function StarIcon() {
  return <Icon className="h-4 w-4"><path d="m12 4 2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2-3.8-3.7 5.2-.8Z" /></Icon>;
}

export function ProfileCardIcon() {
  return <Icon className="h-5 w-5"><circle cx="12" cy="8.5" r="3" /><path d="M5.5 18a7.2 7.2 0 0 1 13 0" /></Icon>;
}

export function BookmarkPulseIcon() {
  return <Icon className="h-5 w-5"><path d="M7 5h10v14l-5-3-5 3Z" /><path d="M9 9h6" /></Icon>;
}
