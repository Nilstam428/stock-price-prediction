import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full px-8 flex items-center justify-between h-16 bg-surface/80 backdrop-blur-xl border-b border-white/5 font-headline text-base">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="-ml-4 text-on-surface hover:bg-surface-container-high" />

        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
          <Input
            className="w-full bg-surface-container-highest border-none rounded-full py-2 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant/50"
            placeholder="Search markets..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold hidden sm:inline-block">Market Open</span>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}