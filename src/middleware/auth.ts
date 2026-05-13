import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";

/**
 * Middleware to ensure the user is authenticated.
 * It injects the userId into the context for server functions.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthorized: Please sign in to perform this action.");
	}

	return next({
		context: {
			userId,
		},
	});
});
