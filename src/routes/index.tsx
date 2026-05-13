import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import { latestSkillsQueryOptions } from "#/tanstack-query/options";

export const Route = createFileRoute("/")({
	component: Home,
	loader: ({ context }) => context.queryClient.ensureQueryData(latestSkillsQueryOptions()),
});

function Home() {
	const skillsQuery = useSuspenseQuery(latestSkillsQueryOptions());
	const skills = skillsQuery.data;

	return (
    <div id="home" className="relative space-y-32 pb-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <section className="hero relative pt-20 flex flex-col items-center text-center px-4">
        {/* Hero Auroras */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-48 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative space-y-8 max-w-5xl">
          

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            The Registry for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">Agentic Intelligence</span>
          </h1>
          
          <p className="text-text-muted max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed font-medium opacity-80">
            A high-performance registry for procedural agent skills. Discover,
            publish, and operate <span className="text-white italic">reusable agent capabilities</span> from a route-driven workspace.
          </p>
        </div>

        <div className="actions flex flex-wrap items-center justify-center gap-6 mt-12 relative z-10">
          <Link
            to="/registry"
            search={{ q: undefined }}
            className="group relative px-10 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <Terminal size={22} />
              <span>Browse Registry</span>
            </div>
          </Link>
          <Link
            to="/skills/new"
            className="px-10 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-widest backdrop-blur-xl hover:bg-white/[0.08] transition-all hover:border-white/20 active:scale-[0.95]"
          >
            Publish Skill
          </Link>
        </div>
      </section>

      <section className="latest relative z-0 container mx-auto px-4">
        <div className="absolute -right-48 top-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Recently Created
              <span className="text-gradient"> Skills</span>
            </h2>
            <p className="text-text-muted text-lg font-medium opacity-70">
              The latest capabilities added by our community.
            </p>
          </div>
          <Link 
            to="/registry" 
            search={{ q: undefined }}
            className="text-primary font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all group"
          >
            Explore all skills <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="relative">
          {skills.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} {...skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <p className="text-text-muted">No skills have been created yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
	);
}
