import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ThumbsUp, Bookmark, Copy, Clock, Download, Star, Activity, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toggleUpvoteFn, toggleFavoriteFn, deleteSkillFn } from "#/tanstack-query/actions";
import { skillDetailQueryOptions } from "#/tanstack-query/options";

// Create a Route called /skills/$skillId
// The Loader pre-fetches the data of the skills from the URL
export const Route = createFileRoute("/skills/$skillId")({
	loader: ({ context, params }) => context.queryClient.ensureQueryData(skillDetailQueryOptions(params.skillId)),
	component: SkillDetail,
});

function SkillDetail() {
	// Using the Useparams we can access the URL and get the skillId
	const { skillId } = Route.useParams();
	// Using the queryclient we can manages the data throught out the application 
	const queryClient = useQueryClient();
	// This holds the actual information about the skills 
	const skillQuery = useSuspenseQuery(skillDetailQueryOptions(skillId));
	const { skill, isOwner } = skillQuery.data;
	// Using the useRouter we can navigate through the pages
	const router = useRouter();

	// Using the useMutation we can create, update, delete skill data on the server
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteSkillFn({ data: id }),
		onSuccess: () => {
			toast.success("Skill deleted successfully!");
			router.navigate({ to: "/registry" });
		},
		onError: (err: any) => {
			console.error("Delete failed:", err);
			toast.error(err.message || "Failed to delete skill.");
		}
	});

	const upvoteMutation = useMutation({
		mutationFn: (id: string) => toggleUpvoteFn({ data: id }),
		onSuccess: (result) => {
			toast.success(result.upvoted ? "Upvoted successfully!" : "Upvote removed");
			queryClient.invalidateQueries();
		},
		onError: (err: any) => {
			console.error("Upvote failed:", err);
			const msg = err.message || "";
			if (msg.includes("Unauthorized") || msg.includes("sign in")) {
				toast.error("Please sign in to upvote.");
			} else {
				toast.error(msg || "Failed to upvote.");
			}
		}
	});

	const favoriteMutation = useMutation({
		mutationFn: (id: string) => toggleFavoriteFn({ data: id }),
		onSuccess: (result) => {
			toast.success(result.favorited ? "Saved to favorites!" : "Removed from saved");
			queryClient.invalidateQueries();
		},
		onError: (err: any) => {
			console.error("Save failed:", err);
			const msg = err.message || "";
			if (msg.includes("Unauthorized") || msg.includes("sign in")) {
				toast.error("Please sign in to save.");
			} else {
				toast.error(msg || "Failed to save.");
			}
		}
	});

	const handleDelete = () => {
		if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) return;
		deleteMutation.mutate(skill.id);
	};

	const handleUpvote = () => {
		upvoteMutation.mutate(skill.id);
	};

	const handleSave = () => {
		favoriteMutation.mutate(skill.id);
	};

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard!`);
	};

	return (
		<div id="skill-detail" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
			<button
				onClick={() => window.history.back()}
				className="mb-12 flex items-center gap-2 text-sm font-medium text-text-muted hover:text-white transition-colors"
			>
				<ArrowLeft size={16} />
				<span>Back to Registry</span>
			</button>

			<div className="grid gap-12 lg:grid-cols-[1fr_380px]">
				{/* Main Content */}
				<section className="space-y-12">
					<header className="space-y-6">
						<p className="text-xl leading-relaxed text-text-muted max-w-3xl">
							{skill.description}
						</p>
						<div className="flex flex-wrap gap-2">
							{skill.tags.map((tag: string) => (
								<span
									key={tag}
									className="rounded bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted border border-white/5"
								>
									{tag}
								</span>
							))}
						</div>
					</header>

					{/* Installation */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
								<span className="text-primary">{">_"}</span> Installation
							</h3>
							<button 
								onClick={() => handleCopy(skill.installCommand, "Install command")}
								className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
							>
								<Copy size={12} /> Copy
							</button>
						</div>
						<div className="rounded-lg bg-white/[0.02] border border-white/5 p-5 font-mono text-sm text-text-muted">
							{skill.installCommand}
						</div>
					</div>

					{/* Configuration */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
								<span>{"</>"}</span> Configuration
							</h3>
							<button 
								onClick={() => handleCopy(skill.promptConfig, "Configuration")}
								className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
							>
								<Copy size={12} /> Copy
							</button>
						</div>
						<div className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
							<div className="bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-white/5">
								YAML
							</div>
							<pre className="p-5 font-mono text-sm text-text-muted whitespace-pre-wrap">
								{skill.promptConfig}
							</pre>
						</div>
					</div>

					{/* Usage Example */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
								<Clock size={16} /> Usage Example
							</h3>
							<button 
								onClick={() => handleCopy(skill.usageExample, "Usage example")}
								className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
							>
								<Copy size={12} /> Copy
							</button>
						</div>
						<div className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
							<div className="bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-white/5">
								Typescript
							</div>
							<pre className="p-5 font-mono text-sm text-text-muted whitespace-pre-wrap">
								{skill.usageExample}
							</pre>
						</div>
					</div>
				</section>

				{/* Sidebar */}
				<aside className="space-y-6">
					<div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-8">
						{/* Author Card */}
						<div className="flex items-center gap-4">
							<img
								src={skill.author.imageUrl || "/logo512.png"}
								alt="author"
								className="h-16 w-16 rounded-xl border border-white/10"
							/>
							<div className="space-y-1">
								<h4 className="text-xl font-bold text-white">{skill.author.username}</h4>
								<p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
									<User size={10} className="text-primary" /> Author
								</p>
							</div>
						</div>

						{/* Stats List */}
						<div className="space-y-4 pt-4 border-t border-white/5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 text-text-muted">
									<Clock size={16} />
									<span className="text-xs font-medium">Published</span>
								</div>
								<span className="text-xs font-bold text-white">
									{new Date(skill.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 text-text-muted">
									<Download size={16} />
									<span className="text-xs font-medium">Installs</span>
								</div>
								<span className="text-xs font-bold text-white">25k</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 text-text-muted">
									<Star size={16} />
									<span className="text-xs font-medium">Stars</span>
								</div>
								<span className="text-xs font-bold text-white">{(skill.upvoteCount / 1000).toFixed(1)}k</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3 text-text-muted">
									<Activity size={16} />
									<span className="text-xs font-medium">Usage</span>
								</div>
								<span className="text-xs font-bold text-white">150k</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3 pt-4 border-t border-white/5">
							<button 
								onClick={() => handleCopy(skill.installCommand, "Install command")}
								className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-sm font-bold text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
							>
								<Download size={18} />
								Copy Install Command
							</button>
							<div className="grid grid-cols-2 gap-3">
								<button 
									onClick={handleUpvote}
									className={`flex items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold transition-all ${skill.isUpvoted ? 'bg-white/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-white/5 bg-white/[0.02] text-white hover:bg-white/5'}`}
								>
									<ThumbsUp size={18} fill={skill.isUpvoted ? "currentColor" : "none"} />
									<span>{skill.upvoteCount}</span>
								</button>
								<button 
									onClick={handleSave}
									className={`flex items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold transition-all ${skill.isFavorited ? 'bg-white/10 border-primary text-primary' : 'border-white/5 bg-white/[0.02] text-white hover:bg-white/5'}`}
								>
									<Bookmark size={18} fill={skill.isFavorited ? "currentColor" : "none"} />
									<span>{skill.isFavorited ? 'Saved' : 'Save'}</span>
								</button>
							</div>
							{isOwner && (
								<button 
									onClick={handleDelete}
									className="flex w-full items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 py-4 text-sm font-bold text-destructive hover:bg-destructive hover:text-white active:scale-[0.98] transition-all"
								>
									<Trash2 size={18} />
									Delete Skill
								</button>
							)}
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
