import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, ArrowLeft, Check, Loader2, Image as ImageIcon, Cpu } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../components/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        
        const payload = res.data?.data || res.data;

        // If backend returns a brand wrapper with a products array
        if (payload?.products && Array.isArray(payload.products)) {
          // Find product matching URL ID or pick first item
          const singleProduct = payload.products.find((p) => String(p.id) === String(id)) || payload.products[0];
          setProduct(singleProduct);
        } else {
          setProduct(payload);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-indigo-600 dark:text-indigo-400 gap-2 text-sm font-medium">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Product not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-semibold underline">
          Return to home
        </button>
      </div>
    );
  }

  // --- SAFE NUMERIC PRICE PARSING ---
  const rawPrice = product.price ?? product.sale_price ?? 0;
  const unitPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice) || 0;

  // --- IMAGE URL RESOLVER & PARSER ---
  const formatImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim().replace(/^['"]|['"]$/g, '');
    return cleanUrl.startsWith('http') ? cleanUrl : `${API_BASE_URL}${cleanUrl}`;
  };

  const getRawImages = () => {
    // 1. If images is already an array
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images;
    }
    // 2. If image_urls is an array
    if (Array.isArray(product?.image_urls) && product.image_urls.length > 0) {
      return product.image_urls;
    }
    // 3. If images is a stringified JSON array or Postgres array string
    if (typeof product?.images === 'string' && product.images.trim()) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        const cleanStr = product.images.replace(/^\{|\}$/g, '');
        if (cleanStr) return cleanStr.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
      }
      return [product.images];
    }
    // 4. Fallback to image_url or primary_image single string
    if (product?.image_url) return [product.image_url];
    if (product?.primary_image) return [product.primary_image];

    return [];
  };

  const imagesList = getRawImages().map(formatImageUrl).filter(Boolean);
  const mainImageUrl = imagesList[selectedImageIndex] || imagesList[0] || null;

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({ ...product, price: unitPrice }, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const specifications = Array.isArray(product.specifications) ? product.specifications : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* TOP SECTION: Preview and Purchase Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-sm">
        
        {/* Left: Image Showcase */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 min-h-[350px]">
            {mainImageUrl ? (
              <img 
                src={mainImageUrl} 
                alt={product.name || product.title || 'Product Image'} 
                className="max-h-[380px] w-auto object-contain transition-all duration-300" 
              />
            ) : (
              <div className="text-sm font-mono text-slate-400">No Image Available</div>
            )}
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 dark:border-indigo-500 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase Info */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              {product.category_name || product.category || 'Gaming Gear'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {product.name || product.title || `Product #${product.id}`}
            </h1>
            <div className="text-3xl font-extrabold my-4 font-mono text-slate-900 dark:text-white">
              ${unitPrice.toFixed(2)}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quantity</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#0d1117]">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold font-mono text-slate-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
              }`}
            >
              {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              {added
                ? 'Added to Cart!'
                : `Add to Cart — $${(unitPrice * quantity).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Product Description */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Product Overview
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
          {product.description || 'No detailed description available for this item.'}
        </p>
      </div>

      {/* SECTION 2: Picture Showcase Gallery */}
      {imagesList.length > 0 && (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Media Gallery
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imagesList.map((imgUrl, index) => (
              <div 
                key={index} 
                className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 flex items-center justify-center min-h-[350px] group overflow-hidden"
              >
                <img 
                  src={imgUrl} 
                  alt={`${product.name || 'Product'} view ${index + 1}`} 
                  className="max-h-[450px] w-auto object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Dynamic Technical Specifications */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Technical Specifications
          </h2>
        </div>

        {specifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/60 text-sm"
              >
                <span className="font-semibold text-slate-500 dark:text-slate-400">{spec.key || spec.specification}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{spec.value || spec.details}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No specifications listed for this product.</p>
        )}
      </div>
    </div>
  );
}