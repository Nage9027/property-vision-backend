import { useState, type FormEvent } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Image, Trash2, Eye, EyeOff, Sparkles,
  Calendar, Clock, Save, Upload,
} from 'lucide-react';
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useUploadBannerMedia,
  type PromotionalBanner,
  type BannerInput,
} from '@/features/banners/hooks/usePromotionalBanner';

const POPUP_TYPES = [
  { value: 'CENTER_MODAL', label: 'Center Modal Popup' },
  { value: 'FULLSCREEN', label: 'Fullscreen Cinematic' },
  { value: 'SIDE_FLOATING', label: 'Side Floating Banner' },
  { value: 'BOTTOM_BAR', label: 'Bottom Offer Bar' },
  { value: 'MOBILE_WHATSAPP', label: 'Mobile WhatsApp Popup' },
];

const ANIMATIONS = [
  { value: 'FADE', label: 'Fade In' },
  { value: 'SCALE', label: 'Scale Reveal' },
  { value: 'SLIDE_UP', label: 'Slide Up' },
  { value: 'BLUR', label: 'Cinematic Blur' },
];

function emptyForm(): BannerInput {
  return {
    title: '',
    subtitle: '',
    offerText: '',
    price: '',
    location: '',
    phone: '',
    whatsapp: '',
    ctaText: '',
    ctaUrl: '',
    propertyUrl: '',
    bannerImage: '',
    bannerVideo: '',
    popupType: 'CENTER_MODAL',
    animationType: 'FADE',
    position: 'center',
    enableBlur: true,
    autoOpen: true,
    delayMs: 2000,
    isActive: false,
    priority: 0,
    startDate: null,
    endDate: null,
  };
}

function fromBanner(b: PromotionalBanner): BannerInput {
  return {
    title: b.title || '',
    subtitle: b.subtitle || '',
    offerText: b.offerText || '',
    price: b.price || '',
    location: b.location || '',
    phone: b.phone || '',
    whatsapp: b.whatsapp || '',
    ctaText: b.ctaText || '',
    ctaUrl: b.ctaUrl || '',
    propertyUrl: b.propertyUrl || '',
    bannerImage: b.bannerImage || '',
    bannerVideo: b.bannerVideo || '',
    popupType: b.popupType,
    animationType: b.animationType,
    position: b.position,
    enableBlur: b.enableBlur,
    autoOpen: b.autoOpen,
    delayMs: b.delayMs,
    isActive: b.isActive,
    priority: b.priority,
    startDate: b.startDate,
    endDate: b.endDate,
  };
}

function toLocalDatetime(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 16);
  } catch {
    return '';
  }
}

