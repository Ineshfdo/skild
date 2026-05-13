import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowBigUp, ArrowUpRight, Bookmark, Check, Copy, } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { SkillWithAuthor } from "#/includes/queries";
import { toggleUpvoteFn, toggleFavoriteFn } from "#/tanstack-query/actions";

type SkillCardProps = SkillWithAuthor;

const SkillCard = ({
	id, createdAt, description, installCommand, tags, title, author, upvoteCount, isUpvoted, isFavorited
	}: SkillCardProps) => {
	const [copied, setCopied] = useState(false);
	// Using the queryClient it tell app to refresh whenever somthing changes or update.
	const queryClient = useQueryClient();

	// useMutation = Handles server actions and refreshes the UI when data changes.
	const upvoteMutation = useMutation({
		mutationFn: (skillId: string) => toggleUpvoteFn({ data: skillId }),
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: () => {
			toast.error("Please sign in to upvote.");
		}
	});

	const favoriteMutation = useMutation({
		mutationFn: (skillId: string) => toggleFavoriteFn({ data: skillId }),
		onSuccess: (result) => {
			toast.success(result.favorited ? "Saved to favorites!" : "Removed from saved");
			queryClient.invalidateQueries();
		},
		onError: () => {
			toast.error("Please sign in to save.");
		}
	});

	const category = tags[0] ?? "General";

	const handleCopy = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText(installCommand);
		setCopied(true);
		toast.success("Install command copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const handleUpvote = (e: React.MouseEvent) => {
		// Prevents the default browser action from happening on the element.
		e.preventDefault();
		// Prevents the click event from triggering actions on parent elements.
		e.stopPropagation();
		upvoteMutation.mutate(id);
	};

	const handleSave = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		favoriteMutation.mutate(id);
	};

	return (
		<article className="skill-card">
			<Link
				to="/skills/$skillId"
				params={{ skillId: id }}
				tabIndex={-1}
				aria-label={`Open ${title}`}
				className="overlay"
			/>
			<div className="chrome">
				<div className="chrome-bar">
					<div className="lights">
						<div className="light red" />
						<div className="light amber" />
						<div className="light green" />
					</div>
					<div className="host">registry.sh</div>
				</div>
			</div>
			<div className="body">
				<div className="meta">
					<div className="author">
						<img
							src={author.imageUrl || "/logo512.png"}
							alt="avatar"
							className="avatar"
						/>
						<div className="author-copy">
							<p>{author.username}</p>

							<p>
								{createdAt
									? new Date(createdAt).toLocaleDateString()
									: "Unknown date"}
							</p>
						</div>
					</div>
					<p className="category">{category}</p>
				</div>
				<div className="summary">
					<Link to="/skills/$skillId" params={{ skillId: id }} className="title-link">
						<h3>{title}</h3>
					</Link>
					<p>{description}</p>
				</div>
				<div className="command">
					<div className="command-copy">
						<span>{">_"}</span>
						<p>{installCommand}</p>
					</div>
					<button
						type="button"
						className="copy flex items-center gap-1.5 hover:text-white"
						onClick={handleCopy}
						aria-label="Copy install command"
					>
						{copied ? (
							<>
								<Check size={14} className="text-green-500" />
								<span className="text-xs font-medium text-green-500">
									Copied
								</span>
							</>
						) : (
							<Copy size={16} />
						)}
					</button>
				</div>
				<div className="footer">
					<div className="stats">
						<button
							type="button"
							className={`upvote hover:text-white transition-colors flex items-center gap-1.5 ${isUpvoted ? 'text-primary' : 'text-text-muted'}`}
							onClick={handleUpvote}
						>
							<ArrowBigUp size={16} fill={isUpvoted ? "currentColor" : "none"} />
							<span>{upvoteCount}</span>
						</button>
					</div>
					<div className="actions">
						<Link
							to="/skills/$skillId"
							params={{ skillId: id }}
							className="open"
							title={`Open ${title}`}
						>
							<span>Open</span>
							<ArrowUpRight size={14} />
						</Link>
						<button
							type="button"
							className={`save transition-colors ${isFavorited ? 'text-primary' : 'text-text-muted hover:text-white'}`}
							onClick={handleSave}
							aria-label="Save skill"
						>
							<Bookmark size={16} fill={isFavorited ? "currentColor" : "none"} />
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default SkillCard;
