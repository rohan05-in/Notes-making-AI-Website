"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { MicIcon, SparklesIcon, Loader2Icon, SquareIcon, StarIcon, ArchiveIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

// Ensure TypeScript knows about webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function Editor({ noteId, initialNote }: { noteId: string, initialNote: Note }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content || "");
  const [isPinned, setIsPinned] = useState((initialNote as any).isPinned || false);
  const [isArchived, setIsArchived] = useState((initialNote as any).isArchived || false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date(initialNote.updatedAt));
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-save debounce effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (title === initialNote.title && content === initialNote.content && isPinned === (initialNote as any).isPinned && isArchived === (initialNote as any).isArchived) return;
      
      setSaving(true);
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, isPinned, isArchived }),
        });
        
        if (res.ok) {
           setLastSaved(new Date());
        }
      } catch (error) {
        console.error("Failed to save note", error);
      } finally {
        setSaving(false);
      }
    }, 1500); // Save 1.5s after user stops typing

    return () => clearTimeout(timer);
  }, [title, content, isPinned, isArchived, noteId, initialNote]);

  const togglePin = () => setIsPinned(!isPinned);
  const toggleArchive = () => setIsArchived(!isArchived);

  const deleteNote = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // View Initialization for Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
             setContent((prev) => prev + (prev.length > 0 ? " " : "") + currentTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === "not-allowed") {
             setVoiceError("Microphone access denied. Please allow microphone permissions in your browser settings.");
          } else {
             setVoiceError(`Voice error: ${event.error}`);
          }
          setIsRecording(false);
          
          // Clear error after 5 seconds
          setTimeout(() => setVoiceError(null), 5000);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
       recognitionRef.current?.stop();
       setIsRecording(false);
    } else {
       if (recognitionRef.current) {
          try {
             recognitionRef.current.start();
             setIsRecording(true);
          } catch(e) {
             console.error("Failed to start recording:", e);
          }
       } else {
          alert("Speech Recognition API is not supported in this browser.");
       }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 px-8 py-6 overflow-y-auto w-full relative">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50 relative z-10">
         <div className="text-sm text-slate-500 font-medium tracking-wide">
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              `Last edited ${format(lastSaved, "h:mm a")}`
            )}
         </div>

         <div className="flex items-center gap-2">
            <Button 
               onClick={togglePin}
               variant="ghost" 
               size="sm" 
               className={`h-8 w-8 p-0 ${isPinned ? "text-yellow-400 hover:text-yellow-300" : "text-slate-500 hover:text-slate-300"}`}
            >
               <StarIcon className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
            </Button>
            <Button 
               onClick={toggleArchive}
               variant="ghost" 
               size="sm" 
               className={`h-8 w-8 p-0 ${isArchived ? "text-orange-400 hover:text-orange-300" : "text-slate-500 hover:text-slate-300"}`}
            >
               <ArchiveIcon className={`h-4 w-4 ${isArchived ? "fill-current" : ""}`} />
            </Button>
            <Button 
               onClick={deleteNote}
               variant="ghost" 
               size="sm" 
               className="h-8 w-8 p-0 text-slate-500 hover:text-red-400"
            >
               <Trash2Icon className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <Button 
               onClick={toggleRecording}
               variant="outline" 
               size="sm" 
               className={`border-slate-700 transition-colors ${
                 isRecording 
                   ? "bg-red-950/30 text-red-400 border-red-900/50 hover:bg-red-900/40 hover:text-red-300 animate-pulse" 
                   : "bg-slate-900 text-slate-300 hover:bg-slate-800"
               }`}
            >
               {isRecording ? (
                  <><SquareIcon className="h-4 w-4 mr-2 fill-current" /> Stop Voice Note</>
               ) : (
                  <><MicIcon className="h-4 w-4 mr-2" /> Start Voice Note</>
               )}
            </Button>
            <Button variant="outline" size="sm" className="bg-indigo-950/30 border-indigo-900/50 text-indigo-300 hover:bg-indigo-900/50 hover:text-indigo-200">
               <SparklesIcon className="h-4 w-4 mr-2" /> AI Summary
            </Button>
         </div>
      </div>

      {voiceError && (
         <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {voiceError}
         </div>
      )}

      {isRecording && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 z-20 shadow-lg backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Listening...
         </div>
      )}

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
        className="text-4xl font-bold bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 mb-6 w-full relative z-10"
      />

      {/* Content Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing or click 'Start Voice Note'..."
        className="flex-1 w-full bg-transparent border-none outline-none text-slate-300 placeholder:text-slate-600 resize-none text-lg leading-relaxed font-sans relative z-10"
      />
    </div>
  );
}
