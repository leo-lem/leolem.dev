const icons: Record<string, string> = {
  github: "simple-icons:github",
  appstore: "simple-icons:appstore",
  webpage: "lucide:globe",
  document: "lucide:file-text",
  linkedin: "simple-icons:linkedin"
};

export function iconForUrl(url: string): string {
  return icons[url.split("https://")[1].split(".")[0]] ?? (console.error(`Unknown link type: ${url}`), "lucide:link")
}