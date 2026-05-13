import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { toast } from "sonner";
import { Terminal, Plus, Shield, Zap, Code, BookOpen } from "lucide-react";
import { useState } from "react";
import { clerkClient } from "@clerk/tanstack-react-start/server";
import { z } from "zod";

const createSkillFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(3),
      description: z.string().min(10),
      tags: z.array(z.string()).min(1),
      installCommand: z.string().min(5),
      promptConfig: z.string().min(10),
      usageExample: z.string().min(10),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const { createSkill } = await import("#/includes/queries");
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      const user = await clerkClient().users.getUser(userId);
      const username = user.username || user.firstName || "Anonymous";
      
      const skillId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await createSkill({
        id: skillId,
        ...data,
        authorClerkId: userId,
        authorUsername: username,
      });

      return { success: true, skillId };
    } catch (error: any) {
      console.error("Create Skill Error:", error);
      throw new Error(error.message || "Failed to create skill.");
    }
  });

const checkAuthFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const { userId } = await auth();
    return { userId };
  });

export const Route = createFileRoute("/skills/new")({
  beforeLoad: async () => {
    const { userId } = await checkAuthFn();
    if (!userId) {
      throw redirect({ to: "/" });
    }
  },
  component: PublishSkill,
});

function PublishSkill() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  // State-based form for maximum compatibility with current environment
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    installCommand: "",
    promptConfig: "",
    usageExample: "",
  });

  const availableTags = ["Automation", "Web", "System", "Data", "Security", "DevOps", "AI", "Cloud"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createSkillFn({ data: formData });
      if (result?.skillId) {
        toast.success("Skill published successfully!");
        navigate({ to: "/skills/$skillId", params: { skillId: result.skillId } });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const rawTags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
      setFormData(prev => {
        const newTags = [...prev.tags];
        for (const tag of rawTags) {
          if (!newTags.includes(tag)) {
            newTags.push(tag);
          }
        }
        return { ...prev, tags: newTags };
      });
      setTagInput("");
    }
  };

  return (
    <div className="relative py-20 px-4 max-w-4xl mx-auto">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
          <Plus size={14} />
          Create New Capability
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          Publish a <span className="text-gradient">New Skill</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium opacity-80">
          Contribute to the collective intelligence. Share your high-performance 
          agentic procedures with the community.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="relative space-y-12">
        {/* Core Identity Section */}
        <section className="space-y-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-white font-bold text-lg mb-4">
            <Shield className="text-primary" size={20} />
            Skill Identity
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-text-muted uppercase tracking-wider pl-1">Title</label>
              <input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Advanced Web Scraper"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold text-text-muted uppercase tracking-wider pl-1">Description</label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe what this skill does and how it helps agents..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-text-muted uppercase tracking-wider pl-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                          : "bg-white/[0.03] border-white/10 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tags separated by commas and press Enter..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white text-sm outline-none focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim()) {
                      const rawTags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
                      setFormData(prev => {
                        const newTags = [...prev.tags];
                        for (const tag of rawTags) {
                          if (!newTags.includes(tag)) {
                            newTags.push(tag);
                          }
                        }
                        return { ...prev, tags: newTags };
                      });
                      setTagInput("");
                    }
                  }}
                  className="p-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Config Section */}
        <section className="space-y-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-white font-bold text-lg mb-4">
            <Zap className="text-primary" size={20} />
            Execution & Logic
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2 pl-1">
                <Terminal size={14} className="text-primary" />
                <label htmlFor="installCommand" className="text-sm font-bold text-text-muted uppercase tracking-wider">Install Command</label>
              </div>
              <input
                id="installCommand"
                required
                value={formData.installCommand}
                onChange={(e) => setFormData(p => ({ ...p, installCommand: e.target.value }))}
                placeholder="e.g. npx create-agent-skill@latest ..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2 pl-1">
                <Code size={14} className="text-primary" />
                <label htmlFor="promptConfig" className="text-sm font-bold text-text-muted uppercase tracking-wider">Prompt Configuration</label>
              </div>
              <textarea
                id="promptConfig"
                required
                value={formData.promptConfig}
                onChange={(e) => setFormData(p => ({ ...p, promptConfig: e.target.value }))}
                placeholder="System prompts, environment variables, or config JSON..."
                rows={6}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2 pl-1">
                <BookOpen size={14} className="text-primary" />
                <label htmlFor="usageExample" className="text-sm font-bold text-text-muted uppercase tracking-wider">Usage Example</label>
              </div>
              <textarea
                id="usageExample"
                required
                value={formData.usageExample}
                onChange={(e) => setFormData(p => ({ ...p, usageExample: e.target.value }))}
                placeholder="Example scenario or code snippet of how to use this skill..."
                rows={6}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner resize-none"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Publishing..." : "Publish Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}
