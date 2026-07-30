import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe, ExternalLink, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 pt-16 pb-12 transition-all">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Organization Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ieee-blue text-white font-extrabold text-base">
                IEEE
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">MMIT IEEE SB</h3>
                <p className="text-xs text-sky-400 font-medium">STB99311 | Pune Section</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Fostering technological innovation and excellence for the benefit of humanity. Empowering students through technical workshops, hackathons, and leadership development.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About IEEE & MMIT SB
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-sky-400 transition-colors">
                  Executive Committee & Members
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-sky-400 transition-colors">
                  Upcoming & Past Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-sky-400 transition-colors">
                  Photo & Event Gallery
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-sky-400 transition-colors">
                  Achievements & Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: IEEE Global Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">IEEE Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-sky-400 transition-colors"
                >
                  <span>IEEE Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ieeexplore.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-sky-400 transition-colors"
                >
                  <span>IEEE Xplore Digital Library</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ieeepune.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-sky-400 transition-colors"
                >
                  <span>IEEE Pune Section</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                <span>Marathwada Mitra Mandal&apos;s Institute of Technology (MMIT), Lohgaon, Pune - 411047</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="mailto:ieee@mmit.edu.in" className="hover:text-sky-400 transition-colors">
                  ieee@mmit.edu.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MMIT IEEE Student Branch. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with passion & precision for MMIT IEEE SB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
