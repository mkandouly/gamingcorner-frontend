// src/pages/TrackOrderPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, AlertCircle, PackageSearch } from 'lucide-react';
import { countryCodes, DEFAULT_COUNTRY_DIAL_CODE } from '../data/countryCodes';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function TrackOrderPage() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_DIAL_CODE);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedId = orderId.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedId || !/^\d+$/.test(trimmedId)) {
      setError('Enter a valid Order ID (numbers only).');
      return;
    }
    if (!trimmedPhone) {
      setError('Enter the phone number used at checkout.');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/orders/lookup`, {
        id: trimmedId,
        phone_number: `${countryCode}${trimmedPhone}`,
      });

      // Verified — hand off to the order status page, which fetches by id.
      navigate(`/order/${trimmedId}`);
    } catch (err) {
      console.error('Order lookup failed:', err);
      setError(
        err.response?.data?.message ||
          "We couldn't find an order matching that ID and phone number."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track Your Order</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Enter your Order ID and the phone number used at checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Order ID
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 1042"
            className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
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
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="71 234 567"
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
            />
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
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Track Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}
