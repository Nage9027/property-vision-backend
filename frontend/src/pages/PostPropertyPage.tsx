import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { authStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { propertiesApi } from '@/features/properties/api';
import { PlotManagement } from '@/components/PlotManagement';
import type { Property } from '@/types/property';

type FormState = {
  title: string;
  city: string;
  locality: string;
  address: string;
  price: string;
  propertyType: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  possessionStatus: string;
  featured: boolean;
  heroVideoFile: File | null;
  bannerImageFile: File | null;
  masterPlanFile: File | null;
  galleryFiles: File[];
  amenities: string;
  status: 'DRAFT' | 'PUBLISHED';
  // Dynamic page content
  investmentOverview: string;
  expectedROI: string;
  investmentBenefits: string;
  locationAdvantages: string;
  testimonials: string;
  faqs: string;
  siteVisitBenefits: string;
  contactInformation: string;
  footerInformation: string;
  customSections: string;
  seoTitle: string;
  seoDescription: string;
};

const initial: FormState = {
  title: '',
  city: '',
  locality: '',
  address: '',
  price: '',
  propertyType: '',
  description: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  possessionStatus: '',
  featured: false,
  heroVideoFile: null,
  bannerImageFile: null,
  masterPlanFile: null,
  galleryFiles: [],
  amenities: '',
  status: 'PUBLISHED',
  investmentOverview: '',
  expectedROI: '',
  investmentBenefits: '',
  locationAdvantages: '',
  testimonials: '',
  faqs: '',
  siteVisitBenefits: '',
  contactInformation: '',
  footerInformation: '',
  customSections: '',
  seoTitle: '',
  seoDescription: '',
};

export function PostPropertyPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slug, setSlug] = useState('');

  const user = authStore.getUser();
  const isEditing = Boolean(editId);
  const canSubmit = useMemo(() => !!form.title && !!form.city, [form.title, form.city]);

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    propertiesApi
      .byId(editId)
      .then(({ data }) => {
        const p = data?.data as Property | undefined;
        if (!p) return;
        setForm({
          title: p.title ?? '',
          city: p.city ?? '',
          locality: p.locality ?? '',
          address: p.address ?? '',
          price: p.price ? String(p.price) : '',
          propertyType: p.propertyType ?? '',
          description: p.description ?? '',
          bedrooms: p.bedrooms != null ? String(p.bedrooms) : '',
          bathrooms: p.bathrooms != null ? String(p.bathrooms) : '',
          area: p.area != null ? String(p.area) : '',
          possessionStatus: p.possessionStatus ?? '',
          featured: p.featured ?? false,
          heroVideoFile: null,
          bannerImageFile: null,
          masterPlanFile: null,
          galleryFiles: [],
          amenities: p.amenities?.join(', ') ?? '',
          status: (p.status as FormState['status']) ?? 'PUBLISHED',
          investmentOverview: p.investmentOverview ? JSON.stringify(p.investmentOverview, null, 2) : '',
          expectedROI: p.expectedROI ?? '',
          investmentBenefits: p.investmentBenefits ? JSON.stringify(p.investmentBenefits, null, 2) : '',
          locationAdvantages: p.locationAdvantages ? JSON.stringify(p.locationAdvantages, null, 2) : '',
          testimonials: p.testimonials ? JSON.stringify(p.testimonials, null, 2) : '',
          faqs: p.faqs ? JSON.stringify(p.faqs, null, 2) : '',
          siteVisitBenefits: p.siteVisitBenefits ? JSON.stringify(p.siteVisitBenefits, null, 2) : '',
          contactInformation: p.contactInformation ? JSON.stringify(p.contactInformation, null, 2) : '',
          footerInformation: p.footerInformation ? JSON.stringify(p.footerInformation, null, 2) : '',
          customSections: p.customSections ? JSON.stringify(p.customSections, null, 2) : '',
          seoTitle: p.seoTitle ?? '',
          seoDescription: p.seoDescription ?? '',
        });
      })
      .catch(() => setError('Could not load property for editing.'))
      .finally(() => setFetching(false));
  }, [editId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSlug('');

    if (!canSubmit) {
      setError('Title and city are required.');
      return;
    }

    try {
      setLoading(true);

      const uploadItems: Array<{ type: string; file: File }> = [];
      if (form.heroVideoFile) uploadItems.push({ type: 'video', file: form.heroVideoFile });
      if (form.bannerImageFile) uploadItems.push({ type: 'banner-image', file: form.bannerImageFile });
      if (form.masterPlanFile) uploadItems.push({ type: 'master-plan', file: form.masterPlanFile });
      form.galleryFiles.forEach((file) => uploadItems.push({ type: 'image', file }));

      const uploaded = uploadItems.length
        ? await (async () => {
            const formData = new FormData();
            uploadItems.forEach((item) => formData.append('files', item.file));
            formData.append('folder', 'property-vision/properties');
            const response = await propertiesApi.uploadMedia(formData);
            return response.data.data ?? [];
          })()
        : [];

      const media = uploaded.map((item, index) => ({
        type: uploadItems[index]?.type ?? 'image',
        url: item.url,
        sortOrder: index,
      }));

      function parseJson(str: string) { try { return str ? JSON.parse(str) : undefined; } catch { return undefined; } }

      const payload = {
        title: form.title,
        city: form.city,
        locality: form.locality || undefined,
        address: form.address || undefined,
        price: form.price ? Number(form.price) : undefined,
        propertyType: form.propertyType || undefined,
        description: form.description || undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        area: form.area ? Number(form.area) : undefined,
        possessionStatus: form.possessionStatus || undefined,
        featured: form.featured,
        media: media.length ? media : undefined,
        amenities: form.amenities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        status: form.status,
        investmentOverview: parseJson(form.investmentOverview),
        expectedROI: form.expectedROI || undefined,
        investmentBenefits: parseJson(form.investmentBenefits),
        locationAdvantages: parseJson(form.locationAdvantages),
        testimonials: parseJson(form.testimonials),
        faqs: parseJson(form.faqs),
        siteVisitBenefits: parseJson(form.siteVisitBenefits),
        contactInformation: parseJson(form.contactInformation),
        footerInformation: parseJson(form.footerInformation),
        customSections: parseJson(form.customSections),
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
      };

      if (isEditing && editId) {
        await propertiesApi.update(editId, payload);
        setSuccess('Updated successfully.');
      } else {
        const { data } = await propertiesApi.create(payload);
        const saved = data?.data as { slug?: string } | undefined;
        setSuccess(form.status === 'PUBLISHED' ? 'Published successfully.' : 'Saved as draft.');
        if (saved?.slug) setSlug(saved.slug);
        setForm(initial);
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg ?? 'Could not save. Are you logged in and is the API running?');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AppLayout>
        <section className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading property…</p>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="relative -mt-20 bg-gradient-to-br from-[#081120] via-[#0a2540] to-[#0d9488] px-4 pb-12 pt-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-white p-6 shadow-xl">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-[#081120]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isEditing ? 'Edit property' : 'Post property'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditing
                ? 'Update the property details below.'
                : `Signed in as ${user?.name ?? 'User'}. Fill metadata, then publish.`}
            </p>
            {isEditing && (
              <Link to="/admin/properties" className="mt-1 inline-block text-xs text-[#c6a43f] underline">
                ← Back to property management
              </Link>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Basic Information
              </p>
              <Field label="Title *" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="City *" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
                <Field label="Locality" value={form.locality} onChange={(v) => setForm((p) => ({ ...p, locality: v }))} />
              </div>
              <div className="mt-3">
                <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Pricing & Units
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Price (INR)" value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v }))} />
                <Field label="Bedrooms" value={form.bedrooms} onChange={(v) => setForm((p) => ({ ...p, bedrooms: v }))} />
                <Field label="Bathrooms" value={form.bathrooms} onChange={(v) => setForm((p) => ({ ...p, bathrooms: v }))} />
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <Field label="Area (sq ft)" value={form.area} onChange={(v) => setForm((p) => ({ ...p, area: v }))} />
                <Field label="Property type" value={form.propertyType} onChange={(v) => setForm((p) => ({ ...p, propertyType: v }))} />
                <Field label="Possession status" value={form.possessionStatus} onChange={(v) => setForm((p) => ({ ...p, possessionStatus: v }))} />
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Description & Amenities
              </p>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <div className="mt-3">
                <Field
                  label="Amenities (comma-separated)"
                  value={form.amenities}
                  onChange={(v) => setForm((p) => ({ ...p, amenities: v }))}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="h-4 w-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured property
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Media Uploads
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <FileField label="Hero video" accept="video/*" onChange={(f) => setForm((p) => ({ ...p, heroVideoFile: f }))} />
                <FileField label="Banner image" accept="image/*" onChange={(f) => setForm((p) => ({ ...p, bannerImageFile: f }))} />
                <FileField label="Master plan" accept="image/*" onChange={(f) => setForm((p) => ({ ...p, masterPlanFile: f }))} />
              </div>
              <div className="mt-3">
                <FileField
                  label="Gallery images (multi)"
                  accept="image/*"
                  multiple
                  onChange={(f, multiple) =>
                    setForm((p) => ({ ...p, galleryFiles: multiple ? Array.from(f ? [f] : []) : [] }))
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Status
              </p>
              <label className="block text-sm">
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as FormState['status'] }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Dynamic Page Content
              </p>
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">Investment Overview</summary>
                <div className="mt-2 space-y-2">
                  <Field label="Expected ROI" value={form.expectedROI} onChange={(v) => setForm((p) => ({ ...p, expectedROI: v }))} />
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Investment Overview (JSON)</span>
                    <textarea value={form.investmentOverview} onChange={(e) => setForm((p) => ({ ...p, investmentOverview: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='{"heading":"Why Invest Here?","description":"..."}' />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Investment Benefits (JSON array)</span>
                    <textarea value={form.investmentBenefits} onChange={(e) => setForm((p) => ({ ...p, investmentBenefits: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"icon":"TrendingUp","value":"15-20%","label":"Appreciation","sub":"Year on Year"}]' />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">Location Advantages</summary>
                <div className="mt-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Location Advantages (JSON array)</span>
                    <textarea value={form.locationAdvantages} onChange={(e) => setForm((p) => ({ ...p, locationAdvantages: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"title":"ORR Exit","distance":"3 KM","description":"Direct access"}]' />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">Testimonials</summary>
                <div className="mt-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Testimonials (JSON array)</span>
                    <textarea value={form.testimonials} onChange={(e) => setForm((p) => ({ ...p, testimonials: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"name":"Suresh","text":"Great investment...","rating":5}]' />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">FAQs</summary>
                <div className="mt-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">FAQs (JSON array)</span>
                    <textarea value={form.faqs} onChange={(e) => setForm((p) => ({ ...p, faqs: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"q":"What is pricing?","a":"Starts from..."}]' />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">Site Visit & Contact</summary>
                <div className="mt-2 space-y-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Site Visit Benefits (JSON array)</span>
                    <textarea value={form.siteVisitBenefits} onChange={(e) => setForm((p) => ({ ...p, siteVisitBenefits: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"text":"Free pickup and drop"}]' />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Contact Information (JSON)</span>
                    <textarea value={form.contactInformation} onChange={(e) => setForm((p) => ({ ...p, contactInformation: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='{"email":"...","phone":"..."}' />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Footer Information (JSON)</span>
                    <textarea value={form.footerInformation} onChange={(e) => setForm((p) => ({ ...p, footerInformation: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='{"address":"...","hours":"..."}' />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">SEO</summary>
                <div className="mt-2 grid gap-2">
                  <Field label="SEO Title" value={form.seoTitle} onChange={(v) => setForm((p) => ({ ...p, seoTitle: v }))} />
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">SEO Description</span>
                    <textarea value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                  </label>
                </div>
              </details>
              <details className="group mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">Custom Sections (JSON array)</summary>
                <div className="mt-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-gray-700">Custom Sections</span>
                    <textarea value={form.customSections} onChange={(e) => setForm((p) => ({ ...p, customSections: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono" placeholder='[{"heading":"...","content":"..."}]' />
                  </label>
                </div>
              </details>
            </div>

            {/* ── Plot Management ── */}
            {isEditing && editId && (
              <div className="mt-8">
                <PlotManagement propertyId={editId} />
              </div>
            )}

            {error ? <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}
            {success ? (
              <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                {success}{' '}
                {slug ? (
                  <Link to={`/properties/${slug}`} className="font-semibold underline">
                    View listing
                  </Link>
                ) : null}
                {isEditing && editId ? (
                  <Link to={`/properties/${editId}`} className="font-semibold underline">
                    View listing
                  </Link>
                ) : null}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full" variant="primary">
              {loading ? 'Saving…' : isEditing ? 'Update Property' : 'Submit'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              authStore.clearSession();
              window.location.href = '/login';
            }}
            className="mt-4 text-sm text-gray-500 underline"
          >
            Log out
          </button>
        </div>
      </section>
    </AppLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
      />
    </label>
  );
}

function FileField({
  label,
  accept,
  multiple,
  onChange,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  onChange: (file: File | null, multiple?: boolean) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (multiple) {
            const files = e.target.files;
            onChange(files?.[0] ?? null, true);
          } else {
            onChange(e.target.files?.[0] ?? null);
          }
        }}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
      />
    </label>
  );
}
