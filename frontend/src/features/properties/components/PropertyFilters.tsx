import { useMemo, useState } from 'react';
import type { Property } from '@/types/property';

type FilterState = {
  city: string;
  propertyType: string;
  bedrooms: string;
};

type Props = {
  properties: Property[];
  onFilterChange: (filtered: Property[]) => void;
};

export function PropertyFilters({ properties, onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({ city: '', propertyType: '', bedrooms: '' });

  const cities = useMemo(() => {
    const set = new Set(properties.map((p) => p.city).filter(Boolean));
    return Array.from(set).sort();
  }, [properties]);

  const types = useMemo(() => {
    const vals = properties.map((p) => p.propertyType).filter((t): t is string => Boolean(t));
    return Array.from(new Set(vals)).sort();
  }, [properties]);

  const bedroomOptions = useMemo(() => {
    const set = new Set(properties.map((p) => p.bedrooms).filter((b) => b != null));
    return Array.from(set).sort((a, b) => a - b);
  }, [properties]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);

    let filtered = [...properties];
    if (next.city) filtered = filtered.filter((p) => p.city === next.city);
    if (next.propertyType) filtered = filtered.filter((p) => p.propertyType === next.propertyType);
    if (next.bedrooms) filtered = filtered.filter((p) => p.bedrooms === Number(next.bedrooms));
    onFilterChange(filtered);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <select
        value={filters.city}
        onChange={(e) => updateFilter('city', e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm"
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={filters.propertyType}
        onChange={(e) => updateFilter('propertyType', e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm"
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={filters.bedrooms}
        onChange={(e) => updateFilter('bedrooms', e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm"
      >
        <option value="">Any Bedrooms</option>
        {bedroomOptions.map((b) => (
          <option key={b} value={b}>{b} BHK</option>
        ))}
      </select>

      {activeCount > 0 && (
        <button
          onClick={() => {
            setFilters({ city: '', propertyType: '', bedrooms: '' });
            onFilterChange(properties);
          }}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700"
        >
          Clear ({activeCount})
        </button>
      )}

      <span className="text-sm text-gray-400">
        {properties.length} listing{properties.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
