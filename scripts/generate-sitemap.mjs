// Generates public/sitemap.xml and public/robots.txt before each build.
//
// Runs automatically via the "prebuild" npm script, so Vercel regenerates the
// sitemap on every deploy. Run it by hand with: npm run sitemap
//
// Config (env vars or .env):
//   SITE_URL       Public site origin, e.g. https://gamingcorner.lb
//                  Falls back to Vercel's production domain when on Vercel.
//   VITE_API_BASE  Backend origin (same one the app uses).
//
// The build never fails because of this script: if the API is unreachable,
// the sitemap still gets written with the static pages only.

import 'dotenv/config';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const TIMEOUT_MS = 15000;

const stripSlash = (s) => String(s || '').trim().replace(/\/+$/, '');

function resolveSiteUrl() {
  if (process.env.SITE_URL) return stripSlash(process.env.SITE_URL);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${stripSlash(vercel)}`;
  console.warn('[sitemap] SITE_URL is not set; using http://localhost:5173. Set SITE_URL to your real domain.');
  return 'http://localhost:5173';
}

const SITE_URL = resolveSiteUrl();
const API_BASE = stripSlash(process.env.VITE_API_BASE || 'http://localhost:3000');

// Pages worth indexing. Checkout, order status, wishlist and search results
// are per-visitor and are kept out of the sitemap (and disallowed in robots).
const STATIC_PAGES = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/track-order', changefreq: 'yearly', priority: '0.3' },
];

const unwrap = (body) => {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.products)) return body.products;
  return [];
};

async function getList(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return unwrap(await res.json());
  } catch (err) {
    console.warn(`[sitemap] Could not fetch ${endpoint}: ${err.message}`);
    return null;
  }
}

const toDate = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const seg = (v) => encodeURIComponent(String(v));

async function collectUrls() {
  const urls = new Map(); // loc -> entry (dedupes)
  const add = (entry) => {
    if (!urls.has(entry.loc)) urls.set(entry.loc, entry);
  };

  STATIC_PAGES.forEach(add);

  const [categories, products, allBrands, featuredBrands, popularBrands] = await Promise.all([
    getList('/api/category'),
    getList('/api/products'),
    getList('/api/brands'),
    getList('/api/brands/featured'),
    getList('/api/popularbrands'),
  ]);

  // Categories and subcategories: /category/:slug and /category/:slug/:sub
  for (const cat of categories || []) {
    if (!cat?.slug) continue;
    add({ loc: `/category/${seg(cat.slug)}`, changefreq: 'weekly', priority: '0.8' });
    for (const sub of cat.subcategories || []) {
      if (!sub?.slug) continue;
      add({ loc: `/category/${seg(cat.slug)}/${seg(sub.slug)}`, changefreq: 'weekly', priority: '0.7' });
    }
  }

  // Brands: /brand/:id, same identifier the app's own links use.
  const brandIds = new Set();
  for (const b of [...(allBrands || []), ...(featuredBrands || []), ...(popularBrands || [])]) {
    const id = b?.brand_id ?? b?.id;
    if (id != null) brandIds.add(String(id));
  }
  // Also pick up brands referenced by products, in case there's no full brand list.
  for (const p of products || []) {
    const id = p?.brand_id ?? p?.brand?.id;
    if (id != null) brandIds.add(String(id));
  }
  for (const id of brandIds) {
    add({ loc: `/brand/${seg(id)}`, changefreq: 'weekly', priority: '0.6' });
  }

  // Products: /product/:id
  for (const p of products || []) {
    if (p?.id == null) continue;
    add({
      loc: `/product/${seg(p.id)}`,
      lastmod: toDate(p.updated_at || p.created_at),
      changefreq: 'weekly',
      priority: '0.9',
    });
  }

  return {
    entries: [...urls.values()],
    counts: {
      categories: (categories || []).length,
      brands: brandIds.size,
      products: (products || []).filter((p) => p?.id != null).length,
    },
  };
}

function buildSitemap(entries) {
  const body = entries
    .map((e) => {
      const lines = [`    <loc>${escapeXml(SITE_URL + e.loc)}</loc>`];
      if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority) lines.push(`    <priority>${e.priority}</priority>`);
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /checkout',
    'Disallow: /order/',
    'Disallow: /wishlist',
    'Disallow: /products?',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

async function main() {
  const { entries, counts } = await collectUrls();
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(entries));
  await writeFile(path.join(PUBLIC_DIR, 'robots.txt'), buildRobots());
  console.log(
    `[sitemap] Wrote ${entries.length} URLs for ${SITE_URL} ` +
      `(${counts.categories} categories, ${counts.brands} brands, ${counts.products} products).`
  );
}

main().catch((err) => {
  // Never break the build over the sitemap.
  console.warn(`[sitemap] Failed: ${err.message}`);
});
