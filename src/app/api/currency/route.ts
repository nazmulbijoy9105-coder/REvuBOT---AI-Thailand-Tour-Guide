import { NextRequest, NextResponse } from 'next/server';

const RATES: Record<string, number> = {
  USD: 35.0,
  EUR: 38.0,
  GBP: 44.5,
  AUD: 22.5,
  CAD: 25.5,
  INR: 0.42,
  BDT: 0.29,
  LKR: 0.11,
  SGD: 26.0,
  MYR: 7.8,
  JPY: 0.23,
  CNY: 4.8,
  KRW: 0.024,
  NZD: 20.5,
  THB: 1,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = parseFloat(searchParams.get('amount') || '1');
  const from = (searchParams.get('from') || 'USD').toUpperCase();
  const to = (searchParams.get('to') || 'THB').toUpperCase();

  const fromRate = RATES[from];
  const toRate = RATES[to];

  if (!fromRate || !toRate) {
    return NextResponse.json(
      { error: `Unsupported currency. Supported: ${Object.keys(RATES).join(', ')}` },
      { status: 400 }
    );
  }

  // Convert: amount in FROM -> THB -> TO
  const inTHB = amount * fromRate;
  const result = inTHB / toRate;

  return NextResponse.json({
    amount,
    from,
    to,
    result: Math.round(result * 100) / 100,
    rate: Math.round((fromRate / toRate) * 10000) / 10000,
    disclaimer: 'Approximate rates. Check SuperRich or your bank for real-time rates.',
  });
}
