import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";

// --- Server Functions (Data Fetchers) ---

export const getLatestSkillsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { userId } = await auth();
      const { getSkills } = await import("#/includes/queries");
      return await getSkills("", 6, userId);
    } catch (error) {
      console.error("Failed to fetch latest skills:", error);
      return [];
    }
  });

export const getRegistrySkillsFn = createServerFn({ method: "GET" })
  .inputValidator((data: { q?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();
      const { getSkills } = await import("#/includes/queries");
      return await getSkills(data.q || "", 100, userId);
    } catch (error) {
      console.error("Failed to fetch registry skills:", error);
      return [];
    }
  });

export const getSkillDetailFn = createServerFn({ method: "GET" })
  .inputValidator((skillId: string) => skillId)
  .handler(async ({ data: skillId }) => {
    const { userId } = await auth();
    const { getSkillById } = await import("#/includes/queries");
    const skill = await getSkillById(skillId, userId);
    if (!skill) throw new Error("Skill not found");
    
    const isOwner = userId ? skill.author.clerkId === userId : false;

    return { skill, isOwner };
  });

export const getSavedSkillsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      const { getFavoritesByUser } = await import("#/includes/queries");
      return await getFavoritesByUser(userId);
    } catch (error) {
      console.error("Failed to fetch saved skills:", error);
      return [];
    }
  });

// --- Query Options ---

export const latestSkillsQueryOptions = () =>
  queryOptions({
    queryKey: ["skills", "latest"],
    queryFn: () => getLatestSkillsFn(),
  });

export const registrySkillsQueryOptions = (q?: string) =>
  queryOptions({
    queryKey: ["skills", "registry", q || ""],
    queryFn: () => getRegistrySkillsFn({ data: { q } }),
  });

export const skillDetailQueryOptions = (skillId: string) =>
  queryOptions({
    queryKey: ["skills", "detail", skillId],
    queryFn: () => getSkillDetailFn({ data: skillId }),
  });

export const savedSkillsQueryOptions = () =>
  queryOptions({
    queryKey: ["skills", "saved"],
    queryFn: () => getSavedSkillsFn(),
  });
