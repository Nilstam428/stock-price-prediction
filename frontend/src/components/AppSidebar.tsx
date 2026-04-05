import {
  Home,
  Search,
  Eye,
  Settings,
  Star
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useFavorites } from "@/hooks/use-favorites";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Search", url: "/search", icon: Search },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { favorites } = useFavorites();

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    if (active) {
      return "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-primary font-bold border-r-2 border-primary bg-primary/10";
    }
    return "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container-high";
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r-0 bg-surface dark:bg-gradient-to-r dark:from-[#0b1326] dark:to-[#0f172a] shadow-2xl font-headline text-sm tracking-wide transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="py-8 flex flex-col h-full bg-surface dark:bg-transparent">
        {/* Header */}
        <NavLink to="/" className="px-6 mb-12 flex flex-col">
          {!collapsed ? (
            <>
              <h1 className="text-xl font-bold tracking-tighter text-primary">Predictive Editorial</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 mt-1 font-bold">Analytical Luminary</p>
            </>
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">PE</div>
          )}
        </NavLink>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                className={getNavClassName(item.url)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}

            {/* Watchlist Example */}
            <NavLink
              to="/watchlist"
              className={getNavClassName("/watchlist")}
            >
              <Eye className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Watchlist</span>}
            </NavLink>

            {/* Settings */}
            <NavLink
              to="/settings"
              className={getNavClassName("/settings")}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </NavLink>

          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorites list */}
        {!collapsed && favorites.length > 0 && (
          <div className="px-4 mt-6">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-4">Favorites</h4>
            <div className="space-y-1">
              {favorites.map((fav) => (
                <NavLink
                  key={fav.symbol}
                  to={`/search?q=${fav.symbol}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Star className="h-4 w-4 shrink-0 text-primary fill-primary/20" />
                  <span className="truncate text-xs">{fav.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Footer Profile */}
        <div className="mt-auto px-6 pt-6 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS9pKO3R3AjVNlTIjHKM7cScad926GWrMctS6sEdM9omr9RUmNER5m6CiWqQgPIpZsWSQvo9N-bqIn81elOx4SUrVM3Wc7O_gMvFSF0vwK5Ezhn2g4cKxpgBZcyQgnXbmtmgSFgljHa5MNMyJlakis_qE09QwkBIGl2bPG9DnkjiNtP__m2zaaFbGS050zAmZJxI8FENDHyEC_TnwHpavvAEJ3AgNsXoiR9tF0mUJkrMuyGF1YPIcJUlY0IsxQSVkRe08KnwtVn7A" alt="Profile" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface truncate">Alex Sterling</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">Pro Analyst</span>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}