"use client";

import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { submitContact } from "@/server/actions/contact";

interface FooterProps {
  email?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function Footer({ email, githubUrl, linkedinUrl }: FooterProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (formData: FormData) => {
    setStatus("loading");
    const result = await submitContact(formData);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <footer id="contact" className="relative border-t border-slate-800 bg-[#030712] pt-24 pb-12 overflow-hidden font-mono text-slate-300">
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          
          {/* ================= CỘT THÔNG TIN (Dạng JSON Object) ================= */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span className="text-slate-500">My</span>
                Contact
                <span className="animate-pulse">_</span>
              </h2>
              <p className="text-slate-500 max-w-md leading-relaxed">
                {"// I'm always open to discussing new projects, collaborations, or just saying hi!"}
              </p>
            </div>

            {/* Khung chứa thông tin liên hệ giả lập code */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-lg p-5 shadow-xl">
              <div className="mb-2">
                <span className="text-pink-500">const</span> <span className="text-blue-400">contactInfo</span> <span className="text-pink-500">=</span> {"{"}
              </div>
              
              <div className="pl-4 space-y-4 border-l border-slate-800 ml-2">
                
                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-emerald-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> email:
                  </span>
                  {email ? (
                    <a href={`mailto:${email}`} className="text-yellow-300 hover:text-yellow-200 transition-colors underline decoration-slate-600 underline-offset-4 break-all">
                      "{email}"
                    </a>
                  ) : (
                    <span className="text-yellow-300">"Contact via form"</span>
                  )}
                  <span className="text-slate-500">,</span>
                </div>

                {/* Location */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-emerald-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> location:
                  </span>
                  <span className="text-yellow-300">"Ho Chi Minh City, Vietnam"</span>
                  <span className="text-slate-500">,</span>
                </div>

                {/* Socials Array */}
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">socials:</span>
                  <span className="text-slate-500">[</span>
                  <div className="flex gap-4 px-2">
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors group/soc">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="w-4 h-4"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                          <path d="M12 18h.01"></path>
                        </svg>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors group/soc">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="w-4 h-4"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect width="4" height="12" x="2" y="9"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    )}
                  </div>
                  <span className="text-slate-500">]</span>
                </div>

              </div>
              <div className="mt-2">{"};"}</div>
            </div>
          </div>

          {/* ================= CỘT FORM LIÊN HỆ (Cửa sổ Terminal) ================= */}
          {/* 1. THÊM class "group/terminal" vào đây */}
          <div className="group/terminal bg-[#0d1117] border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col hover:border-cyan-500/30 transition-colors duration-500">
            
            {/* Top bar IDE */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {/* 2. SỬA "hover:" thành "group-hover/terminal:" */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover/terminal:bg-red-500/80 transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover/terminal:bg-yellow-500/80 transition-colors duration-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover/terminal:bg-green-500/80 transition-colors duration-300" />
                </div>
                <span className="ml-2 text-xs text-slate-500 select-none">
                  Contact me now.
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1">
              {status === "success" ? (
                // Thông báo Success kiểu dòng lệnh
                <div className="h-full flex flex-col items-start justify-center min-h-[300px] space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold text-lg">EXECUTION SUCCESS</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    <span className="text-emerald-500">{">"}</span> connection established.
                    <br />
                    <span className="text-emerald-500">{">"}</span> payload delivered to destination.
                    <br />
                    <span className="text-emerald-500">{">"}</span> awaiting response...
                  </p>
                  <button onClick={() => setStatus("idle")} className="mt-6 px-4 py-2 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 rounded transition-colors border border-slate-700">
                    Re-run script
                  </button>
                </div>
              ) : (
                <form action={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 text-xs">name:</span>
                      <input name="name" required placeholder="John Doe" className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-14 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all" />
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 text-xs">email:</span>
                      <input name="email" type="email" required placeholder="john@domain.com" className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-16 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all" />
                    </div>

                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500 text-xs">subj:</span>
                    <input name="subject" required placeholder="Hello there!" className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-14 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all" />
                  </div>

                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-slate-500 text-xs">msg:</span>
                    <textarea name="message" required rows={4} placeholder="Type your message here..." className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-14 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all resize-none" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 group"
                  >
                    {status === "loading" ? "Processing..." : "Execute"}
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM FOOTER ================= */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{"// © 2026 Dasi. All rights reserved."}</p>
          <p className="flex items-center gap-2">
            <span className="text-pink-500">dependencies:</span> 
            <span className="text-yellow-300">{"{ Next.js, React, Tailwind, Prisma }"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}