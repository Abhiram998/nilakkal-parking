import { Link, useLocation } from "wouter";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Bell, 
  MapPin, 
  PieChart, 
  ShieldCheck, 
  Menu,
  LayoutDashboard,
  QrCode,
  User,
  Ticket
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useParking } from "@/lib/parking-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useParking();

  // Don't show layout on login pages
  if (location === '/login' || location === '/admin/login') {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white">
      {/* Logo Area */}
      <div className="p-6 mb-6">
        <h1 className="text-2xl font-bold tracking-wider">PARKING</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        <Link href="/">
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${location === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
            <Home className="w-5 h-5" />
            <span className="font-medium capitalize">Home</span>
            {location === '/' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
          </div>
        </Link>

        {!isAdmin && (
          <Link href="/ticket">
            <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${location === '/ticket' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              <FileText className="w-5 h-5" />
              <span className="font-medium capitalize">Ticket</span>
            </div>
          </Link>
        )}

        {/* Placeholders to match image */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-all">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium capitalize">Messages</span>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-all">
          <Bell className="w-5 h-5" />
          <span className="font-medium capitalize">Notification</span>
        </div>

        <Link href="/predictions">
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${location === '/predictions' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
            <MapPin className="w-5 h-5" />
            <span className="font-medium capitalize">Location</span>
          </div>
        </Link>

        <Link href={isAdmin ? "/admin" : "/predictions"}>
          <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${location.startsWith('/admin') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
            <PieChart className="w-5 h-5" />
            <span className="font-medium capitalize">Graph</span>
          </div>
        </Link>
      </nav>

      {/* Admin Link at bottom */}
      {!isAdmin && (
        <div className="p-4 mt-auto">
          <Link href="/admin/login">
            <div className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-all">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-[#1e2746] flex-shrink-0 shadow-xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e2746] z-50 flex items-center justify-between px-4 shadow-md">
        <h1 className="text-white font-bold text-xl">PARKING</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#1e2746] p-0 border-r-slate-700">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen w-full pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
