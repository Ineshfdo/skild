import { ClerkProvider } from "@clerk/tanstack-react-start";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import Navbar from "#/components/Navbar";
import appCss from "../styles.css?url";
import { syncUserFn } from "#/tanstack-query/actions";
import { Toaster } from "sonner";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Skild - The Registry for Agentic Intelligence",
			},
			{
				name: "description",
				content:
					"Discover, publish and operate reusable agent capabilities from a route-driven workspace",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	loader: async () => {
		await syncUserFn();
	}
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased wrap-anywhere">
					<ClerkProvider>
						<div id="root-layout">
							<header>
								<div className="frame">
									<Navbar />
								</div>
							</header>
							<main>
								<div className="frame">{children}</div>
							</main>
						</div>

					</ClerkProvider>
				<Toaster 
					position="bottom-center"
					toastOptions={{
						style: {
							background: 'rgba(15, 15, 15, 0.8)',
							backdropFilter: 'blur(12px)',
							border: '1px solid rgba(255, 255, 255, 0.05)',
							color: '#fff',
							borderRadius: '12px',
						},
						className: 'font-sans'
					}}
				/>
				<Scripts />
			</body>
		</html>
	);
}
