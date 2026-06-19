import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, Calculator, ArrowRight, Shield } from 'lucide-react';
import { fadeUp, staggerContainer, cardHover, easeOut } from '@/config/animations';

type InvestmentCalculatorProps = {
  pricePerSqYd?: number;
  plotSizes?: number[];
};

function formatCurrency(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function InvestmentCalculator({ pricePerSqYd = 4200, plotSizes }: InvestmentCalculatorProps) {
  const [plotSize, setPlotSize] = useState(150);
  const [appreciation, setAppreciation] = useState(12);
  const [years, setYears] = useState(5);

  const currentValue = plotSize * pricePerSqYd;
  const futureValue = currentValue * Math.pow(1 + appreciation / 100, years);
  const roi = ((futureValue - currentValue) / currentValue) * 100;
  const yearlyReturn = ((futureValue / currentValue) ** (1 / years) - 1) * 100;

  const appreciationScenarios = [
    { label: 'Conservative', rate: appreciation - 3, color: 'text-amber-500' },
    { label: 'Expected', rate: appreciation, color: 'text-emerald-500' },
    { label: 'Optimistic', rate: appreciation + 3, color: 'text-[#c6a43f]' },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-[#f8fafc] p-6 shadow-sm lg:p-10"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/[0.04] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#c6a43f]/[0.03] blur-[60px]" />

      <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c6a43f]/10 text-[#c6a43f]">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0a2540]">Investment Calculator</h3>
          <p className="text-xs text-gray-500">Estimate your potential returns</p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div variants={fadeUp} className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#0a2540]">Plot Size</label>
              <span className="text-lg font-bold text-[#0a2540]">{plotSize} <span className="text-sm font-normal text-gray-400">Sq.Yards</span></span>
            </div>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={plotSize}
              onChange={(e) => setPlotSize(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-[#c6a43f] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c6a43f] [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>100</span>
              <span>500</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#0a2540]">Expected Appreciation</label>
              <span className="text-lg font-bold text-emerald-600">{appreciation}% <span className="text-sm font-normal text-gray-400">/yr</span></span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={0.5}
              value={appreciation}
              onChange={(e) => setAppreciation(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-emerald-500 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#0a2540]">Investment Horizon</label>
              <span className="text-lg font-bold text-[#0a2540]">{years} <span className="text-sm font-normal text-gray-400">Years</span></span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-[#0a2540] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0a2540] [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>3 Yrs</span>
              <span>15 Yrs</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col justify-center">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">Current Investment</p>
            <p className="mt-1 font-serif text-3xl font-bold text-[#0a2540]">{formatCurrency(currentValue)}</p>
            <p className="mt-0.5 text-xs text-gray-400">{plotSize} Sq.Yards × {formatCurrency(pricePerSqYd)}/Sq.Yd</p>

            <div className="my-4 h-px bg-gradient-to-r from-emerald-200 via-emerald-100 to-transparent" />

            <p className="text-xs font-medium uppercase tracking-wider text-[#c6a43f]">Projected Value ({years} Years)</p>
            <p className="mt-1 font-serif text-3xl font-bold text-[#c6a43f]">{formatCurrency(Math.round(futureValue))}</p>
            <p className="mt-0.5 text-xs text-gray-400">At {appreciation}% annual appreciation</p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 shadow-sm">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-lg font-bold text-emerald-600">+{roi.toFixed(1)}% ROI</p>
                <p className="text-xs text-gray-400">{formatCurrency(Math.round(futureValue - currentValue))} total gain</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {appreciationScenarios.map((s) => {
              const fv = currentValue * Math.pow(1 + s.rate / 100, years);
              const r = ((fv - currentValue) / currentValue) * 100;
              return (
                <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{s.label}</p>
                  <p className={`mt-0.5 text-sm font-bold ${s.color}`}>{r.toFixed(0)}%</p>
                  <p className="text-[10px] text-gray-400">{formatCurrency(Math.round(fv))}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="mt-6 flex items-center gap-2 rounded-xl border border-[#c6a43f]/10 bg-[#c6a43f]/5 px-4 py-3">
        <Shield className="h-4 w-4 shrink-0 text-[#c6a43f]" />
        <p className="text-xs text-gray-500">
          <span className="font-medium text-[#0a2540]">Disclaimer:</span> This is an estimated projection based on historical data. Actual returns may vary. Consult with our investment advisors for detailed analysis.
        </p>
      </motion.div>
    </motion.section>
  );
}
