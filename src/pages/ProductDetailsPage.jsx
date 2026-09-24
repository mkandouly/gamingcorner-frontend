import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, ArrowLeft, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../components/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
          setProduct(res.data?.data || res.data);
        } catch (err) {
          console.error('Failed to load product details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

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

  const imageUrl = product.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `${API_BASE_URL}${product.image_url}`
    : null;

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 mb-6 rounded-xl bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10">
        <div className="flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] rounded-2xl p-6 min-h-[320px]">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="max-h-[380px] object-contain" />
          ) : (
            <div className="text-sm font-mono text-slate-400">No Image</div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
            <div className="text-3xl font-extrabold my-4 font-mono">${product.sale_price || product.price}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 py-4 border-y border-slate-100 dark:border-slate-800">
              {product.description || 'No description available.'}
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold">Quantity</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-bold font-mono">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-2.5"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                added ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              {added ? 'Added to Cart!' : `Add to Cart — $${((product.sale_price || product.price) * quantity).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}