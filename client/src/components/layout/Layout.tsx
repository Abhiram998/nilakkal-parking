import { Link, useLocation } from "wouter";
import { Car, ShieldCheck, Home, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link href="/">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${location === '/' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}>
          <Home className="w-4 h-4" />
          <span>Devotee View</span>
        </div>
      </Link>
      <Link href="/admin">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${location === '/admin' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}>
          <ShieldCheck className="w-4 h-4" />
          <span>Police Admin</span>
        </div>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold leading-tight text-foreground">Nilakkal Parking</h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sabarimala Base Camp</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-20">
        {children}
      </main>
    </div>
  );
}