import JSZip from 'jszip';
import type { GeneratedProject } from '@vibe-swift/core';

/**
 * Bundles a GeneratedProject into a clean, runnable ZIP archive and triggers a browser download.
 */
export async function downloadProjectZip(project: GeneratedProject): Promise<void> {
  const zip = new JSZip();

  // Add all project files into zip archive maintaining directory hierarchy
  for (const file of project.files) {
    // Normalize path separators to forward slashes
    const normalizedPath = file.path.replace(/\\/g, '/');
    zip.file(normalizedPath, file.content);
  }

  // Ensure next.config.mjs is present if not already generated
  if (!project.files.some((f) => f.path.includes('next.config'))) {
    zip.file(
      'next.config.mjs',
      `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`
    );
  }

  // Generate zip binary blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const anchor = document.createElement('a');
  const safeName = (project.name || 'vibe-swift-clone').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  anchor.href = downloadUrl;
  anchor.download = `${safeName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
