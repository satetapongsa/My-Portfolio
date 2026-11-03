/**
 * Resolves a file in /public against Vite's base URL, so assets keep working
 * if the site is ever served from a sub-path. Spaces in original filenames
 * (kept as-is from the legacy portfolio) are URL-encoded.
 */
export const asset = (path: string) => encodeURI(`${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`);
