import { z } from 'astro:content';

export const zTag = z.enum([
  "iOS", "Swift", "SwiftUI", "Swift Vapor", "Full Stack",
  "Web", "JavaScript", "TypeScript", "Cloud", "DevOps",
  "AI", "Machine Learning", "Data Science", "Mobile",
  "Frontend", "Backend", "Open Source", "Community",
  "Research", "Python", "Sentiment Analysis", "Education",
  "MVP", "Core Data", "CI/CD", "Automation", "GitHub Actions",
  "Introduction", "Blog", "Astro", "Web Development",
  "Personal Website", "Sustainability"
])

export const zIcon = z.enum([
  "apple", "appstore", "cicd", "docker", "document", "github",
  "googlecloud", "huggingface", "kubernetes", "linkedin", "menu",
  "python", "react", "swift", "terraform", "typescript", "webpage"
])