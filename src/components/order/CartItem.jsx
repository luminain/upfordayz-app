import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const SILK = '#F7F4EF';

export function formatCustomization(item) {
  const parts = [];
  if (item.milk) parts.push(`${item.milk} milk`);
  else if (item.size && item.size !== 'Standard') parts.push(item.size);
  if (item.sweetness && item.sweetness !== 'Standard') parts.push(item.sweetness);
  if (item.extra_shot) parts.push('+Espresso shot');
  return parts.join(' · ') || 'Standard';
}

export default function CartItem({ item, index, onUpdate, onRemove }) {
  const quantity = item.quantity || 1;
  const lineTotal = (item.price || 0) * quantity;
  const imageUrl = item.image_url;

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#2A2421] p-4">
      <div className="flex items-center gap-x-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl opacity-40">☕</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4
                className="truncate font-heading text-base font-semibold"
                style={{ color: SILK }}
              >
                {item.name}
              </h4>
              <p className="mt-1 font-body text-xs text-[#A89890]">{formatCustomization(item)}</p>
            </div>
            <p className="shrink-0 font-display text-sm font-bold" style={{ color: SILK }}>
              ${lineTotal.toFixed(2)}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onUpdate(index, quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/15"
                style={{ color: SILK }}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span
                className="min-w-[1.25rem] text-center font-display text-sm font-bold"
                style={{ color: SILK }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdate(index, quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-citrus text-white transition-opacity hover:opacity-90"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#8B7E75] transition-colors hover:bg-red-500/15 hover:text-red-400"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
