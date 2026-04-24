export interface KnowledgeEntry {
  category: string;
  keywords: string[];
  answer: string;
}

export const THAILAND_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    category: "Cost & Budget",
    keywords: ["cost", "budget", "price", "how much", "expensive", "cheap", "fare", "money"],
    answer: "Thailand is highly affordable. \n- **Solo Budget (Backpacker):** 1,000 - 1,500 THB/day.\n- **Mid-range (Couple/Family):** 2,500 - 5,000 THB/day.\n- **Luxury:** 7,000+ THB/day.\n*Note: 1 USD ≈ 36 THB. Street food is 40-70 THB, internal flights are 800-2,000 THB.*"
  },
  {
    category: "Visa & Entry (2024/2025 Updates)",
    keywords: ["visa", "entry", "passport", "arrival", "document", "stay", "extension", "bangladesh", "india", "eta", "60 days"],
    answer: "- **New for 2024:** 60-day visa exemption for many countries (including India, China, UK, USA, etc.) is now standard.\n- **DTV (Destination Thailand Visa):** New for 2024. For digital nomads and 'soft power' participants (Muay Thai, cooking). 5-year multi-entry, 180 days per stay.\n- **ETA:** Expected to be launched in late 2024/2025 for all visa-exempt travelers (online pre-registration).\n- **Bangladesh Tourists:** Still typically require a sticker visa from the embassy/VFS Global, but check current status as e-visa options are expanding."
  },
  {
    category: "Transport",
    keywords: ["transport", "taxi", "grab", "bts", "mrt", "train", "bus", "flight", "boat", "ferry", "how to go"],
    answer: "- **Bangkok:** Use BTS (Skytrain) and MRT (Subway) to avoid traffic. Taxis must use meters (start at 35 THB).\n- **Long Distance:** Low-cost carriers like AirAsia/Nok Air are best. Overnight trains (1st/2nd class) are great for Bangkok-Chiang Mai.\n- **Islands:** Ferries and Speedboats operate from Phuket, Krabi, and Surat Thani. \n- **Apps:** Use 'Grab' or 'Bolt' for transparent pricing."
  },
  {
    category: "Hotels & Accommodation",
    keywords: ["hotel", "hostel", "stay", "resort", "booking", "where to sleep", "accommodation"],
    answer: "- **Bangkok:** Sukhumvit (Nightlife), Silom (Business), or Old Town (Culture).\n- **Phuket:** Patong (Party), Kata/Karon (Family), Bang Tao (Luxury).\n- **Chiang Mai:** Old City (Temples) or Nimman (Modern/Digital Nomad).\n*Prices: Hostels (300-600 THB), Mid-range (1,200-2,500 THB), 5-Star (4,000+ THB).*"
  },
  {
    category: "Scams & Safety",
    keywords: ["scam", "safe", "danger", "police", "trap", "avoid", "warning"],
    answer: "- **The 'Grand Palace is Closed' Scam:** Touts will tell you it's closed and try to take you to a 'special' tailor or jewel shop. It's almost always open.\n- **Jet Ski Scam:** Fake damage claims in Pattaya/Phuket. Only rent from reputable spots.\n- **Fast Meters:** Some taxis have modified meters. Use Grab to check the 'real' price.\n- **Emergency:** Dial 1155 for Tourist Police (English speaking)."
  },
  {
    category: "Food",
    keywords: ["food", "eat", "restaurant", "street food", "halal", "vegetarian", "pad thai"],
    answer: "- **Must Try:** Pad Thai, Som Tum (Papaya Salad), Tom Yum Goong, Mango Sticky Rice.\n- **Street Food:** safe in 99% of cases if busy. Look for 'Shell Shuan Shim' logo (green bowl).\n- **Water:** Do not drink tap water. Bottled water is cheap (7-15 THB)."
  },
  {
    category: "Regions",
    keywords: ["phuket", "bangkok", "chiang mai", "krabi", "pattaya", "samui"],
    answer: "- **Bangkok:** Capital, shopping, temples.\n- **Phuket/Krabi:** West coast beaches, limestone cliffs, island hopping.\n- **Chiang Mai/Rai:** North, mountains, temples, elephants, cooler weather.\n- **Pattaya:** Closest beach to Bangkok, nightlife, family parks."
  },
  {
    category: "Connectivity & Internet",
    keywords: ["sim card", "internet", "wifi", "ais", "dtac", "true", "roaming", "esim"],
    answer: "- **SIM Cards:** Easily available at Suvarnabhumi Airport or any 7-Eleven. \n- **Top Providers:** AIS (best coverage), DTAC, and TrueMove H.\n- **Cost:** Unlimited data plans for 7-15 days cost around 300-600 THB.\n- **Tourist SIM:** Often comes with free data for apps like Grab, WhatsApp, and Facebook."
  },
  {
    category: "Shopping & Markets",
    keywords: ["shopping", "market", "mall", "siam", "mbk", "chatuchak", "night market"],
    answer: "- **Bangkok Malls:** Siam Paragon (Luxury), MBK (Electronics/Cheap), CentralWorld (Variety).\n- **Chatuchak (Weekend Market):** Massive market, open Sat/Sun, great for souvenirs and clothes.\n- **Night Markets:** Jodd Fairs, Srinakarin Train Market, and Asiatique are popular.\n- **Vat Refund:** Look for 'VAT Refund for Tourists' signs. You can claim 7% back at the airport if you spend over 2,000 THB per shop."
  },
  {
    category: "Etiquette & Culture",
    keywords: ["culture", "respect", "temple", "clothing", "dress", "monks", "head", "feet"],
    answer: "- **Temples (Wat):** Dress respectfully. Shoulders and knees must be covered. No shorts or tank tops.\n- **The King:** Deep respect for the Monarchy is mandatory. Do not speak ill of the Royal Family.\n- **Head & Feet:** The head is sacred (don't touch people's heads); feet are lowly (don't point them at people or Buddha statues).\n- **Wai:** The traditional greeting (palms together like a prayer)."
  },
  {
    category: "Attractions",
    keywords: ["attraction", "visit", "see", "place", "grand palace", "wat arun", "wat phra kaew", "elephant", "sanctuary", "river", "market"],
    answer: "- **Bangkok:** Grand Palace & Wat Phra Kaew (Emerald Buddha), Wat Arun (Temple of Dawn), Wat Pho (Reclining Buddha).\n- **Chiang Mai:** Doi Suthep, Night Bazaar, Ethical Elephant Sanctuaries (Check for 'No Riding' policy).\n- **Phuket:** Big Buddha, Old Town, Phi Phi Island (via speedboat).\n- **Ayutthaya:** UNESCO World Heritage site, ancient city ruins (80km from Bangkok)."
  },
  {
    category: "Weather & Seasons",
    keywords: ["weather", "season", "rain", "hot", "cool", "when to go", "best time", "month"],
    answer: "- **Cool Season (Nov - Feb):** Best time to visit. Dry and pleasant (25-30°C).\n- **Hot Season (Mar - May):** Very hot (35-40°C), great for Songkran (Water Festival) in April.\n- **Rainy Season (Jun - Oct):** Short heavy showers, usually in the afternoon. Hotel prices are 30-50% cheaper."
  },
  {
    category: "Nightlife & Sky Bars",
    keywords: ["nightlife", "bar", "club", "party", "drink", "beer", "khao san", "sky bar", "rooftop"],
    answer: "- **Bangkok Sky Bars:** Lebua (Sky Bar), Tichuca (Octopus-like lights), Octave.\n- **Party Zones:** Khao San Road (Backpackers), Sukhumvit Soi 11 (High-end), RCA (Clubs).\n- **Islands:** Full Moon Party (Koh Phangan - check dates), Patong Bangla Road (Phuket).\n- **Rules:** Bars close at 2:00 AM. 20+ age limit is strictly enforced."
  },
  {
    category: "Medical & Insurance",
    keywords: ["medical", "hospital", "doctor", "emergency", "insurance", "sick", "dentist", "medicine", "pharmacy"],
    answer: "- **Quality:** Hospitals like Bumrungrad and Samitivej are world-class.\n- **Insurance:** Highy recommended. A simple motorbike accident can cost 100k+ THB.\n- **Pharmacy:** Pharmacies (Boots, Watsons, or local) are everywhere. Most meds don't need prescriptions.\n- **Emergency:** 191 (General), 1155 (Tourist Police), 1669 (Ambulance)."
  },
  {
    category: "Money & Tipping",
    keywords: ["money", "cash", "atm", "tipping", "tip", "exchange", "currency", "card"],
    answer: "- **ATM Fee:** Almost all ATMs charge 220 THB per withdrawal for foreign cards. Withdraw large amounts to save on fees.\n- **Tipping:** Not mandatory but expected in tourist areas. 10-20 THB for porters, 10% in upscale restaurants, round up for taxis.\n- **Cash is King:** While malls take cards, markets and street food are cash only."
  },
  {
    category: "Family & Business Travel",
    keywords: ["family", "kid", "child", "business", "work", "coworking", "corporate", "team", "meeting"],
    answer: "- **Family:** Thailand is incredibly kid-friendly. Hotels often have 'Kids Clubs'. Use Grab Family for car seats.\n- **Coworking:** Great hubs in Bangkok (The Hive) and Chiang Mai (Yellow, Punspace).\n- **Business Etiquette:** Dress conservatively. Punctuality is appreciated but 'Thai Time' (slight delay) is common. Handing over a business card with two hands is a sign of respect."
  }
];

export function findLocalAnswer(message: string): string | null {
  const msg = message.toLowerCase();
  const matchedEntries = THAILAND_KNOWLEDGE_BASE.filter(entry => 
    entry.keywords.some(keyword => msg.includes(keyword))
  );

  if (matchedEntries.length === 0) return null;

  let combinedResponse = `### 🧠 REvuBOT On-Device Knowledge Core\n\n`;
  matchedEntries.forEach(entry => {
    combinedResponse += `**Category: ${entry.category}**\n${entry.answer}\n\n`;
  });
  
  combinedResponse += `\n*(Note: I am providing this from my high-fidelity local database. My neural logic is currently optimizing or offline.)*`;
  
  return combinedResponse;
}
