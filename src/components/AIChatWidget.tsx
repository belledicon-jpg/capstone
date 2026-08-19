import { Bot, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

const getReply = (question: string) => {
  const normalized = question.toLowerCase();
  if (normalized.includes("water")) return "Water quality is currently 96.8% across all districts. Riverside Station has one sample under review.";
  if (normalized.includes("inspection")) return "2,481 inspections are complete this period, with a 94% completion rate.";
  if (normalized.includes("waste") || normalized.includes("collection")) return "Waste collection reached 1,284 tonnes, up 8.2% from the previous month.";
  return "I can summarize sanitation services, water quality, inspections, and district performance from this dashboard.";
};

export const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! Ask me about current municipal health and sanitation performance." },
  ]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "user", text: question }, { role: "assistant", text: getReply(question) }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="CivicSanity AI assistant"
          className="mb-3 flex h-[440px] w-[calc(100vw-2rem)] max-w-[370px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="flex items-center gap-3 bg-[#0d1b34] px-4 py-3.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600"><Bot className="h-5 w-5" /></span>
            <div className="flex-1"><h2 className="font-heading text-sm font-bold">CivicSanity Assistant</h2><p className="text-[11px] text-blue-200">Dashboard insights · Online</p></div>
            <button type="button" aria-label="Close AI assistant" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
          </header>
          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-2.5 text-sm text-white" : "mr-6 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <label htmlFor="ai-question" className="sr-only">Ask CivicSanity</label>
            <input id="ai-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about performance..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <Button type="submit" size="icon" aria-label="Send message" className="rounded-xl bg-blue-600 hover:bg-blue-700"><Send className="h-4 w-4" /></Button>
          </form>
        </section>
      )}
      <button
        type="button"
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-transform hover:-translate-y-0.5 hover:bg-blue-700"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  );
};
