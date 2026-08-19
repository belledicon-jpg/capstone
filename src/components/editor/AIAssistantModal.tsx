import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIAssistantService } from "@/services/aiAssistant";
import { Sparkles, Wand2, FileText, Check, Copy, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  currentExcerpt: string;
  onApplyTitle: (title: string) => void;
  onApplyExcerpt: (excerpt: string) => void;
  onInsertOutline: (points: string[]) => void;
}

export const AIAssistantModal = ({
  open,
  onOpenChange,
  currentTitle,
  currentExcerpt,
  onApplyTitle,
  onApplyExcerpt,
  onInsertOutline,
}: Props) => {
  const [tab, setTab] = useState<"titles" | "outline" | "excerpt">("titles");
  const [topicPrompt, setTopicPrompt] = useState(currentTitle || "");
  const [loading, setLoading] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [generatedOutline, setGeneratedOutline] = useState<string[]>([]);
  const [generatedExcerpt, setGeneratedExcerpt] = useState("");

  const handleGenerateTitles = async () => {
    setLoading(true);
    try {
      const titles = await AIAssistantService.generateTitles(topicPrompt || "Next-gen Web Architectures");
      setGeneratedTitles(titles);
      toast.success("AI generated headline suggestions!");
    } catch {
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOutline = async () => {
    setLoading(true);
    try {
      const outline = await AIAssistantService.generateOutline(topicPrompt || "Multi-tenant systems");
      setGeneratedOutline(outline);
      toast.success("Outline generated!");
    } catch {
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExcerpt = async () => {
    setLoading(true);
    try {
      const excerpt = await AIAssistantService.generateExcerpt(topicPrompt);
      setGeneratedExcerpt(excerpt);
      toast.success("SEO summary crafted!");
    } catch {
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg">Eprovider AI Copilot</DialogTitle>
              <DialogDescription className="text-xs">
                Enhance draft headlines, generate structured outlines, and craft SEO summaries.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl text-xs font-medium">
          <button
            onClick={() => setTab("titles")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "titles" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Title Ideas
          </button>
          <button
            onClick={() => setTab("outline")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "outline" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            Article Outline
          </button>
          <button
            onClick={() => setTab("excerpt")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "excerpt" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground"
            }`}
          >
            SEO Excerpt
          </button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-muted-foreground">Topic or Seed Idea</label>
          <div className="flex gap-2">
            <Input
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Distributed databases with PostgreSQL and RLS"
              className="text-xs"
            />
            <Button
              size="sm"
              disabled={loading}
              onClick={() => {
                if (tab === "titles") handleGenerateTitles();
                if (tab === "outline") handleGenerateOutline();
                if (tab === "excerpt") handleGenerateExcerpt();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5 mr-1" />}
              Generate
            </Button>
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[160px] max-h-[260px] overflow-y-auto p-3 bg-secondary/40 rounded-xl border border-border/60 space-y-2">
          {tab === "titles" && (
            <div className="space-y-2">
              {generatedTitles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center pt-8">
                  Click <strong>Generate</strong> to create compelling headline variations.
                </p>
              ) : (
                generatedTitles.map((title, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-background rounded-lg border border-border flex items-center justify-between text-xs group hover:border-amber-500"
                  >
                    <span className="font-medium pr-2 text-foreground">{title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onApplyTitle(title);
                        toast.success("Applied title to editor!");
                        onOpenChange(false);
                      }}
                      className="h-7 text-[11px] text-amber-600 hover:bg-amber-500/10"
                    >
                      Use <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "outline" && (
            <div className="space-y-2">
              {generatedOutline.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center pt-8">
                  Generate a structured 5-part section roadmap for your article.
                </p>
              ) : (
                <>
                  <div className="space-y-1 text-xs">
                    {generatedOutline.map((p, i) => (
                      <div key={i} className="p-2 bg-background rounded border border-border/80">
                        {p}
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onInsertOutline(generatedOutline);
                      toast.success("Inserted outline blocks into editor!");
                      onOpenChange(false);
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 mt-2"
                  >
                    Insert Outline to Editor
                  </Button>
                </>
              )}
            </div>
          )}

          {tab === "excerpt" && (
            <div className="space-y-2">
              {!generatedExcerpt ? (
                <p className="text-xs text-muted-foreground text-center pt-8">
                  Click Generate to create a concise meta description suitable for social sharing and search engines.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-background rounded-lg border border-border text-xs leading-relaxed">
                    {generatedExcerpt}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onApplyExcerpt(generatedExcerpt);
                      toast.success("Applied excerpt!");
                      onOpenChange(false);
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                  >
                    Apply as Article Excerpt
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};