export function BannerManagerPage() {
  const qc = useQueryClient();
  const { data: banners = [], isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const uploadMedia = useUploadBannerMedia();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerInput>(emptyForm());
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setError('');
    setSuccess('');
  }

  function startEdit(b: PromotionalBanner) {
    setForm(fromBanner(b));
    setEditingId(b.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateBanner.mutateAsync({ id: editingId, input: form });
        setSuccess('Banner updated successfully.');
      } else {
        await createBanner.mutateAsync(form);
        setSuccess('Banner created successfully.');
        resetForm();
      }
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to save banner. Check console.');
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const asset = await uploadMedia.mutateAsync(file);
      setForm((prev) => ({ ...prev, bannerImage: asset.url }));
    } catch {
      setError('Upload failed.');
    }
    setUploading(false);
  }

  async function toggleActive(b: PromotionalBanner) {
    try {
      await updateBanner.mutateAsync({
        id: b.id,
        input: { isActive: !b.isActive },
      });
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
    } catch {
      setError('Failed to toggle status.');
    }
  }

  const isPending = createBanner.isPending || updateBanner.isPending;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/admin" className="hover:text-[#c6a43f]">Dashboard</Link>
          <span>/</span>
          <span className="text-[#0a2540]">Banner Manager</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0a2540]">Promotional Banner Manager</h1>
              <p className="text-sm text-gray-500">Create and manage promotional popups & banners</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => { resetForm(); setShowForm(true); }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New Banner
          </Button>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Banner list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c6a43f] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-3">
            {banners.length === 0 && !showForm && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <Image className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No banners yet. Click "New Banner" to create one.</p>
              </div>
            )}
            {banners.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${b.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                    {b.isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0a2540]">
                      {b.title || 'Untitled Banner'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {POPUP_TYPES.find((t) => t.value === b.popupType)?.label || b.popupType}
                      {' · '}Priority: {b.priority}
                      {b.startDate && ` · ${new Date(b.startDate).toLocaleDateString()}`}
                      {b.endDate && ` — ${new Date(b.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleActive(b)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      b.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {b.isActive ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={() => startEdit(b)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </a>
                  <button
                    onClick={() => { if (confirm('Delete this banner?')) deleteBanner.mutate(b.id); }}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Section title="Content">
              <Field label="Banner Title" value={form.title || ''} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
              <Field label="Subtitle" value={form.subtitle || ''} onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))} />
              <Field label="Offer Text (e.g. Limited Period Offer)" value={form.offerText || ''} onChange={(v) => setForm((p) => ({ ...p, offerText: v }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price Display (e.g. ₹4,200)" value={form.price || ''} onChange={(v) => setForm((p) => ({ ...p, price: v }))} />
                <Field label="Location" value={form.location || ''} onChange={(v) => setForm((p) => ({ ...p, location: v }))} />
              </div>
            </Section>

            <Section title="Media">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Field label="Banner Image URL" value={form.bannerImage || ''} onChange={(v) => setForm((p) => ({ ...p, bannerImage: v }))} />
                  <div className="mt-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                      <Upload className="h-3.5 w-3.5" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  {form.bannerImage && (
                    <img src={form.bannerImage} alt="Preview" className="mt-2 h-20 w-36 rounded-lg object-cover" />
                  )}
                </div>
                <Field label="Banner Video URL (MP4)" value={form.bannerVideo || ''} onChange={(v) => setForm((p) => ({ ...p, bannerVideo: v }))} />
              </div>
            </Section>

            <Section title="Popup Configuration">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  label="Popup Type"
                  value={form.popupType || 'CENTER_MODAL'}
                  options={POPUP_TYPES}
                  onChange={(v) => setForm((p) => ({ ...p, popupType: v }))}
                />
                <SelectField
                  label="Animation Style"
                  value={form.animationType || 'FADE'}
                  options={ANIMATIONS}
                  onChange={(v) => setForm((p) => ({ ...p, animationType: v }))}
                />
                <Field label="Position (center, right, left)" value={form.position || 'center'} onChange={(v) => setForm((p) => ({ ...p, position: v }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Delay (ms)" type="number" value={String(form.delayMs ?? 2000)} onChange={(v) => setForm((p) => ({ ...p, delayMs: parseInt(v) || 2000 }))} />
                <Field label="Priority (lower = first)" type="number" value={String(form.priority ?? 0)} onChange={(v) => setForm((p) => ({ ...p, priority: parseInt(v) || 0 }))} />
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.enableBlur ?? true}
                    onChange={(e) => setForm((p) => ({ ...p, enableBlur: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  Background Blur
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.autoOpen ?? true}
                    onChange={(e) => setForm((p) => ({ ...p, autoOpen: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  Auto Open
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.isActive ?? false}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="font-medium text-emerald-600">Publish Active</span>
                </label>
              </div>
            </Section>

            <Section title="Scheduling">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start Date" type="datetime-local" value={toLocalDatetime(form.startDate)} onChange={(v) => setForm((p) => ({ ...p, startDate: v ? new Date(v).toISOString() : null }))} />
                <Field label="End Date" type="datetime-local" value={toLocalDatetime(form.endDate)} onChange={(v) => setForm((p) => ({ ...p, endDate: v ? new Date(v).toISOString() : null }))} />
              </div>
            </Section>

            <Section title="CTA & Redirect">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CTA Button Text" value={form.ctaText || ''} onChange={(v) => setForm((p) => ({ ...p, ctaText: v }))} />
                <Field label="CTA URL (external)" value={form.ctaUrl || ''} onChange={(v) => setForm((p) => ({ ...p, ctaUrl: v }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Property Page URL (internal)" value={form.propertyUrl || ''} onChange={(v) => setForm((p) => ({ ...p, propertyUrl: v }))} />
                <Field label="WhatsApp Number" value={form.whatsapp || ''} onChange={(v) => setForm((p) => ({ ...p, whatsapp: v }))} />
                <Field label="Phone Number" value={form.phone || ''} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
              </div>
            </Section>

            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
            {success && <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">{success}</p>}

            <div className="flex gap-3">
              <Button type="submit" variant="primary" loading={isPending} leftIcon={<Save className="h-4 w-4" />}>
                {isPending ? 'Saving…' : editingId ? 'Update Banner' : 'Create Banner'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); resetForm(); }}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
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

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
