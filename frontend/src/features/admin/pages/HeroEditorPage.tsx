import { useEffect, useState, type FormEvent } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { useHomepageHero } from '@/features/properties/hooks/useHomepageHero';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Eye, Save } from 'lucide-react';
import type { Property } from '@/types/property';

type HeroForm = {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  startingPrice: string;
  priceUnit: string;
  offerBadge: string;
  priceHighlight: string;
  totalPlots: string;
  availableUnits: string;
  distanceToORR: string;
  internalRoadWidth: string;
  btn1Label: string;
  btn1Type: string;
  btn1Url: string;
  btn2Label: string;
  btn2Type: string;
  btn2Url: string;
  btn3Label: string;
  btn3Type: string;
  btn3Url: string;
  whatsappNumber: string;
  phoneNumber: string;
  googleMapUrl: string;
  landmark: string;
  district: string;
  state: string;
};

function toForm(p: Property | undefined): HeroForm {
  return {
    heroTitle: p?.heroTitle ?? '',
    heroSubtitle: p?.heroSubtitle ?? '',
    heroDescription: p?.heroDescription ?? '',
    heroVideoUrl: p?.heroVideoUrl ?? '',
    heroImageUrl: p?.heroImageUrl ?? '',
    startingPrice: p?.startingPrice ?? '',
    priceUnit: p?.priceUnit ?? '',
    offerBadge: p?.offerBadge ?? '',
    priceHighlight: p?.priceHighlight ?? '',
    totalPlots: p?.totalPlots ?? '',
    availableUnits: p?.availableUnits ?? '',
    distanceToORR: p?.distanceToORR ?? '',
    internalRoadWidth: p?.internalRoadWidth ?? '',
    btn1Label: p?.btn1Label ?? '',
    btn1Type: p?.btn1Type ?? '',
    btn1Url: p?.btn1Url ?? '',
    btn2Label: p?.btn2Label ?? '',
    btn2Type: p?.btn2Type ?? '',
    btn2Url: p?.btn2Url ?? '',
    btn3Label: p?.btn3Label ?? '',
    btn3Type: p?.btn3Type ?? '',
    btn3Url: p?.btn3Url ?? '',
    whatsappNumber: p?.whatsappNumber ?? '',
    phoneNumber: p?.phoneNumber ?? '',
    googleMapUrl: p?.googleMapUrl ?? '',
    landmark: p?.landmark ?? '',
    district: p?.district ?? '',
    state: p?.state ?? '',
  };
}

type ApiRes<T> = { success: boolean; data: T };

