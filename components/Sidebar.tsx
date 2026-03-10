"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  FolderIcon, 
  HashIcon, 
  SettingsIcon, 
  LogOutIcon,
  BotIcon,
  SearchIcon,
  FileTextIcon,
  StarIcon,
  ArchiveIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter");

  const navItems = [
    { name: "All Notes", href: "/dashboard", icon: FileTextIcon, active: pathname === "/dashboard" && !currentFilter },
    { name: "Search", href: "/dashboard?search=true", icon: SearchIcon, active: searchParams.get("search") === "true" },
    { name: "Favorites", href: "/dashboard?filter=favorites", icon: StarIcon, active: currentFilter === "favorites" },
    { name: "Archive", href: "/dashboard?filter=archive", icon: ArchiveIcon, active: currentFilter === "archive" },
  ];

  const toolsItems = [
    { name: "Ask AI", href: "/dashboard/ai-chat", icon: BotIcon, highlight: true },
    { name: "Folders", href: "/dashboard/folders", icon: FolderIcon },
    { name: "Tags", href: "/dashboard/tags", icon: HashIcon },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="flex items-center gap-2 p-4 pt-6 border-b border-slate-800/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
          N
        </div>
        <span className="text-lg font-semibold text-slate-100">NeuraNotes</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = item.active;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="px-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tools
          </h3>
          <nav className="mt-2 space-y-1 px-2">
            {toolsItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                      item.highlight 
                        ? "text-indigo-400" 
                        : isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className={item.highlight ? "text-indigo-300 font-semibold" : ""}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-800 p-4">
        {session?.user && (
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-medium text-slate-300">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200 truncate w-32">
                {session.user.name}
              </span>
              <span className="text-xs text-slate-500 truncate w-32">
                {session.user.email}
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-colors"
          >
            <SettingsIcon className="mr-3 h-4 w-4 shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOutIcon className="mr-3 h-4 w-4 shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
