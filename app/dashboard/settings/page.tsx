"use client";

import { useSession, signOut } from "next-auth/react";
import { UserIcon, MailIcon, ShieldCheckIcon, PaletteIcon, BellIcon, KeyboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();

  const sections = [
    {
      title: "Account",
      icon: UserIcon,
      items: [
        { label: "Name", value: session?.user?.name, icon: UserIcon },
        { label: "Email", value: session?.user?.email, icon: MailIcon },
        { label: "Password", value: "••••••••", icon: ShieldCheckIcon },
      ]
    },
    {
      title: "Appearance",
      icon: PaletteIcon,
      items: [
        { label: "Theme", value: "Dark", icon: PaletteIcon },
        { label: "Font Size", value: "Default", icon: KeyboardIcon },
      ]
    },
    {
      title: "Notifications",
      icon: BellIcon,
      items: [
        { label: "Email Notifications", value: "Enabled", icon: BellIcon },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Settings</h1>

        <div className="space-y-8">
           {sections.map((section) => (
             <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 px-1">
                   {section.title}
                </h3>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                   {section.items.map((item, idx) => (
                     <div 
                        key={item.label} 
                        className={`flex items-center justify-between p-4 ${idx !== section.items.length - 1 ? 'border-b border-slate-800' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                           <item.icon className="h-4 w-4 text-slate-400" />
                           <span className="text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-slate-500 text-sm">{item.value}</span>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
           <div className="text-sm text-slate-500">
              NeuraNotes AI — Version 0.1.0
           </div>
           <Button 
              variant="outline" 
              className="border-red-900/50 text-red-400 hover:bg-red-950/30"
              onClick={() => signOut({ callbackUrl: "/login" })}
           >
              Log Out
           </Button>
        </div>
      </div>
    </div>
  );
}
