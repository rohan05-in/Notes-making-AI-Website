"use client";

import { useEffect, useState } from "react";
import { HashIcon, PlusIcon, MoreVerticalIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  _count: {
    notes: number;
  };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data);
        }
      } catch (error) {
        console.error("Failed to fetch tags", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      });
      if (res.ok) {
        const newTag = await res.json();
        setTags([...tags, { ...newTag, _count: { notes: 0 } }]);
        setNewTagName("");
      }
    } catch (error) {
      console.error("Failed to create tag", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-bold text-slate-100">Tags</h1>
              <p className="text-slate-500 mt-1">Label and search notes efficiently.</p>
           </div>
           
           <form onSubmit={createTag} className="flex gap-2">
              <Input 
                 placeholder="New tag name..." 
                 className="bg-slate-900 border-slate-800 text-slate-200 w-64"
                 value={newTagName}
                 onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                 <PlusIcon className="h-4 w-4 mr-2" /> Create Tag
              </Button>
           </form>
        </div>

        {loading ? (
          <div className="flex flex-wrap gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-12 w-32 bg-slate-900 rounded-full" />
             ))}
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
             <HashIcon className="h-12 w-12 text-slate-700 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-300">No tags yet</h3>
             <p className="text-slate-500 text-sm mt-2">Create your first tag to label your notes.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
             {tags.map((tag) => (
                <Link 
                   key={tag.id} 
                   href={`/dashboard?tagId=${tag.id}`}
                   className="group px-4 py-2 bg-slate-900 border border-slate-800 rounded-full hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center gap-2"
                >
                   <HashIcon className="h-4 w-4 text-slate-500 group-hover:text-indigo-400" />
                   <span className="font-medium text-slate-300 group-hover:text-white">
                      {tag.name}
                   </span>
                   <span className="text-xs bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
                      {tag._count.notes}
                   </span>
                </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
