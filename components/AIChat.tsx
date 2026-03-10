"use client";

import { useState } from "react";
import { BotIcon, SendIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

export function AIChat({ noteContent, fullWidth = false }: { noteContent?: string, fullWidth?: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !customPrompt) return;

    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: noteContent, // Send the current note as context
        }),
      });

      if (res.ok) {
        const aiMessage = await res.json();
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`flex flex-col h-full bg-slate-900 ${fullWidth ? "w-full" : "w-80 border-l border-slate-800 hidden lg:flex"}`}>
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-indigo-500/10 flex items-center justify-center">
          <BotIcon className="h-5 w-5 text-indigo-400" />
        </div>
        <h3 className="font-medium text-slate-200">AI Assistant</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                   <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <SparklesIcon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="bg-slate-800 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-300">
                         <p>Hi! I&apos;m Neura, your AI assistant. How can I help you with this note today?</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/50">
                   <p className="text-xs text-slate-500 mb-1 border-b pb-1 border-slate-800 inline-block">Suggested actions</p>
                   <button onClick={() => sendMessage(undefined, "Please summarize this note.")} className="text-left text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300 transition-colors">
                     ✨ Summarize this note
                   </button>
                   <button onClick={() => sendMessage(undefined, "Generate a 3-question quiz based on this note.")} className="text-left text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300 transition-colors">
                     ❓ Generate a quiz
                   </button>
                   <button onClick={() => sendMessage(undefined, "Please suggest ways to improve the writing of this note.")} className="text-left text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300 transition-colors">
                     📝 Improve writing
                   </button>
                </div>
             </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                 <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                       {m.role === 'user' ? <span className="text-xs text-white">U</span> : <SparklesIcon className="h-4 w-4 text-indigo-400" />}
                    </div>
                    <div className={`rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-300 rounded-tl-sm whitespace-pre-wrap'}`}>
                       {m.content}
                    </div>
                 </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                       <Loader2Icon className="h-4 w-4 text-indigo-400 animate-spin" />
                    </div>
                 </div>
              )}
            </div>
          )}
      </ScrollArea>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form className="relative flex items-center" onSubmit={sendMessage}>
          <Input 
             className="pr-10 bg-slate-950 border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-full focus-visible:ring-indigo-500 w-full" 
             placeholder="Ask AI about notes..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={isLoading}
          />
          <Button 
             size="icon" 
             type="submit"
             variant="ghost" 
             className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-full"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
