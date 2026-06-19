import { useState, type FormEvent } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { PRIMARY_CONTACT_NUMBER } from '@/data/contact';

type Props = {
  onSuccess: () => void;
};

export function ContactAdminForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyInterest: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in name, email, and phone.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(endpoints.contactSubmissions, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        propertyInterest: form.propertyInterest || null,
      });
      setSent(true);
      setTimeout(onSuccess, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>
        <p className="font-semibold text-green-800">Request sent!</p>
        <p className="mt-1 text-sm text-green-600">The admin will contact you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Your Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone *</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Property Interest</label>
        <input
          type="text"
          value={form.propertyInterest}
          onChange={(e) => setForm((p) => ({ ...p, propertyInterest: e.target.value }))}
          placeholder="e.g. Plots, Villas, Commercial"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
        />
      </div>

      <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
        Or contact admin directly:{' '}
        <a href={PRIMARY_CONTACT_NUMBER.href} className="font-semibold underline">
          {PRIMARY_CONTACT_NUMBER.display}
        </a>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] text-sm font-bold text-[#081120] shadow-md transition hover:brightness-105"
      >
        {loading ? 'Sending\u2026' : 'Submit Request'}
      </button>
    </form>
  );
}
