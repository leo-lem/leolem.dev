export const navigation = ["blog", "portfolio", "offering", "about"] as const;
export type NavigationItem = (typeof navigation)[number];