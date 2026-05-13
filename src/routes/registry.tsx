import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import SkillCard from "#/components/SkillCard";
import { registrySkillsQueryOptions } from "#/tanstack-query/options";

export const Route = createFileRoute("/registry")({
  loader: ({ context }) => context.queryClient.ensureQueryData(registrySkillsQueryOptions()),
  component: Registry,
});

function Registry() {
  const skillsQuery = useSuspenseQuery(registrySkillsQueryOptions());
  const skills = skillsQuery.data;

  return (
    <div id="registry" className="relative py-20 space-y-20 overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Premium Header Section */}
      <header className="relative space-y-8 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
        
        <div className="space-y-6 relative">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
            Explore the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">Skill Registry</span>
          </h1>
          <p className="text-text-muted max-w-3xl text-xl md:text-2xl leading-relaxed font-medium opacity-80 mx-auto">
            A high-performance collection of agentic capabilities. <br className="hidden md:block" />
            Discover, integrate, and deploy <span className="text-white italic">reusable intelligence</span>.
          </p>
        </div>
      </header>

      <main className="relative z-0">
        <div className="absolute -left-64 bottom-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[180px] pointer-events-none" />
        {skills.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <h3 className="text-xl font-bold text-white">No skills found</h3>
            <p className="text-text-muted">
              The registry is currently empty. Check back later!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
