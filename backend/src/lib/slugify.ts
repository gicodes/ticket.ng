/**
 * slugify.ts
 * Converts strings (e.g. blog titles) into clean, URL-safe slugs.
 * Example: "My First Blog Post!" → "my-first-blog-post"
 */

export const slugify = (input: string): string => {
  if (!input) return "";

  return input
    .toString()
    .normalize("NFKD")               // Normalize accents (e.g. é → e)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")     // Replace spaces & punctuation with dash
    .replace(/^-+|-+$/g, "")         // Remove leading/trailing dashes
    .replace(/--+/g, "-");           // Collapse multiple dashes
};
