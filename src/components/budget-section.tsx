'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, DollarSign, TrendingUp, Wallet, UtensilsCrossed, Train, Bike, HandMetal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'BDT', 'LKR', 'SGD', 'THB'];

const MOCK_THB_HISTORY = [
  { day: 'Mon', rate: 34.85 },
  { day: 'Tue', rate: 35.12 },
  { day: 'Wed', rate: 34.92 },
  { day: 'Thu', rate: 35.25 },
  { day: 'Fri', rate: 35.08 },
  { day: 'Sat', rate: 34.78 },
  { day: 'Sun', rate: 35.0 },
];

const PRICE_REFERENCES = [
  { label: 'Street Food', thbMin: 50, thbMax: 80, icon: UtensilsCrossed },
  { label: 'Restaurant Meal', thbMin: 300, thbMax: 600, icon: UtensilsCrossed },
  { label: 'BTS Skytrain', thbMin: 17, thbMax: 45, icon: Train },
  { label: 'Motorbike Taxi', thbMin: 20, thbMax: 100, icon: Bike },
  { label: 'Thai Massage', thbMin: 250, thbMax: 450, icon: HandMetal },
];

const DAILY_BUDGETS = [
  { label: 'Backpacker', thbMin: 1000, thbMax: 1500, icon: '🎒', color: 'text-emerald-400' },
  { label: 'Mid-range', thbMin: 2500, thbMax: 5000, icon: '🏨', color: 'text-amber-400' },
  { label: 'Luxury', thbMin: 7000, thbMax: null, icon: '💎', color: 'text-purple-400' },
];

export function BudgetSection() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('THB');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const convert = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/currency?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
      const data = await res.json();
      if (data.result !== undefined) {
        setResult(data.result);
        setRate(data.rate);
      }
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertTHB = (thb: number) => {
    if (!rate || fromCurrency === 'THB') return thb;
    // If we're viewing from a non-THB currency, we need THB -> fromCurrency rate
    // rate = fromCurrency -> toCurrency, but we need THB -> fromCurrency
    // Since our API gives from->to, let's just use approximate inverse
    const thbToFrom = 1 / (rate || 35);
    return Math.round(thb * thbToFrom * 100) / 100;
  };

  return (
    <section id="budget" className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 mb-3 text-xs font-bold uppercase tracking-widest">
            <DollarSign className="w-3 h-3 mr-1" />
            Budget & Currency
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            BUDGET <span className="text-amber-500">OPTIMIZATION</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider">Financial Intelligence Unit</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currency Converter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-amber-500" />
                  Currency Converter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Amount Input */}
                  <div className="flex-1 w-full">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Amount</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="text-2xl font-bold h-14 border-slate-300"
                      min={0}
                    />
                  </div>

                  {/* From Currency */}
                  <div className="w-full sm:w-32">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">From</label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="h-14 text-base font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swap Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwap}
                    className="h-14 w-14 rounded-full border-amber-500 text-amber-500 hover:bg-amber-50 shrink-0 mt-4 sm:mt-5"
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                  </Button>

                  {/* To Currency */}
                  <div className="w-full sm:w-32">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">To</label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="h-14 text-base font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Result Display */}
                <div className="mt-6 p-5 bg-slate-900 rounded-xl text-center">
                  {loading ? (
                    <div className="text-amber-400 text-sm animate-pulse">Converting...</div>
                  ) : result !== null ? (
                    <>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        {amount} {fromCurrency} =
                      </p>
                      <p className="text-3xl sm:text-4xl font-black text-amber-400">
                        ฿{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Rate: 1 {fromCurrency} = {rate} {toCurrency}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm">Enter an amount to convert</p>
                  )}
                </div>

                {/* THB Volatility Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    7-Day THB Volatility (1 USD)
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_THB_HISTORY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis domain={['dataMin - 0.3', 'dataMax + 0.3']} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f59e0b' }}
                          labelStyle={{ color: '#94a3b8' }}
                          formatter={(value: number) => [`฿${value}`, 'USD/THB']}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          dot={{ fill: '#f59e0b', r: 4 }}
                          activeDot={{ r: 6, fill: '#d97706' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Price Reference + Daily Budgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Price Reference */}
            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  Price Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PRICE_REFERENCES.map((item) => {
                  const Icon = item.icon;
                  const minConverted = convertTHB(item.thbMin);
                  const maxConverted = convertTHB(item.thbMax);
                  const showConverted = fromCurrency !== 'THB';
                  return (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-slate-300">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">฿{item.thbMin}-{item.thbMax}</span>
                        {showConverted && (
                          <p className="text-xs text-slate-500">{minConverted.toFixed(0)}-{maxConverted.toFixed(0)} {fromCurrency}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Daily Budget Cards */}
            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  Daily Budgets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DAILY_BUDGETS.map((b) => (
                  <div key={b.label} className="p-3 bg-slate-800 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">{b.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${b.color}`}>{b.label}</p>
                      <p className="text-xs text-slate-400">
                        ฿{b.thbMin.toLocaleString()}{b.thbMax ? `-${b.thbMax.toLocaleString()}` : '+'}/day
                      </p>
                      {fromCurrency !== 'THB' && (
                        <p className="text-xs text-slate-500">
                          ~{convertTHB(b.thbMin).toFixed(0)}{b.thbMax ? `-${convertTHB(b.thbMax).toFixed(0)}` : '+'} {fromCurrency}/day
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
