import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import { savedSkillsQueryOptions } from "#/tanstack-query/options";

export const Route = createFileRoute("/saved")({
	loader: ({ context }) => context.queryClient.ensureQueryData(savedSkillsQueryOptions()),
	component: SavedSkills,
});

function SavedSkills() {
	const skillsQuery = useSuspenseQuery(savedSkillsQueryOptions());
	const skills = skillsQuery.data;

	return (
		<div id="saved-page" className="px-4 py-12 md:px-12">
			<header className="mb-12 space-y-4">
				<div className="flex items-center gap-3 text-primary">
					<Bookmark size={32} />
					<h1 className="text-4xl font-bold tracking-tight text-white">
						Favorites Skills
					</h1>
				</div>
				<p className="max-w-2xl text-lg text-text-muted">
					A collection of agent capabilities you've bookmarked for quick access.
				</p>
			</header>

			<div>
				{skills.length > 0 ? (
					<div className="skills-grid">
						{skills.map((skill) => (
							<SkillCard key={skill.id} {...skill} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle py-24 text-center">
						<Bookmark size={48} className="mb-4 text-text-muted/20" />
						<p className="text-xl font-medium text-text-muted">
							You haven't saved any skills yet.
						</p>
						<Link
							to="/"
							className="mt-6 font-semibold text-primary hover:underline"
						>
							Browse the registry
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
