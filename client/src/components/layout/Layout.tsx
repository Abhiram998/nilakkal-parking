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
      <div className="p-8 mb-4 flex flex-col items-center">
        {/* Profile Placeholder ignored as requested, just the text */}
        <h1 className="text-xl font-bold tracking-wider uppercase">Sabarimala</h1>
        <p className="text-xs text-slate-400">Parking Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        <Link href="/">
          <div className={`flex items-center gap-4 px-6 py-3 rounded-r-full transition-all cursor-pointer relative ${location === '/' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            {location === '/' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
            <Home className="w-5 h-5" />
            <span className="font-medium capitalize">Home</span>
          </div>
        </Link>

        {!isAdmin && (
          <Link href="/ticket">
            <div className={`flex items-center gap-4 px-6 py-3 rounded-r-full transition-all cursor-pointer relative ${location === '/ticket' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
               {location === '/ticket' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
              <FileText className="w-5 h-5" />
              <span className="font-medium capitalize">Ticket</span>
            </div>
          </Link>
        )}

        {/* Placeholders to match image structure */}
        <div className="flex items-center gap-4 px-6 py-3 rounded-r-full text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium capitalize">Messages</span>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 rounded-r-full text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
          <Bell className="w-5 h-5" />
          <span className="font-medium capitalize">Notification</span>
        </div>

        <Link href="/predictions">
          <div className={`flex items-center gap-4 px-6 py-3 rounded-r-full transition-all cursor-pointer relative ${location === '/predictions' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
             {location === '/predictions' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
            <MapPin className="w-5 h-5" />
            <span className="font-medium capitalize">Location</span>
          </div>
        </Link>

        <Link href={isAdmin ? "/admin" : "/predictions"}>
          <div className={`flex items-center gap-4 px-6 py-3 rounded-r-full transition-all cursor-pointer relative ${location.startsWith('/admin') ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
             {location.startsWith('/admin') && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
            <PieChart className="w-5 h-5" />
            <span className="font-medium capitalize">Graph</span>
          </div>
        </Link>
      </nav>

      {/* Admin Link at bottom */}
      {!isAdmin && (
        <div className="p-4 mt-auto">
          <Link href="/admin/login">
            <div className="flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-white cursor-pointer transition-all">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-[#1a233a] flex-shrink-0 shadow-xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a233a] z-50 flex items-center justify-between px-4 shadow-md">
        <h1 className="text-white font-bold text-xl">PARKING</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#1a233a] p-0 border-r-slate-700">
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
