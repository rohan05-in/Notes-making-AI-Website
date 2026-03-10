"use client";

import { useEffect, useState } from "react";
import { FolderIcon, PlusIcon, MoreVerticalIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Folder {
  id: string;
  name: string;
  _count: {
    notes: number;
  };
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    async function fetchFolders() {
      try {
        const res = await fetch("/api/folders");
        if (res.ok) {
          const data = await res.json();
          setFolders(data);
        }
      } catch (error) {
        console.error("Failed to fetch folders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFolders();
  }, []);

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });
      if (res.ok) {
        const newFolder = await res.json();
        setFolders([...folders, { ...newFolder, _count: { notes: 0 } }]);
        setNewFolderName("");
      }
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-bold text-slate-100">Folders</h1>
              <p className="text-slate-500 mt-1">Organize your notes into collections.</p>
           </div>
           
           <form onSubmit={createFolder} className="flex gap-2">
              <Input 
                 placeholder="New folder name..." 
                 className="bg-slate-900 border-slate-800 text-slate-200 w-64"
                 value={newFolderName}
                 onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                 <PlusIcon className="h-4 w-4 mr-2" /> New Folder
              </Button>
           </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full bg-slate-900 rounded-xl" />
             ))}
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
             <FolderIcon className="h-12 w-12 text-slate-700 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-300">No folders yet</h3>
             <p className="text-slate-500 text-sm mt-2">Create your first folder to start organizing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {folders.map((folder) => (
                <Link 
                   key={folder.id} 
                   href={`/dashboard?folderId=${folder.id}`}
                   className="group p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all text-left"
                >
                   <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                         <FolderIcon className="h-6 w-6 text-indigo-400" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                   </div>
                   <h3 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {folder.name}
                   </h3>
                   <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                      <FileTextIcon className="h-3 w-3" />
                      {folder._count.notes} {folder._count.notes === 1 ? 'note' : 'notes'}
                   </div>
                </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
