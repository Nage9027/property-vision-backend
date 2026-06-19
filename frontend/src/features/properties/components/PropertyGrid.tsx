import type { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
        No listings yet. Check back soon or post a property.
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, i) => (
        <PropertyCard key={property.id} property={property} index={i} />
      ))}
    </div>
  );
}
