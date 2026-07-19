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
    answer: "- **SIM Cards:** Easily available at Suvarnabhumi Airport or any 7-Eleven. Top providers: AIS, DTAC, and TrueMove H.\n- **Wi-Fi:** Free common in hotels/cafes, but speeds vary.\n- **Cost:** Unlimited data plans for 7-15 days cost around 300-600 THB."
  },
  {
    category: "Culture & Etiquette 2026",
    keywords: ["culture", "respect", "temple", "clothing", "dress", "monks", "head", "feet", "shoes off", "wai"],
    answer: "- **Temple Dress Code:** Shoulders and knees MUST be covered. Carry a sarong if wearing shorts.\n- **Shoes Off:** Always remove shoes when entering homes, temples, and some small businesses.\n- **Wai Greeting:** Palms together with a slight bow is the traditional greeting.\n- **Social Taboos:** Never touch a Thai person's head; never point your feet at people or religious objects."
  },
  {
    category: "Health & Safety (2026)",
    keywords: ["medical", "safety", "emergency", "police", "scam", "hospital", "water", "vaccine", "insurance"],
    answer: "- **Water Safety:** NEVER drink tap water. Use bottled or filtered water even for brushing if sensitive.\n- **Vaccines:** Consider standard travel vaccines; carry comprehensive travel insurance.\n- **Emergency Numbers:** 1155 (Tourist Police - English support), 191 (General Police).\n- **Scam Watch:** Beware of 'Jet Ski Damage' scams, 'Overpriced Gems', and 'Closed Palace' touts. Use only trusted vendors."
  },
  {
    category: "Language Basics (REvuBOT Lite)",
    keywords: ["language", "phrase", "thai", "hello", "thank you", "bathroom"],
    answer: "- **Sawasdee (ka/krub):** Hello\n- **Khop Khun (ka/krub):** Thank you\n- **Hong Nam? (ka/krub):** Where’s the bathroom?\n- **Mai Phet:** Not spicy\n*Add 'ka' (women) or 'krub' (men) for politeness.*"
  },
  {
    category: "Sustainable Travel",
    keywords: ["sustainable", "eco", "plastic", "wildlife", "local"],
    answer: "- **Eco-Tourism:** Avoid single-use plastics and support local operators.\n- **Wildlife:** Do NOT support elephant riding or circus tricks. Visit ethical sanctuaries only.\n- **Impact:** Support local artisans and family-run businesses for a positive footprint."
  },
  {
    category: "Electricity & Utilities",
    keywords: ["electricity", "plug", "adapter", "voltage", "220v"],
    answer: "- **Voltage:** 220V standard.\n- **Plugs:** Types A, B, and C are common. A universal adapter is highly recommended."
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
    category: "Attractions & Landmarks",
    keywords: ["attraction", "visit", "see", "place", "grand palace", "wat arun", "wat phra kaew", "wat pho", "emerald buddha", "wat saket", "golden mount"],
    answer: "- **Bangkok:** Grand Palace (Must see), Wat Arun (Stunning at sunset), Wat Pho (Huge reclining Buddha), Wat Saket (Panoramic city views).\n- **Chiang Mai:** Doi Suthep (Mountain temple), Wat Chedi Luang, Sunday Night Market.\n- **Ayutthaya:** Ancient capital ruins, Buddha head in tree roots (Wat Mahathat).\n- **Kanchanaburi:** Death Railway, bridge over River Kwai, Erawan Waterfalls (7 tiers)."
  },
  {
    category: "Islands & Beaches",
    keywords: ["island", "beach", "phuket", "krabi", "phi phi", "samui", "koh tao", "koh phangan", "koh lipe", "diving", "snorkeling"],
    answer: "- **Phi Phi Islands:** Famous from 'The Beach', Maya Bay, turquoise waters.\n- **Phuket:** Largest island, Patong (Nightlife), Kata Noi (Quiet), Old Town (History).\n- **Koh Samui:** Upscale resorts, coconut groves, Ang Thong Marine Park.\n- **Koh Tao:** World-renowned for affordable scuba diving certification.\n- **Koh Phangan:** Full Moon Party (Haad Rin Beach), but also secret calm bays in the north.\n- **Koh Lipe:** 'The Maldives of Thailand', crystal clear water, tiny walkable island."
  },
  {
    category: "Festivals & Events",
    keywords: ["festival", "event", "songkran", "loy krathong", "party", "celebration", "new year", "lantern"],
    answer: "- **Songkran (April 13-15):** Thai New Year. Giant water fight nationwide. Respect monks/elders but expect to get soaked!\n- **Loy Krathong (November):** Floating baskets with candles on rivers to thank the water goddess. Most beautiful in Chiang Mai.\n- **Yi Peng (November):** Lantern festival in Chiang Mai. Thousands of lanterns released into the sky (often same day as Loy Krathong).\n- **Chinese New Year (Jan/Feb):** Huge celebrations in Bangkok's Chinatown (Yaowarat)."
  },
  {
    category: "Shopping & Malls",
    keywords: ["shopping", "market", "mall", "siam", "mbk", "chatuchak", "night market", "iconsiam", "emquatier"],
    answer: "- **Iconsiam:** Riverside luxury mall, features 'SookSiam' (indoor floating market/street food section).\n- **Siam Square/Paragon:** The heart of Bangkok shopping. High fashion to local designers.\n- **Chatuchak (Weekend Market):** 15,000+ stalls. Best for cheap clothes, home decor, and pets.\n- **MBK Center:** Go-to for electronics, phone repairs, and discount souvenirs."
  },
  {
    category: "Elephant Ethics",
    keywords: ["elephant", "sanctuary", "riding", "ethical", "save", "nature"],
    answer: "Thailand has moved towards 'Ethical Tourism'. \n- **Avoid:** Any place offering elephant riding, painting, or circus tricks.\n- **Choose:** 'Sanctuaries' where you observe or feed them. Elephant Nature Park (Chiang Mai) and Phuket Elephant Sanctuary are top-rated pioneers."
  },
  {
    category: "Etiquette & Culture",
    keywords: ["culture", "respect", "temple", "clothing", "dress", "monks", "head", "feet", "monarchy"],
    answer: "- **Temples:** No shoes inside. Cover shoulders/knees. Don't sit with feet pointing at Buddha.\n- **Monks:** Women should not touch monks or hand things directly. Place item on a cloth or have a man do it.\n- **Head & Feet:** Never touch a Thai person's head (it's the most sacred part). Don't use your feet to point or move objects.\n- **Lèse-majesté:** It is a crime to insult or deface images of the Royal Family (including money)."
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
    category: "Revenue & Partner Model",
    keywords: ["income", "revenue", "partner", "book", "commission", "booking.com", "agoda", "viator", "skyscanner", "premium"],
    answer: "- **Booking Partners:** REvuBOT earns commissions via our official partners: Booking.com (Hotels), Skyscanner (Flights), and Viator (Tours).\n- **Premium Service:** Advanced flight tracking and 1-on-1 human expert consultation available for 'Elite' members.\n- **B2B:** Local Thai businesses can sponsor 'Top Spot' visibility in our 'Attractions' recommendations."
  },
  {
    category: "Transportation",
    keywords: ["transport", "taxi", "grab", "bolt", "bts", "mrt", "train", "tuk tuk", "bus"],
    answer: "- **Bangkok:** Use BTS (Skytrain) and MRT (Subway) to avoid traffic. \n- **Apps:** Grab and Bolt are essential. Use 'Bolt' for the cheapest rides, 'Grab' for the best service.\n- **Taxis:** Always insist on the meter ('Meter, please'). If they refuse, get out and find another.\n- **Trains:** State Railway of Thailand (SRT) connects Bangkok to Chiang Mai and the South. Book '1st Class Sleeper' in advance."
  },
  {
    category: "Laws & Scams",
    keywords: ["law", "scam", "jail", "fine", "police", "vape", "royal", "drug", "closed", "meter"],
    answer: "- **Vaping:** ILLEGAL. Fines up to 30,000 THB or jail time. Do not bring them into the country.\n- **Lèse-majesté:** It is a high crime to insult the Monarchy. This includes stepping on coins or defacing images.\n- **Generic Scams:** 'The Grand Palace is closed' (it's not), the 20 Baht Tuk-Tuk tour (it's a trap to take you to tailor shops).\n- **Drugs:** While Cannabis is decriminalized, public smoking is restricted and 'stronger' drugs carry severe penalties including the death penalty."
  },
  {
    category: "Hotels & Stay",
    keywords: ["hotel", "stay", "resort", "hostel", "accommodation", "where to stay", "luxury"],
    answer: "- **Bangkok:** Sukhumvit (Nightlife), Riverside (Luxury), Siam (Shopping), Khao San (Backpackers).\n- **Chiang Mai:** Old City (Charms/History), Nimman (Hip/Modern).\n- **Islands:** Always book beachfront resorts through our integrated 'RevuBot Deals' via Agoda for verified safety standards."
  },
  {
    category: "Food & Dining",
    keywords: ["food", "eat", "street food", "restaurant", "michelin", "halal", "vegetarian", "spicy"],
    answer: "- **Safe Street Food:** Look for high-turnover stalls where locals are queuing.\n- **Water:** NEVER drink tap water. Use ice only in established restaurants.\n- **Halal:** Easily found in Bangkok's Soi Arab and Southern Thailand provinces (Krabi, Phuket).\n- **Spicy:** 'Phet Nid Noi' means 'A little bit spicy' (which is still spicy for most tourists)."
  },
  {
    category: "Solo Travel Template",
    keywords: ["solo", "single", "backpacker", "alone"],
    answer: "**Segment Focus:** Social discovery, safety, and budget efficiency.\n- **Recommended Route:** Bangkok -> Chiang Mai -> Koh Tao.\n- **Lodging:** Upscale social hostels (e.g., Mad Monkey, Lub d) - 500-900 THB/night.\n- **Transport:** RTC City Bus in Chiang Mai, Sleeper Trains (2nd Class) - 900 THB.\n- **AI Prompt:** 'Create a 10-day solo safety-first itinerary starting in Bangkok with 3 budget social hostel recommendations.'\n- **Safety:** Registered 'Grab' motorbike taxis for fast transport; avoid walking alone in unlit Sois (alleys)."
  },
  {
    category: "Couple & Honeymoon Template",
    keywords: ["couple", "honeymoon", "romantic", "anniversary", "date"],
    answer: "**Segment Focus:** Privacy, aesthetics, and curated luxury.\n- **Recommended Route:** Bangkok -> Koh Samui -> Krabi.\n- **Lodging:** Private Pool Villas (e.g., Sala Samui, Rayavadee) - 8,000-25,000 THB/night.\n- **Dining:** Sunset dinner cruises on the Chao Phraya; clifftop dining in Railay.\n- **AI Prompt:** 'Draft a 7-day romantic itinerary for Koh Samui featuring 3 sunset dinner spots and a private yacht charter.'\n- **Details:** Look for 'Adults Only' resorts for maximum tranquility."
  },
  {
    category: "Family & Group Template",
    keywords: ["family", "group", "kids", "children", "multi-gen", "minivan"],
    answer: "**Segment Focus:** Logistics, kid-friendly activities, and shared space.\n- **Recommended Route:** Phuket -> Khao Sok -> Hua Hin.\n- **Lodging:** 3-bedroom serviced apartments or multi-room resorts - 4,000-10,000 THB/night.\n- **Activities:** Water parks (Andamanda Phuket), Ethical Elephant Nature Park.\n- **AI Prompt:** 'Plan a 5-day Phuket family trip for 6 people including a private minivan rental and 3 kid-friendly beaches.'\n- **Transport:** Private Van (10-seater) - 2,500-3,500 THB/day including driver."
  },
  {
    category: "Corporate & Team Building Template",
    keywords: ["corporate", "team building", "retreat", "company", "staff", "offsite"],
    answer: "**Segment Focus:** Collaboration, high-capacity venues, and logistics.\n- **Recommended Route:** Bangkok (Riverside) or Pattaya (Luxury Resorts).\n- **Venues:** Avani+ Riverside, Royal Cliff Pattaya.\n- **Work:** High-speed boardroom rentals, Tichuca rooftop for networking.\n- **AI Prompt:** 'Create a 3-day corporate offsite plan in Bangkok for 20 executives with meeting room logistics and 2 team-building dinners.'\n- **Data:** Average conference package: 1,800 - 3,500 THB per person/day."
  },
  {
    category: "Business & Efficiency Template",
    keywords: ["business trip", "meeting", "conference", "work trip", "executive", "airport lounge"],
    answer: "**Segment Focus:** Punctuality, connectivity, and premium comfort.\n- **Recommended Route:** Sukhumvit/Silom (Bangkok Central Business District).\n- **Lodging:** Standard Chartered/Business Hotels (JW Marriott, Okura) - 5,000-9,000 THB/night.\n- **Transport:** BTS Rabbit Card for traffic bypass; Airport Limousine 서비스.\n- **AI Prompt:** 'Design a 2-day business efficient schedule in Silom with 3 high-end networking cafes and airport fast-track info.'\n- **Perk:** Utilize Suvarnabhumi Miracle Lounges (1,200 THB/entry) for work between flights."
  },
  {
    category: "2025/2026 Vital Updates",
    keywords: ["tdac", "digital arrival card", "2025", "2026", "mandatory", "arrival rules"],
    answer: "- **Mandatory TDAC:** From May 1, 2025, all travelers MUST complete the Thailand Digital Arrival Card online 3 days before arrival to avoid entry denial.\n- **Alcohol Ban:** Strict sales prohibition from 2:00 PM – 5:00 PM daily.\n- **Scooter Rules:** Helmet and shirt mandatory. Riding topless or without a helmet results in immediate fines.\n- **Lèse-majesté:** Insulting the monarchy is a serious crime with long prison sentences."
  },
  {
    category: "Visa Options (2026)",
    keywords: ["visa duration", "single entry", "multiple entry", "visa on arrival", "visa exemption", "dtv", "elite"],
    answer: "- **Single-Entry Tourist Visa:** 60 days, extendable by 30 days. Valid for 3 months from issue.\n- **Multiple-Entry Tourist Visa:** 6-month validity, 60 days per entry.\n- **Visa Exemption:** 93 countries get 60 days on arrival (extendable by 30).\n- **Visa on Arrival (VoA):** 31 countries, 15-day stay. Fee must be paid in CASH (THB).\n- **DTV Visa:** 5 years, multiple entry, 180 days per stay for remote workers/digital nomads.\n- **Thai Elite:** Long-term stay options for 5, 10, or 20 years with premium perks."
  },
  {
    category: "Taxes & VAT Refund",
    keywords: ["tax", "vat", "refund", "foreigner tax", "tourist tax", "300 baht"],
    answer: "- **VAT (7%):** Included in consumer goods. Tourists can claim a refund on purchases over 2,000 THB at participating stores.\n- **Tourist Tax (2025):** 300 THB for air arrivals, 150 THB for land/sea. Funds used for infrastructure and over-tourism management.\n- **Personal Income Tax:** Foreigners staying 180+ days are considered tax residents."
  },
  {
    category: "Top Destinations (2026)",
    keywords: ["destinations", "bangkok", "chiang mai", "phuket", "pattaya", "moo deng", "chon buri"],
    answer: "- **Bangkok:** The capital of culture, nightlife, and shopping (Iconsiam, Grand Palace).\n- **Chiang Mai:** Northern mountains and ethical elephant sanctuaries.\n- **Phuket/Krabi:** Beach paradises and island hopping (Phi Phi, Maya Bay).\n- **Moo Deng Experience:** Visit the viral hippo at Khao Kheow Open Zoo in Chonburi (Near Chon Buri/Pattaya).\n- **Ubon Ratchathani:** Famed for its Candle Festival and nature."
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
