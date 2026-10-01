// src/pages/OrderStatusPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Loader2,
  CheckCircle2,
  PackageCheck,
  ChefHat,
  Truck,
  XCircle,
  ClipboardList,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const STEPS = [
  { key: 'pending', label: 'Pending', icon: ClipboardList },
  { key: 'in_preparation', label: 'In Preparation', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
];

export default function OrderStatusPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/orders/${id}`);
        if (isMounted) setOrder(res.data?.data);
      } catch (err) {
        console.error('Failed to load order:', err);
        if (isMounted) setError('We could not find this order.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-indigo-600 dark:text-indigo-400 gap-2 text-sm font-medium">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading your order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">{error || 'Order not found.'}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-semibold underline">
          Return to home
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const subtotal = Number(order.subtotal) || 0;
  const deliveryPrice = order.delivery_price != null ? Number(order.delivery_price) : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order #{order.id}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Placed on {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5 mb-8">
          <XCircle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <p className="font-bold text-red-700 dark:text-red-400">This order was cancelled</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/70">
              If you think this is a mistake, please contact the store.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isComplete = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center text-center gap-2 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isComplete
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isComplete && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isComplete
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-6 transition-colors ${
                        index < currentStepIndex
                          ? 'bg-indigo-600'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
            Delivery Details
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-white">
              {order.first_name} {order.last_name}
            </p>
            <p>
              {order.phone_country_code} {order.phone_number}
            </p>
            <p>
              {order.address_line}, {order.area}, {order.city}, {order.governorate}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
            Items
          </h2>
          <div className="space-y-2">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">
                  {item.product_name} <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${Number(item.line_total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
            <span className="font-mono text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Delivery</span>
            <span className="font-mono text-slate-900 dark:text-white">
              {deliveryPrice != null ? `$${deliveryPrice.toFixed(2)}` : 'To be confirmed'}
            </span>
          </div>
          <div className="flex items-center justify-between text-base pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">Total</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {deliveryPrice != null ? `$${(subtotal + deliveryPrice).toFixed(2)}` : `$${subtotal.toFixed(2)} + delivery`}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
