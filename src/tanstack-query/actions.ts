import { createServerFn } from "@tanstack/react-start";
import { clerkClient } from "@clerk/tanstack-react-start/server";
import { z } from "zod";
import { authMiddleware } from "#/middleware/auth";

async function ensureUserSynced(userId: string) {
	try {
		const { upsertUser } = await import("#/includes/queries");
		const user = await clerkClient().users.getUser(userId);
		await upsertUser({
			clerk_id: user.id,
			email: user.emailAddresses[0]?.emailAddress || "",
			username: user.username || user.firstName || "Anonymous",
			image_url: user.imageUrl,
		});
	} catch (error) {
		console.error("Error ensuring user is synced:", error);
	}
}

export const syncUserFn = createServerFn({ method: "POST" })
	.handler(async () => {
		const { auth } = await import("@clerk/tanstack-react-start/server");
		const { userId } = await auth();
		
		if (!userId) {
			return null;
		}

		try {
			await ensureUserSynced(userId);
			return { success: true };
		} catch (error) {
			console.error("Sync User Error:", error);
			return null;
		}
	});

export const createSkillFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		z.object({
			title: z.string().min(3, "Title must be at least 3 characters"),
			description: z.string().min(10, "Description must be at least 10 characters"),
			tags: z.array(z.string()).min(1, "Select at least one tag"),
			installCommand: z.string().min(5, "Install command is required"),
			promptConfig: z.string().min(10, "Prompt configuration is required"),
			usageExample: z.string().min(10, "Usage example is required"),
		}),
	)
	.handler(async ({ data, context }) => {
		try {
			const { createSkill } = await import("#/includes/queries");
			const userId = context.userId;

			const user = await clerkClient().users.getUser(userId);
			const username = user.username || user.firstName || "Anonymous";

			const skillId = crypto.randomUUID();
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

export const deleteSkillFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(z.string())
	.handler(async ({ data: skillId, context }) => {
		try {
			const { getSkillById, deleteSkill } = await import("#/includes/queries");
			const userId = context.userId;

			const skill = await getSkillById(skillId);
			if (!skill) throw new Error("Skill not found.");

			if (skill.author.clerkId !== userId) {
				throw new Error("Forbidden: You can only delete your own skills.");
			}

			await deleteSkill(skillId);
			return { success: true };
		} catch (error: any) {
			console.error("Delete Skill Error:", error);
			throw new Error(error.message || "Failed to delete skill.");
		}
	});

export const toggleUpvoteFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((skillId: string) => skillId)
	.handler(async ({ data: skillId, context }: { data: string; context: any }) => {
		try {
			const { toggleUpvote } = await import("#/includes/queries");
			const userId = context.userId;
			
			const user = await clerkClient().users.getUser(userId);
			const username = user.username || user.firstName || "Anonymous";
			
			return await toggleUpvote(userId, username, skillId);
		} catch (error: any) {
			console.error("Upvote Error:", error);
			throw new Error(error.message || "Failed to upvote.");
		}
	});

export const toggleFavoriteFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((skillId: string) => skillId)
	.handler(async ({ data: skillId, context }: { data: string; context: any }) => {
		try {
			const { isFavorited, removeFavorite, getSkillById, addFavorite } = await import("#/includes/queries");
			const userId = context.userId;

			const user = await clerkClient().users.getUser(userId);
			const username = user.username || user.firstName || "Anonymous";

			const favorited = await isFavorited(userId, skillId);
			if (favorited) {
				await removeFavorite(userId, skillId);
				return { favorited: false };
			} else {
				const skill = await getSkillById(skillId);
				await addFavorite(userId, username, skillId, skill?.title || "Unknown Skill");
				return { favorited: true };
			}
		} catch (error: any) {
			console.error("Favorite Error:", error);
			throw new Error(error.message || "Failed to save.");
		}
	});
