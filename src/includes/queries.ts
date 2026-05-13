import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "./db.ts";

// Type definitions 

export interface DbUser {
	clerk_id: string;
	email: string;
	username: string | null;
	image_url: string | null;
}

export interface DbSkill {
	id: string;
	title: string;
	description: string;
	tags: string; // stored as JSON string in MySQL
	install_command: string;
	prompt_config: string;
	usage_example: string;
	created_at: string;
	author_clerk_id: string;
}

/** Shape returned by getSkills (skill + joined author info) */
export interface SkillWithAuthor {
	id: string;
	title: string;
	description: string;
	tags: string[];
	installCommand: string;
	promptConfig: string;
	usageExample: string;
	createdAt: string;
	author: {
		clerkId: string;
		email: string;
		username: string | null;
		imageUrl: string | null;
	};
	upvoteCount: number;
	isUpvoted?: boolean;
	isFavorited?: boolean;
}

export interface DbFavorite {
	id: number;
	user_clerk_id: string;
	username: string | null;
	skill_id: string;
	skill_name: string | null;
	created_at: string;
}

// USER QUERIES 

/** Insert a user (create if not exists, update if exists) */
export async function upsertUser(user: DbUser) {
	const sql = `
    INSERT INTO users (clerk_id, email, username, image_url)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      username = VALUES(username),
      image_url = VALUES(image_url)
  `;
	const [result] = await pool.execute<ResultSetHeader>(sql, [
		user.clerk_id,
		user.email,
		user.username,
		user.image_url,
	]);
	return result;
}

/** Get a single user by their Clerk ID */
export async function getUserByClerkId(
	clerkId: string,
): Promise<DbUser | null> {
	const [rows] = await pool.execute<RowDataPacket[]>(
		"SELECT * FROM users WHERE clerk_id = ?",
		[clerkId],
	);
	return (rows[0] as DbUser) ?? null;
}

/** Get all users */
export async function getAllUsers(): Promise<DbUser[]> {
	const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users");
	return rows as DbUser[];
}

/** Delete a user by Clerk ID */
export async function deleteUser(clerkId: string) {
	const [result] = await pool.execute<ResultSetHeader>(
		"DELETE FROM users WHERE clerk_id = ?",
		[clerkId],
	);
	return result;
}

// SKILL QUERIES

/** Get skills with optional search, ordered by newest first */
export async function getSkills(
	searchTerm = "",
	limit = 10,
	userClerkId: string | null = null,
): Promise<SkillWithAuthor[]> {
	const search = `%${searchTerm}%`;
	const sql = `
    SELECT
      s.id,
      s.title,
      s.description,
      s.tags,
      s.install_command,
      s.prompt_config,
      s.usage_example,
      s.created_at,
      u.clerk_id   AS author_clerk_id,
      u.email       AS author_email,
      u.username    AS author_username,
      u.image_url   AS author_image_url,
      (SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id) AS upvote_count,
      ${userClerkId ? `(SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id AND user_clerk_id = ${pool.escape(userClerkId)}) > 0` : "FALSE"} AS is_upvoted,
      ${userClerkId ? `(SELECT COUNT(*) FROM favorites WHERE skill_id = s.id AND user_clerk_id = ${pool.escape(userClerkId)}) > 0` : "FALSE"} AS is_favorited
    FROM skills s
    JOIN users u ON s.author_clerk_id = u.clerk_id
    WHERE s.title LIKE ? OR s.description LIKE ?
    ORDER BY s.created_at DESC
    LIMIT ?
  `;
	const [rows] = await pool.execute<RowDataPacket[]>(sql, [
		search,
		search,
		limit,
	]);

	return (rows as Array<Record<string, unknown>>).map((row) => ({
		id: row.id as string,
		title: row.title as string,
		description: row.description as string,
		tags: JSON.parse((row.tags as string) || "[]"),
		installCommand: row.install_command as string,
		promptConfig: row.prompt_config as string,
		usageExample: row.usage_example as string,
		createdAt: row.created_at as string,
		author: {
			clerkId: row.author_clerk_id as string,
			email: row.author_email as string,
			username: (row.author_username as string) ?? null,
			imageUrl: (row.author_image_url as string) ?? null,
		},
		upvoteCount: Number(row.upvote_count),
		isUpvoted: Boolean(row.is_upvoted),
		isFavorited: Boolean(row.is_favorited),
	}));
}

/** Get a single skill by ID */
export async function getSkillById(
	id: string,
	userClerkId: string | null = null,
): Promise<SkillWithAuthor | null> {
	const sql = `
    SELECT
      s.id,
      s.title,
      s.description,
      s.tags,
      s.install_command,
      s.prompt_config,
      s.usage_example,
      s.created_at,
      u.clerk_id   AS author_clerk_id,
      u.email       AS author_email,
      u.username    AS author_username,
      u.image_url   AS author_image_url,
      (SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id) AS upvote_count,
      ${userClerkId ? `(SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id AND user_clerk_id = ${pool.escape(userClerkId)}) > 0` : "FALSE"} AS is_upvoted,
      ${userClerkId ? `(SELECT COUNT(*) FROM favorites WHERE skill_id = s.id AND user_clerk_id = ${pool.escape(userClerkId)}) > 0` : "FALSE"} AS is_favorited
    FROM skills s
    JOIN users u ON s.author_clerk_id = u.clerk_id
    WHERE s.id = ?
  `;
	const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);
	const row = rows[0] as Record<string, unknown> | undefined;
	if (!row) return null;

	return {
		id: row.id as string,
		title: row.title as string,
		description: row.description as string,
		tags: JSON.parse((row.tags as string) || "[]"),
		installCommand: row.install_command as string,
		promptConfig: row.prompt_config as string,
		usageExample: row.usage_example as string,
		createdAt: row.created_at as string,
		author: {
			clerkId: row.author_clerk_id as string,
			email: row.author_email as string,
			username: (row.author_username as string) ?? null,
			imageUrl: (row.author_image_url as string) ?? null,
		},
		upvoteCount: Number(row.upvote_count),
		isUpvoted: Boolean(row.is_upvoted),
		isFavorited: Boolean(row.is_favorited),
	};
}

