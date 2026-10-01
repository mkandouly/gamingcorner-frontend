// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Truck, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { countryCodes, DEFAULT_COUNTRY_DIAL_CODE } from '../data/countryCodes';
import { lebanonGovernorates } from '../data/lebanonGovernorates';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone_country_code: DEFAULT_COUNTRY_DIAL_CODE,
  phone_number: '',
  governorate: '',
  city: '',
  area: '',
  address_line: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const getEffectivePrice = (item) => Number(item.sale_price ?? item.price ?? 0) || 0;

  const subtotal = cart.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!form.first_name.trim()) errors.first_name = 'Required';
    if (!form.last_name.trim()) errors.last_name = 'Required';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!/^[0-9]{6,15}$/.test(form.phone_number.trim())) {
      errors.phone_number = 'Enter a valid phone number (digits only)';
    }
    if (!form.governorate) errors.governorate = 'Required';
    if (!form.city.trim()) errors.city = 'Required';
    if (!form.area.trim()) errors.area = 'Required';
    if (!form.address_line.trim()) errors.address_line = 'Required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!validate()) {
      setError('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || undefined,
        phone_number: form.phone_number.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        address_line: form.address_line.trim(),
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      };

      const res = await axios.post(`${API_BASE_URL}/api/orders`, payload);
      const order = res.data?.data;

      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-slate-50 dark:bg-[#0d1117] border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
      fieldErrors[field]
        ? 'border-red-400 dark:border-red-500/60'
        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
    }`;

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Add a few products before heading to checkout.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form fields */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={handleChange('first_name')}
                  className={inputClass('first_name')}
                  placeholder="Karim"
                />
                {fieldErrors.first_name && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={handleChange('last_name')}
                  className={inputClass('last_name')}
                  placeholder="Abou Jaoude"
                />
                {fieldErrors.last_name && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Email <span className="text-slate-400 dark:text-slate-500 font-normal normal-case">(optional — for order updates)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className={inputClass('email')}
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={form.phone_country_code}
                  onChange={handleChange('phone_country_code')}
                  className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-colors shrink-0 max-w-[130px]"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.dialCode}>
                      {c.flag} {c.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={handleChange('phone_number')}
                  className={inputClass('phone_number')}
                  placeholder="71 234 567"
                />
              </div>
              {fieldErrors.phone_number && (
                <p className="text-[11px] text-red-500 mt-1">{fieldErrors.phone_number}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4 mt-4">
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Governorate
                </label>
                <select
                  value={form.governorate}
                  onChange={handleChange('governorate')}
                  className={inputClass('governorate')}
                >
                  <option value="">Select governorate</option>
                  {lebanonGovernorates.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {fieldErrors.governorate && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.governorate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={handleChange('city')}
                  className={inputClass('city')}
                  placeholder="Jounieh"
                />
                {fieldErrors.city && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.city}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Area
              </label>
              <input
                type="text"
                value={form.area}
                onChange={handleChange('area')}
                className={inputClass('area')}
                placeholder="Sarba"
              />
              {fieldErrors.area && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.area}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Address Line
              </label>
              <textarea
                rows={3}
                value={form.address_line}
                onChange={handleChange('address_line')}
                className={inputClass('address_line')}
                placeholder="Building name/number, floor, nearby landmark..."
              />
              {fieldErrors.address_line && (
                <p className="text-[11px] text-red-500 mt-1">{fieldErrors.address_line}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white shrink-0">
                    ${(getEffectivePrice(item) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-start justify-between text-sm gap-2">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Delivery
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 text-right italic">
                  To be set by the store
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Final delivery cost will be confirmed by the store after checkout.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
