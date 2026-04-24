'use client';

export function TickerBar() {
  const alerts = "🇹🇭 60-DAY VISA-FREE for 93 countries • TDAC digital arrival card required • 🏍️ Helmet law enforced • 🚫 No vaping - heavy fines • 👑 Respect the Monarchy • 🍺 Alcohol ban 14:00-17:00 • 🦛 Moo Deng crowd warnings at Khao Kheow • 🔒 Carry passport copy at all times";

  return (
    <div className="w-full bg-amber-500 overflow-hidden py-1.5 relative z-50">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-xs font-bold uppercase text-slate-900 tracking-wide mx-4">
          {alerts}
        </span>
        <span className="text-xs font-bold uppercase text-slate-900 tracking-wide mx-4">
          {alerts}
        </span>
        <span className="text-xs font-bold uppercase text-slate-900 tracking-wide mx-4">
          {alerts}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
      `}</style>
    </div>
  );
}
