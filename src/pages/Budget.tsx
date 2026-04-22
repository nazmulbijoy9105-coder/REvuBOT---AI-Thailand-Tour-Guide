import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRightLeft, TrendingUp, Wallet, Info } from 'lucide-react';

const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'රු' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

export default function Budget() {
  const [amount, setAmount] = React.useState<string>('100');
  const [fromCurrency, setFromCurrency] = React.useState('USD');
  const [rates, setRates] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://open.er-api.com/v6/latest/THB');
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convertToTHB = (val: string) => {
    if (!rates[fromCurrency]) return 0;
    const num = parseFloat(val) || 0;
    // 1 FromCurrency = (1 / rates[fromCurrency]) THB
    return (num / rates[fromCurrency]).toFixed(2);
  };

  const convertFromTHB = (thbVal: number) => {
    if (!rates[fromCurrency]) return 0;
    return (thbVal * rates[fromCurrency]).toFixed(2);
  };

  const thbAmount = convertToTHB(amount);

  return (
    <div className="bg-surface min-h-screen py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-12 h-1 bg-brand rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Financial Intelligence Unit</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">BUDGET <br /> OPTIMIZATION.</h1>
          <p className="text-lg text-ink-muted font-medium max-w-xl">Real-time THB conversion and expenditure protocols for international travelers. Stay within your logistical parameters.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Converter Tool */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-slate-200/50"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Currency Intercept</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Input Amount ({fromCurrency})</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-3xl font-black outline-none focus:border-brand transition-all shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2 shadow-sm">
                      <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="font-black text-xs uppercase tracking-widest outline-none bg-transparent cursor-pointer"
                      >
                        {COMMON_CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                   <div className="w-12 h-12 bg-panel text-white rounded-full flex items-center justify-center shadow-lg">
                      <Calculator className="w-5 h-5" />
                   </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Optimized Result (THB)</label>
                  <div className="bg-brand/5 border border-brand/20 rounded-2xl p-8 text-center">
                    <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Estimated Thai Baht</p>
                    <h3 className="text-5xl font-black text-panel tracking-tighter">฿ {thbAmount}</h3>
                    {loading && <p className="text-[10px] mt-4 animate-pulse text-slate-400 font-bold uppercase">Syncing Live Rates...</p>}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <StatCard icon={<TrendingUp />} title="Daily Allowance" val="฿ 1,500 - 3,000" desc="Recommended daily budget for comfortable travel." />
               <StatCard icon={<Wallet />} title="Cash Strategy" val="70% Digital / 30% Cash" desc="Pro-tip: Keep small bills for market street food." />
            </div>
          </div>

          {/* Cheat Sheet Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-panel text-white rounded-3xl p-8 shadow-xl border border-slate-800">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand mb-6">Price Reference Benchmarks</h3>
               <div className="space-y-4">
                  <PriceItem label="Street Food (Basic Meal)" price="฿ 50 - 80" converted={convertFromTHB(80)} sym={COMMON_CURRENCIES.find(c => c.code === fromCurrency)?.symbol} />
                  <PriceItem label="Restaurant Meal" price="฿ 300 - 600" converted={convertFromTHB(600)} sym={COMMON_CURRENCIES.find(c => c.code === fromCurrency)?.symbol} />
                  <PriceItem label="BTSSkytrain (Short Trip)" price="฿ 17 - 45" converted={convertFromTHB(45)} sym={COMMON_CURRENCIES.find(c => c.code === fromCurrency)?.symbol} />
                  <PriceItem label="Motorbike Taxi" price="฿ 20 - 100" converted={convertFromTHB(100)} sym={COMMON_CURRENCIES.find(c => c.code === fromCurrency)?.symbol} />
                  <PriceItem label="Thai Massage (1hr)" price="฿ 250 - 450" converted={convertFromTHB(450)} sym={COMMON_CURRENCIES.find(c => c.code === fromCurrency)?.symbol} />
               </div>
               <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-brand">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-50 font-medium italic">Conversion rates updated via Global Neural Exchange. Final transaction values may vary by provider.</p>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Tactical Advice</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                   Avoid terminal currency exchanges. Opt for city ATMs (SCB or Kasikorn) for better parity. Always check for the <span className="text-brand font-bold">\"No Fee\"</span> sign on credit card terminals.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, val, desc }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
       <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-4">
          {icon}
       </div>
       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
       <p className="text-lg font-black text-panel mb-2">{val}</p>
       <p className="text-xs text-slate-500 font-medium leading-tight">{desc}</p>
    </div>
  );
}

function PriceItem({ label, price, converted, sym }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-xs font-bold text-white mb-0.5">{label}</p>
        <p className="text-[10px] text-brand uppercase font-black tracking-widest">{price}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-black text-white/40">~{sym}{converted}</p>
      </div>
    </div>
  );
}
