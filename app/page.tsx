import Link from "next/link";
import { SparklesIcon, BrainCircuitIcon, MicIcon, FolderIcon, ZapIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuitIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">NeuraNotes <span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900 font-medium">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-32 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] -z-10"></div>

        <div className="text-center max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium animate-bounce">
            <SparklesIcon className="h-4 w-4" />
            <span>AI-Powered Note Taking is Here</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            Capture Your <br />
            <span className="text-indigo-400">Intelligence.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The only note-taking platform that thinks with you. Summarize, organize, and dictate with your own personal AI assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 group">
                Try NeuraNotes Free
                <ZapIcon className="ml-2 h-5 w-5 fill-current group-hover:animate-pulse" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 rounded-2xl backdrop-blur-sm transition-all">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-24 bg-slate-950/50 relative border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuitIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Semantic AI Brain</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Our AI doesn&apos;t just read; it understands relationships between your notes, offering smart summaries and quizzes.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MicIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Speed of Thought</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Record voice notes that instantly transcribe into the editor. Perfect for capturing ideas when you&apos;re on the move.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro Organization</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Folders, tags, and favorites designed for researchers and builders who need a clean, structured workspace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="px-8 py-32 text-center max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex justify-center">
            <ShieldCheckIcon className="h-12 w-12 text-slate-800" />
          </div>
          <blockquote className="text-3xl md:text-4xl font-bold italic text-slate-200 leading-snug">
            &quot;NeuraNotes hasn&apos;t just changed how I take notes; it&apos;s changed how I think. The AI context is a game changer for my research.&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-800"></div>
            <div className="text-left">
              <div className="font-bold text-lg">Alex River</div>
              <div className="text-slate-500 font-medium">Lead researcher at Quantum Labs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <BrainCircuitIcon className="h-5 w-5 text-indigo-400" />
            <span className="font-bold">NeuraNotes AI</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © 2026 NeuraNotes AI. Designed for the future of thinking.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400 hover:text-white">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
