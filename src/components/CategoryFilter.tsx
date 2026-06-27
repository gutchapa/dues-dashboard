'use client';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category:</label>
      <select
        value={selected ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
