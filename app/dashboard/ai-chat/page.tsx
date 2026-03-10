"use client";

import { AIChat } from "@/components/AIChat";
import { SparklesIcon } from "lucide-react";

export default function GlobalAIChatPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      <div className="p-8 pb-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Neura AI</h1>
            <p className="text-slate-500 text-sm">Your intelligent note-taking companion.</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-4xl w-full mx-auto px-8 pb-8 flex flex-col min-h-0">
        <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <AIChat fullWidth />
        </div>
      </div>
    </div>
  );
}
