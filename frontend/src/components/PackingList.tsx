"use client";

import api from "@/utils/api";
import { useState } from "react";

interface PackingItem {
  _id?: string;
  item: string;
  category?: string;
  isPacked: boolean;
}

interface PackingListProps {
  tripId: string;
  packingList: PackingItem[];
  onUpdate?: () => void;
}

export default function PackingList({
  tripId,
  packingList,
  onUpdate,
}: PackingListProps) {
  const [items, setItems] = useState(packingList);

  const togglePacked = async (itemId?: string) => {
    if (!itemId) return;

    const updatedItems = items.map((item) =>
      item._id === itemId
        ? { ...item, isPacked: !item.isPacked }
        : item
    );

    setItems(updatedItems);

    try {
      await api.put(`/trips/${tripId}`, {
        packingList: updatedItems,
      });

      onUpdate?.();
    } catch (error) {
      console.error("Failed to update packing item", error);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-2xl">
      <h2 className="text-xl font-semibold text-white mb-5">
        Packing Checklist
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item._id}
            onClick={() => togglePacked(item._id)}
            className="w-full flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/10 p-4 text-left hover:bg-white/[0.03]"
          >
            <input
              type="checkbox"
              checked={item.isPacked}
              readOnly
              className="h-4 w-4"
            />

            <span
              className={`flex-1 ${
                item.isPacked
                  ? "line-through text-slate-500"
                  : "text-white"
              }`}
            >
              {item.item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}