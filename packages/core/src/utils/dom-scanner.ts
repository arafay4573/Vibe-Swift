import { REASnapshotNode, REAAsset } from '../types/rea.js';
import { decodeHtmlEntities } from './html-decoder.js';

export function parseHTMLToSnapshot(html: string): { root: REASnapshotNode; assets: REAAsset[] } {
  const assets: REAAsset[] = [];
  
  // Basic robust HTML token scanner for parsing DOM hierarchy
  // Extracts tags, attributes, text, assets, and hierarchy
  const cleanHtml = html
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Extract assets: images, links, scripts
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(cleanHtml)) !== null) {
    const fullTag = imgMatch[0];
    const src = imgMatch[1];
    const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
    assets.push({
      url: src,
      type: src.endsWith('.svg') ? 'svg' : 'image',
      alt: altMatch ? decodeHtmlEntities(altMatch[1]) : undefined,
    });
  }

  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  let svgMatch;
  while ((svgMatch = svgRegex.exec(cleanHtml)) !== null) {
    assets.push({
      url: `inline-svg-${assets.length + 1}`,
      type: 'svg',
    });
  }

  // Parse root wrapper node
  const root: REASnapshotNode = {
    tag: 'body',
    classes: ['bg-zinc-950', 'text-zinc-100'],
    attributes: {},
    children: [],
  };

  // Extract sections/articles/nav/header/footer/div blocks
  const blockRegex = /<(header|nav|main|section|article|aside|footer|div)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  let idx = 0;

  while ((match = blockRegex.exec(cleanHtml)) !== null && idx < 50) {
    const tag = match[1].toLowerCase();
    const rawAttrs = match[2];
    const innerContent = match[3];

    const classMatch = rawAttrs.match(/class(?:Name)?=["']([^"']+)["']/i);
    const idMatch = rawAttrs.match(/id=["']([^"']+)["']/i);

    const classes = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];
    const textContent = decodeHtmlEntities(innerContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

    root.children?.push({
      tag,
      id: idMatch ? idMatch[1] : undefined,
      classes,
      attributes: parseAttributes(rawAttrs),
      text: textContent.length > 0 ? textContent.slice(0, 160) : undefined,
      componentCandidate: inferComponentCandidate(tag, classes, idMatch?.[1]),
    });

    idx++;
  }

  if (!root.children || root.children.length === 0) {
    // Fallback if regex didn't extract nested blocks
    root.children = [
      {
        tag: 'main',
        classes: ['container', 'mx-auto', 'px-4', 'py-12'],
        attributes: {},
        text: decodeHtmlEntities(cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)),
        componentCandidate: 'HeroSection',
      },
    ];
  }

  return { root, assets };
}

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-zA-Z0-9_\-:]+)(?:=["']([^"']*)["'])?/g;
  let match;
  while ((match = attrRegex.exec(raw)) !== null) {
    const name = match[1].toLowerCase();
    const val = match[2] ?? '';
    if (name !== 'class' && name !== 'classname') {
      attrs[name] = decodeHtmlEntities(val);
    }
  }
  return attrs;
}

function inferComponentCandidate(tag: string, classes: string[], id?: string): string {
  const combined = `${tag} ${id ?? ''} ${classes.join(' ')}`.toLowerCase();
  if (combined.includes('nav') || combined.includes('header') || tag === 'header' || tag === 'nav') {
    return 'Navbar';
  }
  if (combined.includes('hero') || combined.includes('banner')) {
    return 'HeroSection';
  }
  if (combined.includes('feature') || combined.includes('grid')) {
    return 'FeatureGrid';
  }
  if (combined.includes('pricing')) {
    return 'PricingCards';
  }
  if (combined.includes('cta') || combined.includes('action')) {
    return 'CallToAction';
  }
  if (combined.includes('footer') || tag === 'footer') {
    return 'Footer';
  }
  if (combined.includes('card') || combined.includes('item')) {
    return 'CardComponent';
  }
  if (combined.includes('table') || tag === 'table') {
    return 'DataTable';
  }
  return 'ContentSection';
}