export function HeroEditorPage() {
  const { data: heroProperty, isLoading: loadingHero } = useHomepageHero();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HeroForm>(toForm(undefined));
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: allProperties = [] } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiRes<Property[]>>('/admin/properties');
      return data.data ?? [];
    },
  });

  useEffect(() => {
    if (heroProperty) {
      setForm(toForm(heroProperty));
      setSelectedPropertyId(heroProperty.id);
    }
  }, [heroProperty]);

  const updateHero = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const { data } = await apiClient.patch<ApiRes<Property>>(`/properties/${id}`, payload);
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-hero'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setSuccess('Homepage hero updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    },
    onError: () => {
      setError('Failed to update. Check console.');
    },
  });

  const setHero = useMutation({
    mutationFn: async (propertyId: string) => {
      const { data } = await apiClient.post<ApiRes<Property>>('/homepage/hero/set', { propertyId });
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-hero'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setSuccess('Homepage hero changed successfully.');
      setTimeout(() => setSuccess(''), 4000);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedPropertyId) {
      setError('Select a property first.');
      return;
    }
    updateHero.mutate({ id: selectedPropertyId, payload: form });
  };

  if (loadingHero) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c6a43f] border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/admin" className="hover:text-[#c6a43f]">Dashboard</Link>
          <span>/</span>
          <span className="text-[#0a2540]">Hero Editor</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0a2540]">Homepage Hero Editor</h1>
            <p className="text-sm text-gray-500">Control everything shown in the homepage hero banner</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-bold text-[#0a2540]">Select Hero Property</h2>
          <p className="mb-4 text-sm text-gray-500">
            Only ONE property can be the homepage hero at a time. Select a different property to switch.
          </p>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                const prop = allProperties.find((p) => p.id === e.target.value);
                if (prop) setForm(toForm(prop));
              }}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
            >
              <option value="">\u2014 Select property \u2014</option>
              {allProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} {p.isHomepageHero ? '(Current Hero)' : ''} [{p.status}]
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="primary"
              disabled={!selectedPropertyId || setHero.isPending}
              onClick={() => selectedPropertyId && setHero.mutate(selectedPropertyId)}
            >
              {setHero.isPending ? 'Setting\u2026' : 'Set as Homepage Hero'}
            </Button>
          </div>
          {heroProperty && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              <Eye className="h-4 w-4" />
              Current hero: <strong>{heroProperty.heroTitle || heroProperty.title}</strong>
              <Link to="/" className="ml-auto font-medium text-amber-700 underline hover:text-amber-900">
                View homepage \u2192
              </Link>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Section title="Hero Content">
            <Field label="Hero Title" value={form.heroTitle} onChange={(v) => setForm((p) => ({ ...p, heroTitle: v }))} />
            <Field label="Hero Subtitle" value={form.heroSubtitle} onChange={(v) => setForm((p) => ({ ...p, heroSubtitle: v }))} />
            <TextArea label="Hero Description" value={form.heroDescription} onChange={(v) => setForm((p) => ({ ...p, heroDescription: v }))} />
          </Section>

          <Section title="Media URLs">
            <Field label="Hero Video URL" value={form.heroVideoUrl} onChange={(v) => setForm((p) => ({ ...p, heroVideoUrl: v }))} />
            <Field label="Hero Image URL (fallback)" value={form.heroImageUrl} onChange={(v) => setForm((p) => ({ ...p, heroImageUrl: v }))} />
          </Section>

          <Section title="Pricing Display">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Starting Price (e.g. \u20B94,200)" value={form.startingPrice} onChange={(v) => setForm((p) => ({ ...p, startingPrice: v }))} />
              <Field label="Price Unit (e.g. / Sq.Yd)" value={form.priceUnit} onChange={(v) => setForm((p) => ({ ...p, priceUnit: v }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price Highlight Label (e.g. STARTING PRICE)" value={form.priceHighlight} onChange={(v) => setForm((p) => ({ ...p, priceHighlight: v }))} />
              <Field label="Offer Badge (e.g. Limited Period)" value={form.offerBadge} onChange={(v) => setForm((p) => ({ ...p, offerBadge: v }))} />
            </div>
          </Section>

          <Section title="Location Details">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="District" value={form.district} onChange={(v) => setForm((p) => ({ ...p, district: v }))} />
              <Field label="State" value={form.state} onChange={(v) => setForm((p) => ({ ...p, state: v }))} />
              <Field label="Landmark" value={form.landmark} onChange={(v) => setForm((p) => ({ ...p, landmark: v }))} />
            </div>
            <Field label="Google Maps URL" value={form.googleMapUrl} onChange={(v) => setForm((p) => ({ ...p, googleMapUrl: v }))} />
          </Section>

          <Section title="Statistics (shown in hero)">
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Total Plots" value={form.totalPlots} onChange={(v) => setForm((p) => ({ ...p, totalPlots: v }))} />
              <Field label="Available Units" value={form.availableUnits} onChange={(v) => setForm((p) => ({ ...p, availableUnits: v }))} />
              <Field label="Distance to ORR" value={form.distanceToORR} onChange={(v) => setForm((p) => ({ ...p, distanceToORR: v }))} />
              <Field label="Internal Road Width" value={form.internalRoadWidth} onChange={(v) => setForm((p) => ({ ...p, internalRoadWidth: v }))} />
            </div>
          </Section>

          <Section title="Button Configuration">
            <div className="grid gap-4 sm:grid-cols-3">
              <ButtonCard title="Button 1 (Primary)">
                <Field label="Label" value={form.btn1Label} onChange={(v) => setForm((p) => ({ ...p, btn1Label: v }))} />
                <SelectField label="Type" value={form.btn1Type} options={['internal', 'external', 'whatsapp', 'phone']} onChange={(v) => setForm((p) => ({ ...p, btn1Type: v }))} />
                <Field label="URL / Phone" value={form.btn1Url} onChange={(v) => setForm((p) => ({ ...p, btn1Url: v }))} />
              </ButtonCard>
              <ButtonCard title="Button 2 (Call)">
                <Field label="Label" value={form.btn2Label} onChange={(v) => setForm((p) => ({ ...p, btn2Label: v }))} />
                <SelectField label="Type" value={form.btn2Type} options={['internal', 'external', 'whatsapp', 'phone']} onChange={(v) => setForm((p) => ({ ...p, btn2Type: v }))} />
                <Field label="URL / Phone" value={form.btn2Url} onChange={(v) => setForm((p) => ({ ...p, btn2Url: v }))} />
              </ButtonCard>
              <ButtonCard title="Button 3 (Location)">
                <Field label="Label" value={form.btn3Label} onChange={(v) => setForm((p) => ({ ...p, btn3Label: v }))} />
                <SelectField label="Type" value={form.btn3Type} options={['internal', 'external', 'whatsapp', 'phone']} onChange={(v) => setForm((p) => ({ ...p, btn3Type: v }))} />
                <Field label="URL" value={form.btn3Url} onChange={(v) => setForm((p) => ({ ...p, btn3Url: v }))} />
              </ButtonCard>
            </div>
          </Section>

          <Section title="Contact Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp Number" value={form.whatsappNumber} onChange={(v) => setForm((p) => ({ ...p, whatsappNumber: v }))} />
              <Field label="Phone Number" value={form.phoneNumber} onChange={(v) => setForm((p) => ({ ...p, phoneNumber: v }))} />
            </div>
          </Section>

          {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">{success}</p>}

          <div className="flex gap-3">
            <Button type="submit" variant="primary" loading={updateHero.isPending} leftIcon={<Save className="h-4 w-4" />}>
              {updateHero.isPending ? 'Saving\u2026' : 'Save Hero Settings'}
            </Button>
            <Link to="/admin">
              <Button type="button" variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ButtonCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
      >
        <option value="">\u2014</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
