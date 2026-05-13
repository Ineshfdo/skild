import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { Bookmark, LogIn, Plus } from "lucide-react";

const Navbar = () => (
	<nav className="navbar">
		<div className="brand">
			<Link to="/">
				<span className="text-3xl">Skild</span>
			</Link>
		</div>
		<div className="actions">
			<Show when={"signed-in"}>
				<Link to="/skills/new" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-white mr-6">
					<Plus size={18} />
					<span>Publish</span>
				</Link>
				<Link to="/saved" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-white mr-4">
					<Bookmark size={18} />
					<span>Favorites</span>
				</Link>
				<UserButton />
			</Show>
			<Show when={"signed-out"}>
				<Link to="/sign-in/$" className="btn-primary">
					<LogIn size={15} />
					Sign in
				</Link>
			</Show>
		</div>
	</nav>
);

export default Navbar;
