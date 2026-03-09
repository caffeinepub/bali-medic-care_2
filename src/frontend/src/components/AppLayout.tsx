import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronRight,
  Cross,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pasien", label: "Patients", icon: Users },
  { id: "dokter", label: "Doctors", icon: Stethoscope },
  { id: "invoice", label: "Invoice", icon: FileText },
  { id: "surat-sakit", label: "Sick Note", icon: Cross },
  { id: "surat-sehat", label: "Health Certificate", icon: Heart },
  { id: "katalog", label: "Service Catalog", icon: BookOpen },
  { id: "pengaturan", label: "Settings", icon: Settings },
];

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  navigate: (page: Page) => void;
  userRole: string;
}

export default function AppLayout({
  children,
  currentPage,
  navigate,
  userRole,
}: AppLayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 6)}...${principal.slice(-4)}`
    : "";

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-6 sidebar-pattern relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-white font-display font-bold text-sm tracking-wide">
              Bali Medic Care
            </span>
          </div>
          <p className="text-xs text-white/70 pl-10">dr. Romy Kamaluddin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === "invoice" && currentPage === "invoice-create");
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => handleNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-white hover:bg-sidebar-accent/60 hover:text-white",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left leading-tight">
                {item.label}
              </span>
              {isActive && (
                <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4 space-y-3">
        <div className="px-3 py-2 rounded-md bg-sidebar-accent/40">
          <p className="text-xs text-white/70 mb-0.5">Principal</p>
          <p className="text-xs text-white font-mono truncate">
            {shortPrincipal}
          </p>
          {userRole === "admin" && (
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-sidebar-primary text-sidebar-primary-foreground rounded font-medium">
              Admin
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-ocid="nav.logout.button"
          onClick={clear}
          className="w-full justify-start gap-2 text-white hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop dismiss */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="relative z-10 w-72 flex flex-col bg-sidebar h-full">
            <button
              type="button"
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={closeMobile}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            data-ocid="nav.menu.button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm">
              Bali Medic Care
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
