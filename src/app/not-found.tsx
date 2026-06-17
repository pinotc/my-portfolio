import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 font-mono relative overflow-hidden selection:bg-red-500/30">
      
      {/* Hiệu ứng ánh sáng nền cảnh báo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-2xl w-full bg-[#0d1117] border border-slate-800 rounded-lg shadow-2xl overflow-hidden relative z-10">
        
        {/* Top bar IDE */}
        <div className="flex items-center px-4 py-3 bg-slate-900/80 border-b border-slate-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <span className="ml-4 text-xs text-slate-500">
            root@system: /var/log/nginx/error.log
          </span>
        </div>

        {/* Body Nội dung lỗi */}
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-2 text-slate-500 mb-6 text-sm">
            <Terminal className="w-5 h-5 text-red-500" />
            <span>SYSTEM_ERROR_CODE_404</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
            <span className="text-red-500">FATAL:</span>Page Not Found<span className="animate-pulse">_</span>
          </h1>

          <div className="space-y-3 text-sm md:text-base text-slate-400 mb-12 border-l-2 border-slate-800 pl-4">
            <p>
              <span className="text-red-400 font-bold">ERR_CONNECTION_REFUSED:</span> The requested URL was not found on this server.
            </p>
            <p>
              <span className="text-yellow-400 font-bold">WARNING:</span> You have ventured into uncharted cyberspace.
            </p>
            <p>
              <span className="text-emerald-400 font-bold">SUGGESTION:</span> Verify the route path or execute the return command.
            </p>
          </div>

          {/* Nút hành động */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 rounded-md transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back Home
          </Link>
          
        </div>
      </div>
    </div>
  );
}