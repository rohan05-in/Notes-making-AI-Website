import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Editor } from "@/components/Editor";
import { AIChat } from "@/components/AIChat";
import DashboardPage from "../../page";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const note = await prisma.note.findUnique({
    where: {
      id: resolvedParams.noteId,
      userId: session.user.id,
    },
  });

  if (!note) {
    notFound();
  }

  // Passing the exact note to the editor
  const noteData = {
    id: note.id,
    title: note.title,
    content: note.content || "",
    isPinned: note.isPinned,
    isArchived: note.isArchived,
    updatedAt: note.updatedAt.toISOString(),
  };

  return (
    <div className="flex h-full w-full">
      {/* We render the DashboardPage notes list in the layout, but Next.js App Router 
          makes us compose this carefully. Since 'page.tsx' replaces the children, 
          we need a 3-column layout here if we want to show the list alongside the editor.
          For now, we'll embed the specific Editor + AI Chat full screen.
      */}
      <div className="flex-1 flex min-w-0">
         <Editor noteId={note.id} initialNote={noteData} />
      </div>
      <AIChat noteContent={noteData.content} />
    </div>
  );
}
