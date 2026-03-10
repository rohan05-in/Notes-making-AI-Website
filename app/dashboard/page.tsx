"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { PlusIcon, SearchIcon, StickyNoteIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const isSearchOpen = searchParams.get("search") === "true";
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  const createNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note" }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
      }
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  const filteredNotes = notes.filter((n) => {
    // Search query filter
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // View filter
    if (filter === "favorites") {
      return n.isPinned && !n.isArchived;
    }
    if (filter === "archive") {
      return n.isArchived;
    }
    
    // Default view: Show only non-archived notes
    return !n.isArchived;
  });

  const getHeading = () => {
    if (filter === "favorites") return "Favorites";
    if (filter === "archive") return "Archive";
    return "All Notes";
  };

  return (
    <div className="flex flex-1 h-full">
      {/* Notes List Column */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">{getHeading()}</h2>
          <Button onClick={createNote} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-400">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search notes..."
              className="pl-9 bg-slate-800/50 border-slate-700 text-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-slate-800" />
                  <Skeleton className="h-4 w-1/2 bg-slate-800" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
             <div className="p-8 text-center text-slate-500 flex flex-col items-center">
               <StickyNoteIcon className="h-8 w-8 mb-2 opacity-50" />
               <p className="text-sm">No notes found.</p>
             </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/dashboard/notes/${note.id}`}
                  className="block p-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <p className="font-medium text-slate-200 truncate">
                    {note.title || "Untitled Note"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(note.updatedAt), "MMM d, yyyy")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Editor Placeholder / Empty State */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8">
         <div className="max-w-md text-center">
            <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-800">
               <FileTextIcon className="h-8 w-8 text-indigo-500/50" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">Select a note to view</h3>
            <p className="text-slate-500 mb-6 text-sm">Choose a note from the left sidebar, or create a new one to start writing.</p>
            <Button onClick={createNote} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create New Note
            </Button>
         </div>
      </div>
    </div>
  );
}
