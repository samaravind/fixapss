export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, existing: string[]) {
  const normalized = slugify(base) || "item";
  if (!existing.includes(normalized)) {
    return normalized;
  }

  let counter = 2;
  while (existing.includes(`${normalized}-${counter}`)) {
    counter += 1;
  }

  return `${normalized}-${counter}`;
}
