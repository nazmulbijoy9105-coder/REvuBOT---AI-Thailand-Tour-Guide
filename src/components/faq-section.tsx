'use client';

import { motion } from 'framer-motion';
import { Shield, Plane, Scale, Hotel, Heart, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  visa: [
    { q: '60-Day Visa Exemption (2026)', a: 'Travelers from 93 countries (including India, USA, UK, Australia, Bangladesh) can enter for 60 days visa-free for tourism or short-term business. This can be extended by 30 days once per entry at any immigration office for 1,900 THB.' },
    { q: 'Mandatory Digital Arrival Card (TDAC)', a: 'Starting May 1, 2025, EVERY traveler arriving by air, land, or sea must complete the Thailand Digital Arrival Card (TDAC) online within 3 days BEFORE arrival. Failure to show the QR code will result in entry denial.' },
    { q: 'DTV Visa for Digital Nomads', a: 'The Destination Thailand Visa (DTV) allows a 5-year multiple-entry stay. Each entry is valid for 180 days (extendable by another 180). Perfect for remote workers, muay thai students, or medical patients.' },
    { q: 'Bangladesh Tourists', a: 'Bangladeshi passport holders typically require a sticker visa from the embassy/VFS Global. Check current status as e-visa options are expanding. The process takes 5-7 working days.' },
  ],
  transport: [
    { q: 'Smart Transport: Grab & Bolt', a: 'Avoid unmetered taxis. Use Grab (highest safety) or Bolt (cheapest) for all local commutes. For inter-city travel, low-cost carriers like AirAsia/Nok Air are best.' },
    { q: 'BTS Skytrain & MRT', a: 'Use BTS (Skytrain) and MRT (Subway) in Bangkok to avoid traffic. Taxis must use meters (start at 35 THB). BTS runs 6AM-midnight, fares 16-59 THB.' },
    { q: 'Island Ferries', a: 'Ferries and speedboats operate from Phuket, Krabi, and Surat Thani to islands. Book through 12GoAsia or direct at pier. Speedboat: 1,500-2,000 THB, Ferry: 500-1,000 THB.' },
  ],
  safety: [
    { q: 'Strict Scooter & Helmet Laws', a: 'In 2026, police have intensified enforcement. You MUST wear a helmet AND a shirt while riding. Fines for riding shirtless or without a helmet are immediate (500-2,000 THB). Never leave passport as deposit.' },
    { q: 'Alcohol Sales Bans', a: 'Alcohol cannot be sold from 2:00 PM to 5:00 PM daily. This is strictly enforced in 7-Eleven and malls. Sales are also banned on religious holidays and election days.' },
    { q: 'Vaping & Monarchy Respect', a: 'Vaping remains ILLEGAL with severe fines up to 30,000 THB or jail time. Respecting the Monarchy is mandatory; never deface money or insult royal imagery. This includes stepping on coins.' },
    { q: 'Common Scams to Avoid', a: '"Grand Palace is Closed" scam (it\'s NOT closed). Jet ski damage scams in Phuket/Pattaya. The 20 Baht Tuk-Tuk tour is a trap to take you to tailor shops. Always use Grab/Bolt for transparent pricing.' },
  ],
  hotels: [
    { q: 'Verified Safety Standards', a: 'Always look for SHA+ certifications on Booking.com and Agoda properties. Bangkok: Sukhumvit for nightlife, Riverside for luxury, Khao San for backpackers. Chiang Mai: Old City for temples, Nimman for modern vibes.' },
    { q: 'Booking Tips', a: 'Book beachfront resorts 3 months in advance for peak season (Dec-Feb). Use Agoda for best rates in Thailand. Always check for free cancellation. Most hotels require credit card guarantee.' },
  ],
  culture: [
    { q: 'Temple Protocols (Dress Code)', a: "Shoulders and knees MUST be covered. Carry a sarong if wearing shorts. Socks are permitted, but shoes must be left outside. Do not point your feet toward Buddha images." },
    { q: 'Social Etiquette', a: "Never touch a Thai person's head (it's sacred). Don't point feet at people or religious objects. The Wai greeting (palms together) is traditional. Women should not touch monks directly." },
    { q: 'Thai Language Basics', a: "Sawasdee (ka/krub) = Hello. Khop Khun (ka/krub) = Thank you. Hong Nam? = Where's the bathroom? Mai Phet = Not spicy. Add 'ka' (women) or 'krub' (men) for politeness." },
  ],
  food: [
    { q: 'Dining & Street Food Safety', a: "Look for high-turnover stalls where locals are queuing - that's your quality indicator. Never drink tap water; only use bottled or filtered. Ice in established restaurants is safe (tube ice)." },
    { q: 'Must-Try Dishes', a: "Pad Thai (40-80 THB street), Tom Yum Goong, Som Tum (Papaya Salad), Mango Sticky Rice, Khao Soi (Northern curry noodle), Massaman Curry. 'Phet Nid Noi' means 'a little spicy' (still spicy for most!)." },
    { q: 'Halal & Vegetarian Options', a: "Halal food easily found in Bangkok's Soi Arab and Southern provinces. Vegetarian: Look for yellow/red flags with Chinese characters during Vegetarian Festival (Oct). Most places can make dishes without meat on request." },
  ],
};

const CATEGORIES = [
  { key: 'visa', label: 'Visa & Entry', icon: Plane },
  { key: 'transport', label: 'Transport', icon: Plane },
  { key: 'safety', label: 'Laws & Scams', icon: Scale },
  { key: 'hotels', label: 'Hotels', icon: Hotel },
  { key: 'culture', label: 'Culture', icon: Heart },
  { key: 'food', label: 'Food', icon: UtensilsCrossed },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 px-4 bg-white">
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
            <Shield className="w-3 h-3 mr-1" />
            FAQ & Safety
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ESSENTIAL <span className="text-amber-500">INTELLIGENCE</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider">Critical Knowledge for Thailand Operations</p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs defaultValue="visa" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 p-1.5 rounded-xl">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger
                    key={cat.key}
                    value={cat.key}
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {cat.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.key} value={cat.key}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-slate-200 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {FAQ_DATA[cat.key].map((faq, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`${cat.key}-${idx}`}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 transition-colors text-left">
                            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-black shrink-0">
                                {idx + 1}
                              </span>
                              {faq.q}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <p className="text-slate-600 text-sm leading-relaxed pl-8">
                              {faq.a}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
