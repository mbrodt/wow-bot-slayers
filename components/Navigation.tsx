"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Auth from "@/components/Auth";

const navItems = [
  { href: "/submit", label: "Submit Kill" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900 bg-opacity-90 p-4 border-b-2 border-yellow-600">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-yellow-400 font-wow text-lg md:text-2xl">
          Hardcore Cleaning Crew
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg hover:text-yellow-400 transition-colors duration-300 font-wow ${
                pathname === item.href ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Auth />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-yellow-400 hover:text-yellow-500"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-gray-900 border-l-2 border-yellow-600 p-0"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-yellow-600">
                <span className="text-2xl font-wow text-yellow-400">Menu</span>
              </div>
              <nav className="flex flex-col space-y-4 p-4 flex-grow">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xl font-wow p-2 rounded transition-colors duration-300 ${
                      pathname === item.href
                        ? "bg-yellow-600 text-gray-900"
                        : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-yellow-600">
                <Auth />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
