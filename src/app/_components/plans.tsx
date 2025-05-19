import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface PlansCardProps {
  plan: string;
  price: string;
  description?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlansCard({
  description,
  plan,
  price,
  isSelected,
  onSelect,
}: PlansCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between border p-4 rounded-md transition-colors cursor-pointer mb-4 ${
        isSelected ? "border-red-600 " : "border-slate-200"
      }`}
    >
      <div className="flex flex-col space-y-1">
        <span className="text-xs font-medium text-slate-700">{plan}</span>
        <h3 className="text-lg text-red-600 font-semibold">
          {price}
          <span className="text-xs">/mensal</span>
        </h3>
        <p className="text-slate-400 text-xs font-medium">{description}</p>
      </div>
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => {}}
        onClick={onSelect}
        className={`h-6 w-6 rounded-full transition-colors ${
          isSelected ? "bg-red-600 border-red-600" : "bg-slate-400"
        }`}
      />
    </div>
  );
}
