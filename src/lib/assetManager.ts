/**
 * AssetManager — handles path resolution, fallbacks, and media URLs.
 * Ensures missing media degrades gracefully without throwing errors.
 */

export function getPhotoUrl(filename: string): string {
  if (!filename) return "";
  // If already absolute or URL, return as-is
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) {
    return filename;
  }
  return `/media/photos/${encodeURIComponent(filename)}`;
}

export function getVideoUrl(filename: string): string {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) {
    return filename;
  }
  return `/media/videos/${encodeURIComponent(filename)}`;
}

export function getAudioUrl(filename: string): string {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) {
    return filename;
  }
  return `/media/audio/${encodeURIComponent(filename)}`;
}
