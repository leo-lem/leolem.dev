const icons: Record<string, string> = {
  github: "simple-icons:github",
  appstore: "simple-icons:appstore",
  webpage: "lucide:globe",
  document: "lucide:file-text",
  linkedin: "simple-icons:linkedin"
};

const names: Record<string, string> = {
  github: "GitHub",
  appstore: "App Store",
  webpage: "Webpage",
  document: "Document",
  linkedin: "LinkedIn"
};

function domainKey(url: string): string {
  return new URL(url).hostname.split(".")[0];
}

export function iconForUrl(url: string): string {
  return icons[domainKey(url)] ?? (console.error(`Unknown link type: ${url}`), "lucide:link")
}

export function nameForUrl(url: string): string {
  return names[domainKey(url)] ?? url;
}