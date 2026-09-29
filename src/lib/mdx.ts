import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { Locale } from "./i18n";

const ProjectStatusSchema = z.enum(["published", "private-summary", "archived", "draft"]);

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  year: z.number().optional(),
  status: ProjectStatusSchema,
  role: z.string(),
  problem: z.string(),
  outcomes: z.array(z.string()),
  technologies: z.array(z.string()),
  evidenceLinks: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  updatedAt: z.string(),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

export interface Project {
  frontmatter: ProjectFrontmatter;
  content: string;
}

const CONTENT_PATH = path.join(process.cwd(), "src/content/projects");

// Simple frontmatter parser in pure TypeScript
export function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
  const parts = fileContent.split("---");
  if (parts.length < 3) {
    return { data: {}, content: fileContent };
  }

  const yamlSection = parts[1];
  const content = parts.slice(2).join("---").trim();
  const data: Record<string, any> = {};

  const lines = yamlSection.split("\n");
  let currentKey = "";
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if it's a list item inside an array
    if (trimmed.startsWith("-")) {
      const val = trimmed.replace(/^-/, "").trim().replace(/^['"]|['"]$/g, "");
      if (inArray) {
        arrayValues.push(val);
      }
      continue;
    }

    // Save previous array if we hit a new key
    if (inArray && line.includes(":")) {
      data[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    if (trimmed.includes(":")) {
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();

      currentKey = key;

      // Handle simple string/number/boolean values
      if (val === "" || val === "[]") {
        if (val === "[]") {
          data[key] = [];
        } else {
          // Might be an array starting on next lines
          inArray = true;
          arrayValues = [];
        }
      } else {
        // Parse basic values
        let parsedVal: any = val.replace(/^['"]|['"]$/g, "");
        if (parsedVal === "true") parsedVal = true;
        else if (parsedVal === "false") parsedVal = false;
        else if (!Number.isNaN(Number(parsedVal)) && parsedVal !== "") {
          parsedVal = Number(parsedVal);
        }
        data[key] = parsedVal;
      }
    }
  }

  // Final check for trailing arrays
  if (inArray && currentKey) {
    data[currentKey] = arrayValues;
  }

  return { data, content };
}

// Usa la traducción del caso si existe; si no, inglés y luego español.
function resolveMdx(slug: string, locale: Locale): string | null {
  for (const l of [locale, "en", "es"]) {
    const p = path.join(CONTENT_PATH, slug, `${l}.mdx`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Get all projects for a specific locale
export function getProjects(locale: Locale): Project[] {
  if (!fs.existsSync(CONTENT_PATH)) {
    return [];
  }

  const projectDirs = fs.readdirSync(CONTENT_PATH);
  const projects: Project[] = [];

  for (const slug of projectDirs) {
    const dirPath = path.join(CONTENT_PATH, slug);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const mdxPath = resolveMdx(slug, locale);
    if (!mdxPath) continue;

    try {
      const fileContent = fs.readFileSync(mdxPath, "utf8");
      const { data, content } = parseFrontmatter(fileContent);

      // Enforce slug matching folder name
      data.slug = slug;

      // Validate with Zod
      const validatedFrontmatter = ProjectFrontmatterSchema.parse(data);

      // We only show published and private-summary in list
      if (validatedFrontmatter.status === "draft") continue;

      projects.push({
        frontmatter: validatedFrontmatter,
        content,
      });
    } catch (err) {
      console.error(`Error loading project MDX for slug "${slug}" in locale "${locale}":`, err);
    }
  }

  // Sort by order asc, then year desc
  return projects.sort((a, b) => {
    if (a.frontmatter.order !== b.frontmatter.order) {
      return a.frontmatter.order - b.frontmatter.order;
    }
    return (b.frontmatter.year ?? 0) - (a.frontmatter.year ?? 0);
  });
}

// Get single project by slug and locale
export function getProjectBySlug(slug: string, locale: Locale): Project | null {
  const mdxPath = resolveMdx(slug, locale);
  if (!mdxPath) return null;

  try {
    const fileContent = fs.readFileSync(mdxPath, "utf8");
    const { data, content } = parseFrontmatter(fileContent);
    data.slug = slug;

    const validatedFrontmatter = ProjectFrontmatterSchema.parse(data);
    if (validatedFrontmatter.status === "draft") return null;

    return {
      frontmatter: validatedFrontmatter,
      content,
    };
  } catch (err) {
    console.error(`Error loading project by slug "${slug}" in locale "${locale}":`, err);
    return null;
  }
}
