"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LayoutDashboard, Calendar, Bell, Users, Image as ImageIcon, Key, ScrollText, LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLink {
  name: string;
  href: string;
  icon?: LucideIcon;
}

const publicNavLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Executive Committee", href: "/#executive-committee" },
  { name: "Members", href: "/members" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const cmsNavLinks: NavLink[] = [
  { name: "Dashboard", href: "/cms/dashboard", icon: LayoutDashboard },
  { name: "Events", href: "/cms/events", icon: Calendar },
  { name: "Announcements", href: "/cms/announcements", icon: Bell },
  { name: "Committee", href: "/cms/committee", icon: Users },
  { name: "Hero Slides", href: "/cms/slideshow", icon: ImageIcon },
  { name: "Roles Governance", href: "/cms/roles", icon: Key },
  { name: "Audit Logs", href: "/cms/audit-logs", icon: ScrollText },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isCmsRoute = pathname.startsWith("/cms");

  const currentNavLinks = isCmsRoute ? cmsNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ieee-blue to-sky-500 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="font-extrabold text-lg text-white tracking-wider">IEEE</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-100 tracking-tight leading-tight group-hover:text-sky-400 transition-colors">
              MMIT IEEE SB
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              {isCmsRoute ? "Admin Governance" : "Student Branch Pune"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          {currentNavLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-ieee-blue text-white shadow-md shadow-sky-900/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5 text-sky-400 shrink-0" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isCmsRoute ? (
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4 text-slate-400" />
                <span>Exit CMS</span>
              </Button>
            </Link>
          ) : (
            <Link href="/cms/login">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4 text-sky-400" />
                <span>CMS Portal</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden rounded-lg p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-6 py-6 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-2">
            {currentNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-xl transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-ieee-blue text-white"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 text-sky-400" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-slate-800">
            {isCmsRoute ? (
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Return to Website</span>
                </Button>
              </Link>
            ) : (
              <Link href="/cms/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="gradient" className="w-full gap-2">
                  <Shield className="h-4 w-4" />
                  <span>CMS Login Portal</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