/** Create a new skill */
export async function createSkill(skill: {
	id: string;
	title: string;
	description: string;
	tags: string[];
	installCommand: string;
	promptConfig: string;
	usageExample: string;
	authorClerkId: string;
	authorUsername: string;
}) {
	const sql = `
    INSERT INTO skills (id, title, description, tags, install_command, prompt_config, usage_example, author_clerk_id, author_username)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
	const [result] = await pool.execute<ResultSetHeader>(sql, [
		skill.id,
		skill.title,
		skill.description,
		JSON.stringify(skill.tags),
		skill.installCommand,
		skill.promptConfig,
		skill.usageExample,
		skill.authorClerkId,
		skill.authorUsername,
	]);
	return result;
}


/** Delete a skill by ID */
export async function deleteSkill(id: string) {
	const [result] = await pool.execute<ResultSetHeader>(
		"DELETE FROM skills WHERE id = ?",
		[id],
	);
	return result;
}

// FAVORITES QUERIES 


/** Add a skill to favorites */
export async function addFavorite(userClerkId: string, username: string, skillId: string, skillName: string) {
	const sql = `
    INSERT IGNORE INTO favorites (user_clerk_id, username, skill_id, skill_name)
    VALUES (?, ?, ?, ?)
  `;
	const [result] = await pool.execute<ResultSetHeader>(sql, [
		userClerkId,
		username,
		skillId,
		skillName,
	]);
	return result;
}

/** Remove a skill from favorites */
export async function removeFavorite(userClerkId: string, skillId: string) {
	const sql = `DELETE FROM favorites WHERE user_clerk_id = ? AND skill_id = ?`;
	const [result] = await pool.execute<ResultSetHeader>(sql, [
		userClerkId,
		skillId,
	]);
	return result;
}

/** Get all favorites for a user (with skill details) */
export async function getFavoritesByUser(
	userClerkId: string,
): Promise<SkillWithAuthor[]> {
	const sql = `
    SELECT
      s.id,
      s.title,
      s.description,
      s.tags,
      s.install_command,
      s.prompt_config,
      s.usage_example,
      s.created_at,
      u.clerk_id   AS author_clerk_id,
      u.email       AS author_email,
      u.username    AS author_username,
      u.image_url   AS author_image_url,
      (SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id) AS upvote_count,
      (SELECT COUNT(*) FROM upvotes WHERE skill_id = s.id AND user_clerk_id = f.user_clerk_id) > 0 AS is_upvoted,
      TRUE AS is_favorited
    FROM favorites f
    JOIN skills s ON f.skill_id = s.id
    JOIN users u ON s.author_clerk_id = u.clerk_id
    WHERE f.user_clerk_id = ?
    ORDER BY f.created_at DESC
  `;
	const [rows] = await pool.execute<RowDataPacket[]>(sql, [userClerkId]);

	return (rows as Array<Record<string, unknown>>).map((row) => ({
		id: row.id as string,
		title: row.title as string,
		description: row.description as string,
		tags: JSON.parse((row.tags as string) || "[]"),
		installCommand: row.install_command as string,
		promptConfig: row.prompt_config as string,
		usageExample: row.usage_example as string,
		createdAt: row.created_at as string,
		author: {
			clerkId: row.author_clerk_id as string,
			email: row.author_email as string,
			username: (row.author_username as string) ?? null,
			imageUrl: (row.author_image_url as string) ?? null,
		},
		upvoteCount: Number(row.upvote_count),
		isUpvoted: Boolean(row.is_upvoted),
		isFavorited: Boolean(row.is_favorited),
	}));
}

/** Check if a skill is favorited by a user */
export async function isFavorited(
	userClerkId: string,
	skillId: string,
): Promise<boolean> {
	const [rows] = await pool.execute<RowDataPacket[]>(
		"SELECT 1 FROM favorites WHERE user_clerk_id = ? AND skill_id = ? LIMIT 1",
		[userClerkId, skillId],
	);
	return rows.length > 0;
}

// UPVOTES QUERIES 

/** Toggle upvote (add if not exists, remove if exists) */
export async function toggleUpvote(userClerkId: string, username: string, skillId: string) {
	const [existing] = await pool.execute<RowDataPacket[]>(
		"SELECT id FROM upvotes WHERE user_clerk_id = ? AND skill_id = ?",
		[userClerkId, skillId],
	);

	if (existing.length > 0) {
		await pool.execute("DELETE FROM upvotes WHERE user_clerk_id = ? AND skill_id = ?", [
			userClerkId,
			skillId,
		]);
		return { upvoted: false };
	}

	await pool.execute(
		"INSERT INTO upvotes (user_clerk_id, username, skill_id) VALUES (?, ?, ?)",
		[userClerkId, username, skillId],
	);
	return { upvoted: true };
}

/** Check if a user has upvoted a skill */
export async function isUpvoted(userClerkId: string, skillId: string) {
	const [rows] = await pool.execute<RowDataPacket[]>(
		"SELECT 1 FROM upvotes WHERE user_clerk_id = ? AND skill_id = ? LIMIT 1",
		[userClerkId, skillId],
	);
	return rows.length > 0;
}




