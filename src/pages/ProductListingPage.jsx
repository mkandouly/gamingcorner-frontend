// src/pages/ProductListingPage.jsx
//
// Renders as a nested route inside MainLayout, so Header/Footer live outside
// the <Outlet/> and never remount when this page mounts, unmounts, or its
// params change (category -> subcategory -> brand -> search, etc.). Only
// this page's own content swaps.
//
// Handles four trigger sources:
//   - a top-level category chosen from the Header            -> /category/:categorySlug
//   - a subcategory chosen from the Header                   -> /category/:categorySlug/:subcategorySlug
//   - a brand chosen from the BrandTicker                     -> /brand/:identifier
//   - a search submitted from the Header search bar           -> /products?search=...
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, PackageX, ShoppingBag, Plus, ArrowLeft, ArrowUpDown, Heart } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../components/WishlistContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetically: A to Z' },
  { value: 'name-desc', label: 'Alphabetically: Z to A' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'discount', label: 'Biggest Discount' },
];

// Effective price used for sorting/comparison: the sale price when the item
// is on sale, otherwise the regular price.
const effectivePrice = (product) => {
  const raw = product.sale_price ?? product.price ?? 0;
  return typeof raw === 'number' ? raw : parseFloat(raw) || 0;
};

const discountPercent = (product) => {
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
  const sale = product.sale_price != null ? (typeof product.sale_price === 'number' ? product.sale_price : parseFloat(product.sale_price)) : null;
  if (!price || sale == null || Number.isNaN(sale)) return 0;
  return Math.max(0, (price - sale) / price);
};

export default function ProductListingPage() {
  const { categorySlug, subcategorySlug, identifier } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  const mode = identifier ? 'brand' : subcategorySlug ? 'subcategory' : categorySlug ? 'category' : 'search';

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      setSortBy('relevance');

      try {
        if (mode === 'brand') {
          const res = await axios.get(`${API_BASE_URL}/api/brand/${identifier}`, {
            signal: controller.signal,
          });
          const data = res.data?.data || res.data;
          if (!isMounted) return;
          setProducts(Array.isArray(data?.products) ? data.products : []);
          setTitle(data?.name || identifier);
        } else if (mode === 'subcategory') {
          const res = await axios.get(`${API_BASE_URL}/api/category/${subcategorySlug}`, {
            signal: controller.signal,
          });
          const data = res.data?.data || res.data;
          if (!isMounted) return;
          setProducts(Array.isArray(data?.products) ? data.products : []);
          setTitle(data?.name || subcategorySlug.replace(/-/g, ' '));
        } else if (mode === 'category') {
          // Parent category: there's no single backend endpoint for "all
          // products under a top-level category", since products are keyed
          // by subcategory slug. So fetch the category tree, find this
          // category's subcategories, then fetch + merge each of their
          // product lists.
          const catsRes = await axios.get(`${API_BASE_URL}/api/category`, {
            signal: controller.signal,
          });
          const cats = Array.isArray(catsRes.data) ? catsRes.data : catsRes.data?.data || [];
          const category = cats.find((c) => c.slug === categorySlug);

          if (!isMounted) return;

          if (!category) {
            setProducts([]);
            setTitle(categorySlug.replace(/-/g, ' '));
            return;
          }

          setTitle(category.name || categorySlug.replace(/-/g, ' '));

          const subSlugs = (category.subcategories || []).map((s) => s.slug).filter(Boolean);

          if (subSlugs.length === 0) {
            setProducts([]);
            return;
          }

          const results = await Promise.all(
            subSlugs.map((slug) =>
              axios
                .get(`${API_BASE_URL}/api/products`, {
                  params: { category: slug },
                  signal: controller.signal,
                })
                .then((r) => r.data?.data || r.data || [])
                .catch(() => [])
            )
          );

          if (!isMounted) return;

          const merged = results.flat().filter(Boolean);
          const uniqueById = Array.from(new Map(merged.map((p) => [p.id, p])).values());
          setProducts(uniqueById);
        } else {
          // Search, triggered from the Header search bar -> /products?search=...
          if (!searchQuery.trim()) {
            setProducts([]);
            setTitle('Search');
            return;
          }

          const res = await axios.get(`${API_BASE_URL}/api/products`, {
            params: { search: searchQuery },
            signal: controller.signal,
          });
          const data = res.data?.data || res.data;
          if (!isMounted) return;
          setProducts(Array.isArray(data) ? data : []);
          setTitle(`Search results for "${searchQuery}"`);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Failed to load product listing:', err);
        if (isMounted) setError('Something went wrong while loading these products.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [mode, categorySlug, subcategorySlug, identifier, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case 'price-desc':
        return list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case 'name-asc':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'newest':
        return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      case 'discount':
        return list.sort((a, b) => discountPercent(b) - discountPercent(a));
      case 'relevance':
      default:
        return list;
    }
  }, [products, sortBy]);

  const PRODUCTS_PER_PAGE = 24;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const pagedProducts = useMemo(
    () => sortedProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE),
    [sortedProducts, page]
  );

  // Reset to page 1 whenever the underlying product set or sort changes,
  // so switching category/brand or re-sorting doesn't leave you stranded
  // on a page that no longer has that many items.
  useEffect(() => {
    setPage(1);
  }, [products, sortBy]);

  const handleProductCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.out_of_stock) return;
    addToCart(product, 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-indigo-600 dark:text-indigo-400 gap-2 text-sm font-medium">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        <button
          onClick={() => navigate(0)}
          className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {products.length > 0 && (
          <label className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <PackageX className="w-10 h-10 text-slate-300 dark:text-slate-700" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'search'
              ? searchQuery
                ? `No products matched "${searchQuery}".`
                : 'Type something in the search bar above to find products.'
              : 'No products found here yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedProducts.map((product) => {
            const imageUrl = product.image_url
              ? product.image_url.startsWith('http')
                ? product.image_url
                : `${API_BASE_URL}${product.image_url}`
              : null;

            return (
              <div
                key={product.id}
                onClick={() => handleProductCardClick(product)}
                className="cursor-pointer group rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 shadow-sm dark:shadow-none transition-all duration-200 overflow-hidden flex flex-col p-3.5"
              >
                <div className="relative w-full h-36 md:h-44 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/80 overflow-hidden flex items-center justify-center shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        product.out_of_stock ? 'opacity-50 grayscale' : ''
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">No Image</div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 transition-colors z-10 shadow-sm"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isWishlisted(product.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-slate-500 dark:text-slate-300'
                      }`}
                    />
                  </button>

                  {product.out_of_stock ? (
                    <span className="absolute top-2 left-2 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      Out of Stock
                    </span>
                  ) : (
                    product.sale_price && (
                      <span className="absolute top-2 left-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                        Sale
                      </span>
                    )
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1 mt-2.5">
                  <div>
                    {product.sku && (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block truncate">
                        {product.sku}
                      </span>
                    )}
                    <h3 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                        ${product.sale_price || product.price}
                      </span>
                      {product.sale_price && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.out_of_stock}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-50 dark:disabled:hover:bg-indigo-600/10"
                      aria-label={product.out_of_stock ? 'Out of stock' : `Add ${product.name} to cart`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
