import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Home, Compass, Ruler, Save,
  CornerDownRight, Store, TreePine, Upload,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '@/features/properties/api';
import type { Plot, PlotStatus, Facing } from '@/types/property';

interface Props {
  propertyId: string;
}

const FACINGS: Facing[] = ['EAST', 'WEST', 'NORTH', 'SOUTH'];
const STATUSES: { value: PlotStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'RESERVED', label: 'Reserved' },
];

const emptyPlot = {
  plotNumber: '',
  facing: 'EAST' as Facing,
  sizeSqYds: 200,
  roadWidth: '33 ft',
  status: 'AVAILABLE' as PlotStatus,
  pricePerSqYd: 4200,
  isCorner: false,
  isCommercialFacing: false,
  isParkFacing: false,
  features: '',
};

export function PlotManagement({ propertyId }: Props) {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyPlot });
  const [showForm, setShowForm] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [facingFilter, setFacingFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const loadPlots = useCallback(async () => {
    try {
      const { data } = await propertiesApi.plots.list(propertyId);
      setPlots(data?.data ?? []);
    } catch { /* ignore */ }
  }, [propertyId]);

  useEffect(() => { loadPlots(); }, [loadPlots]);

  const refresh = async () => {
    await loadPlots();
    queryClient.invalidateQueries({ queryKey: ['plots', propertyId] });
    queryClient.invalidateQueries({ queryKey: ['plot-summary', propertyId] });
  };

  const handleSave = async () => {
    if (!form.plotNumber.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await propertiesApi.plots.update(editingId, form);
      } else {
        await propertiesApi.plots.create(propertyId, form);
      }
      setForm({ ...emptyPlot });
      setEditingId(null);
      setShowForm(false);
      await refresh();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save plot');
    }
    setLoading(false);
  };

  const handleEdit = (plot: Plot) => {
    setForm({
      plotNumber: plot.plotNumber,
      facing: plot.facing,
      sizeSqYds: plot.sizeSqYds,
      roadWidth: plot.roadWidth || '',
      status: plot.status,
      pricePerSqYd: plot.pricePerSqYd ? Number(plot.pricePerSqYd) : 0,
      isCorner: plot.isCorner,
      isCommercialFacing: plot.isCommercialFacing,
      isParkFacing: plot.isParkFacing,
      features: plot.features || '',
    });
    setEditingId(plot.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plot?')) return;
    try {
      await propertiesApi.plots.delete(id);
      await refresh();
    } catch { alert('Failed to delete plot'); }
  };

  const handleBulkCreate = async () => {
    const lines = bulkInput.trim().split('\n').filter(Boolean);
    if (!lines.length) return;
    const plots = lines.map((line) => {
      const [num, facing, size, road, status, price] = line.split(',').map((s) => s.trim());
      return {
        plotNumber: num,
        facing: (facing?.toUpperCase() as Facing) || 'EAST',
        sizeSqYds: parseFloat(size) || 200,
        roadWidth: road || '33 ft',
        status: (status?.toUpperCase() as PlotStatus) || 'AVAILABLE',
        pricePerSqYd: parseFloat(price) || 4200,
      };
    });
    setLoading(true);
    try {
      await propertiesApi.plots.bulkCreate(propertyId, plots);
      setBulkInput('');
      setShowBulk(false);
      await refresh();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to bulk create plots');
    }
    setLoading(false);
  };

  const STATUS_BADGE: Record<string, string> = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    SOLD: 'bg-red-100 text-red-700',
    RESERVED: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#0A1931]">Plot Management</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">{plots.length} plots</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowBulk(!showBulk); setEditingId(null); setForm({ ...emptyPlot }); }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
          >
            <Upload className="h-3.5 w-3.5" /> Bulk Add
          </button>
          <button
            onClick={() => { setEditingId(null); setForm({ ...emptyPlot }); setShowForm(true); }}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C84C] px-3 py-1.5 text-xs font-bold text-[#0A1931] transition-all hover:shadow-md"
          >
            <Plus className="h-3.5 w-3.5" /> Add Plot
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FACINGS.map((f) => {
          const count = plots.filter((p) => p.facing === f).length;
          const isActive = facingFilter === f;
          return (
            <button
              key={f}
              onClick={() => setFacingFilter(isActive ? null : f)}
              className={`rounded-lg border p-3 text-center transition-all ${
                isActive
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="text-lg font-bold text-[#0A1931]">{count}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{f.toLowerCase()}</div>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Plot Number</label>
                <input value={form.plotNumber} onChange={(e) => setForm({ ...form, plotNumber: e.target.value })} placeholder="e.g. 45" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Facing</label>
                <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value as Facing })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none">
                  {FACINGS.map((f) => <option key={f} value={f}>{f.charAt(0) + f.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Size (Sq.Yds)</label>
                <input type="number" value={form.sizeSqYds} onChange={(e) => setForm({ ...form, sizeSqYds: parseFloat(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Road Width</label>
                <input value={form.roadWidth || ''} onChange={(e) => setForm({ ...form, roadWidth: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PlotStatus })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none">
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Price (per Sq.Yd)</label>
                <input type="number" value={form.pricePerSqYd} onChange={(e) => setForm({ ...form, pricePerSqYd: parseFloat(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Features</label>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Corner plot, park view..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={form.isCorner} onChange={(e) => setForm({ ...form, isCorner: e.target.checked })} className="rounded accent-[#D4AF37]" />
                  <CornerDownRight className="h-3 w-3" /> Corner
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={form.isCommercialFacing} onChange={(e) => setForm({ ...form, isCommercialFacing: e.target.checked })} className="rounded accent-[#D4AF37]" />
                  <Store className="h-3 w-3" /> Commercial
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={form.isParkFacing} onChange={(e) => setForm({ ...form, isParkFacing: e.target.checked })} className="rounded accent-[#D4AF37]" />
                  <TreePine className="h-3 w-3" /> Park
                </label>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading || !form.plotNumber.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C84C] px-4 py-2 text-xs font-bold text-[#0A1931] transition-all hover:shadow-md disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> {editingId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingId(null); setForm({ ...emptyPlot }); setShowForm(false); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 transition-all hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Input */}
      <AnimatePresence>
        {showBulk && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="mb-2 text-xs font-medium text-slate-500">Bulk Add — one plot per line: <code className="bg-slate-200 px-1 rounded">plotNumber, facing, sizeSqYds, roadWidth, status, price</code></p>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={6}
              placeholder={"1,EAST,200,33 ft,AVAILABLE,4200\n2,WEST,180,33 ft,AVAILABLE,4200\n3,EAST,200,33 ft,SOLD,4200"}
              className="w-full rounded-lg border border-slate-200 p-3 text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
            />
            <button
              onClick={handleBulkCreate}
              disabled={loading || !bulkInput.trim()}
              className="mt-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C84C] px-4 py-2 text-xs font-bold text-[#0A1931] transition-all hover:shadow-md disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" /> Create {bulkInput.trim().split('\n').filter(Boolean).length} Plots
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plots Table */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-white text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Plot</th>
              <th className="py-2 pr-2">Facing</th>
              <th className="py-2 pr-2">Size</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2 pr-2">Corner</th>
              <th className="py-2 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plots
              .filter((p) => !facingFilter || p.facing === facingFilter)
              .map((plot) => (
              <tr key={plot.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="py-2 pr-2 font-medium text-slate-500">{plot.plotNumber}</td>
                <td className="py-2 pr-2 font-semibold text-[#0A1931]">#{plot.plotNumber}</td>
                <td className="py-2 pr-2 capitalize">{plot.facing.toLowerCase()}</td>
                <td className="py-2 pr-2 text-slate-600">{plot.sizeSqYds} sq.yd</td>
                <td className="py-2 pr-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[plot.status] || 'bg-slate-100 text-slate-600'}`}>
                    {plot.status}
                  </span>
                </td>
                <td className="py-2 pr-2">{plot.isCorner ? <CornerDownRight className="h-3 w-3 text-[#D4AF37]" /> : '—'}</td>
                <td className="py-2">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(plot)} className="rounded p-1 text-slate-400 transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(plot.id)} className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {plots.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">No plots added yet. Add your first plot above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
