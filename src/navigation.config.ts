export const navigation = ["blog", "portfolio", "offering", "explore", "about"] as const;
export type NavigationItem = (typeof navigation)[number];