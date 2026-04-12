import {
  CompassGlyph,
  GridGlyph,
  HomeGlyph,
  RailBookmarkIcon,
  RailClockIcon,
  RailCreateIcon,
  RailDashboardIcon,
  RailGroupIcon,
  RailPeopleIcon,
} from "./SocialIcons.jsx";

export const headerNavItems = [
  { label: "Home", to: "/", icon: HomeGlyph },
  { label: "Explore", to: "/explore", icon: CompassGlyph },
  { label: "Publish", to: "/publish", icon: RailCreateIcon },
  { label: "Dashboard", to: "/dashboard", icon: GridGlyph },
];

export const leftRailItems = [
  { label: "Home", to: "/", icon: HomeGlyph },
  { label: "Explore", to: "/explore", icon: CompassGlyph },
  { label: "Publish", to: "/publish", icon: RailCreateIcon },
  { label: "Dashboard", to: "/dashboard", icon: RailDashboardIcon },
  { label: "Saved", to: "/saved", icon: RailBookmarkIcon },
  { label: "Friends", to: "/profile", icon: RailPeopleIcon },
  { label: "Groups", to: "/explore", icon: RailGroupIcon },
  { label: "Memories", to: "/memories", icon: RailClockIcon },
];

export const rightRailUsers = [
  { name: "Meta AI", detail: "Moodboard assistant", active: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80" },
  { name: "Aniket Biswal", detail: "Street photography traveler", active: true, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80" },
  { name: "Krishnakant Samantaray", detail: "Hidden local spots", active: false, avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=320&q=80" },
  { name: "Subham Patel", detail: "Budget route planner", active: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80" },
  { name: "Pihu Priyanka", detail: "Slow travel writer", active: true, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=320&q=80" },
  { name: "Rahul Verma", detail: "Mountain edit curator", active: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80" },
];
