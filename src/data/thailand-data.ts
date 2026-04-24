export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  highlights: string[];
  bestTime: string;
  budget: string;
  rating: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  rating: number;
  image: string;
  amenities: string[];
  type: string;
  bookingUrl: string;
}

export interface Beach {
  id: string;
  name: string;
  island: string;
  description: string;
  image: string;
  activities: string[];
  waterQuality: string;
  crowdLevel: string;
  bestTime: string;
}

export interface EarningWay {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  potential: string;
  details: string[];
}

export const destinations: Destination[] = [
  {
    id: "bangkok",
    name: "Bangkok",
    region: "Central Thailand",
    description: "The vibrant capital city, a perfect blend of ancient temples and modern skyscrapers. Street food paradise, shopping mecca, and cultural hub all in one.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
    highlights: ["Grand Palace", "Wat Arun", "Chatuchak Market", "Khao San Road", "Floating Markets", "Chinatown"],
    bestTime: "November - February",
    budget: "$30-80/day",
    rating: 4.7
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    region: "Northern Thailand",
    description: "The rose of the North, known for its ancient walled city, stunning mountain temples, vibrant night markets, and as a gateway to hill tribe villages.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    highlights: ["Doi Suthep", "Sunday Night Market", "Old City Temples", "Elephant Sanctuaries", "Thai Cooking Classes", "Night Bazaar"],
    bestTime: "November - February",
    budget: "$20-60/day",
    rating: 4.8
  },
  {
    id: "phuket",
    name: "Phuket",
    region: "Southern Thailand",
    description: "Thailand's largest island offering pristine beaches, world-class diving, vibrant nightlife in Patong, and luxurious resorts nestled in tropical hills.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80",
    highlights: ["Patong Beach", "Phi Phi Islands", "Old Phuket Town", "Big Buddha", "Phang Nga Bay", "Simon Cabaret"],
    bestTime: "November - April",
    budget: "$40-120/day",
    rating: 4.5
  },
  {
    id: "krabi",
    name: "Krabi",
    region: "Southern Thailand",
    description: "Dramatic limestone cliffs, turquoise waters, and over 200 islands. A rock climber's paradise and gateway to Railay Beach and the Hong Islands.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    highlights: ["Railay Beach", "Four Islands Tour", "Tiger Cave Temple", "Ao Nang", "Emerald Pool", "Rock Climbing"],
    bestTime: "November - April",
    budget: "$25-70/day",
    rating: 4.6
  },
  {
    id: "koh-samui",
    name: "Koh Samui",
    region: "Gulf of Thailand",
    description: "Palm-fringed beaches, coconut groves, and luxury resorts. The island balances serene wellness retreats with lively fisherman villages and beach clubs.",
    image: "https://images.unsplash.com/photo-1594424135215-83ab1c4e66c2?w=600&q=80",
    highlights: ["Chaweng Beach", "Fisherman's Village", "Ang Thong Marine Park", "Wat Plai Laem", "Namuang Waterfall", "Beach Clubs"],
    bestTime: "December - April",
    budget: "$35-100/day",
    rating: 4.5
  },
  {
    id: "pattaya",
    name: "Pattaya",
    region: "Eastern Thailand",
    description: "A buzzing beach city known for its vibrant nightlife, water sports, and family attractions. Just 2 hours from Bangkok, it offers something for everyone.",
    image: "https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&q=80",
    highlights: ["Walking Street", "Nong Nooch Garden", "Sanctuary of Truth", "Coral Island", "Water Parks", "Floating Market"],
    bestTime: "November - February",
    budget: "$25-70/day",
    rating: 4.0
  },
  {
    id: "ayutthaya",
    name: "Ayutthaya",
    region: "Central Thailand",
    description: "UNESCO World Heritage Site featuring magnificent ruins of the ancient Siamese kingdom. A day trip from Bangkok into Thailand's glorious past.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
    highlights: ["Wat Mahathat", "Wat Chaiwatthanaram", "Ayutthaya Historical Park", "River Cruise", "Elephant Camp", "Night Market"],
    bestTime: "November - February",
    budget: "$15-40/day",
    rating: 4.4
  },
  {
    id: "koh-phi-phi",
    name: "Koh Phi Phi",
    region: "Southern Thailand",
    description: "Postcard-perfect twin islands with crystal-clear waters, made famous by 'The Beach'. Ultimate island paradise for party lovers and snorkelers alike.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    highlights: ["Maya Bay", "Monkey Beach", "Viewpoint Hike", "Snorkeling Tours", "Beach Parties", "Bioluminescent Plankton"],
    bestTime: "November - April",
    budget: "$30-80/day",
    rating: 4.3
  },
  {
    id: "kanchanaburi",
    name: "Kanchanaburi",
    region: "Western Thailand",
    description: "Home to the Bridge over the River Kwai, stunning Erawan waterfalls, and WWII history. A nature lover's escape with jungle treks and river floats.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    highlights: ["Bridge Over River Kwai", "Erawan Falls", "Hellfire Pass", "Tiger Temple Area", "River Rafting", "Elephant World"],
    bestTime: "November - February",
    budget: "$15-45/day",
    rating: 4.3
  },
  {
    id: "koh-tao",
    name: "Koh Tao",
    region: "Gulf of Thailand",
    description: "The diving mecca of Southeast Asia. Get certified at unbeatable prices, snorkel with sharks, and enjoy laid-back island vibes.",
    image: "https://images.unsplash.com/photo-1594424135215-83ab1c4e66c2?w=600&q=80",
    highlights: ["Diving Certification", "Shark Bay", "Freedom Beach", "John Suwan Viewpoint", "Night Diving", "Pub Crawl"],
    bestTime: "March - September",
    budget: "$20-55/day",
    rating: 4.5
  },
  {
    id: "islands-surat",
    name: "Koh Phangan",
    region: "Gulf of Thailand",
    description: "Famous for the legendary Full Moon Party, but also home to pristine beaches, yoga retreats, and lush jungle waterfalls for the mindful traveler.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80",
    highlights: ["Full Moon Party", "Haad Rin", "Thong Nai Pan", "Yoga Retreats", "Waterfall Hikes", "Boat Parties"],
    bestTime: "December - April",
    budget: "$20-60/day",
    rating: 4.3
  },
  {
    id: "pai",
    name: "Pai",
    region: "Northern Thailand",
    description: "A bohemian mountain town with hot springs, waterfalls, and canyon views. A backpacker haven with a creative, free-spirited atmosphere.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    highlights: ["Pai Canyon", "Hot Springs", "White Buddha", "Walking Street", "Waterfalls", "Cave Lodging"],
    bestTime: "November - March",
    budget: "$10-35/day",
    rating: 4.6
  }
];

export const hotels: Hotel[] = [
  // Bangkok Hotels
  {
    id: "mandarin-bangkok",
    name: "Mandarin Hotel Bangkok",
    location: "Bangkok - Riverside",
    priceRange: "$150-300/night",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Pool", "Spa", "River View", "Restaurant", "Gym", "Free WiFi"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  {
    id: "lub-d-bangkok",
    name: "Lub d Bangkok Silom",
    location: "Bangkok - Silom",
    priceRange: "$15-40/night",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    amenities: ["Co-work Space", "Cafe", "Rooftop", "Free WiFi", "Laundry", "Tours"],
    type: "Hostel",
    bookingUrl: "https://booking.com"
  },
  {
    id: "the-okura-bangkok",
    name: "The Okura Prestige",
    location: "Bangkok - Benjasiri Park",
    priceRange: "$180-400/night",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Pool", "Michelin Restaurant", "Spa", "Park View", "Butler", "Limo"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  // Chiang Mai Hotels
  {
    id: "dhara-dhevi",
    name: "Dhara Dhevi Chiang Mai",
    location: "Chiang Mai",
    priceRange: "$120-280/night",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Lanna Architecture", "Spa", "Rice Paddies", "Cooking Class", "Pool", "Cultural Tours"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  {
    id: "art-mai-gallery",
    name: "Art Mai Gallery Hotel",
    location: "Chiang Mai - Old City",
    priceRange: "$40-80/night",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    amenities: ["Art Gallery", "Rooftop Bar", "Free WiFi", "Walking Street Access", "Cafe", "Bike Rental"],
    type: "Boutique",
    bookingUrl: "https://booking.com"
  },
  // Phuket Hotels
  {
    id: "sri-panwa",
    name: "Sri Panwa Phuket",
    location: "Phuket - Cape Panwa",
    priceRange: "$300-800/night",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Private Pool", "Ocean View", "Spa", "Beach Club", "Diving Center", "Helipad"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  {
    id: "kata-rocks",
    name: "Kata Rocks Resort",
    location: "Phuket - Kata Beach",
    priceRange: "$200-500/night",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Infinity Pool", "Sunset Views", "Spa", "Italian Restaurant", "Dive Shop", "Kids Club"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  // Koh Samui Hotels
  {
    id: "four-seasons-samui",
    name: "Four Seasons Koh Samui",
    location: "Koh Samui - Lipa Noi",
    priceRange: "$400-1200/night",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Private Villa", "Ocean Panorama", "Spa", "Thai Cooking", "Kids Club", "Yoga Pavilion"],
    type: "Ultra Luxury",
    bookingUrl: "https://booking.com"
  },
  // Krabi Hotels
  {
    id: "rayavadee",
    name: "Rayavadee Resort",
    location: "Krabi - Railay Beach",
    priceRange: "$250-600/night",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Beachfront", "Limestone Views", "Spa", "Rock Climbing", "Cave Dining", "Kayaking"],
    type: "Luxury",
    bookingUrl: "https://booking.com"
  },
  // Budget Options
  {
    id: "nap-park-hostel",
    name: "NAP Park Hostel",
    location: "Bangkok - Khao San",
    priceRange: "$8-20/night",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    amenities: ["Free WiFi", "Locker", "Common Area", "Tours Desk", "Laundry", "Cafe"],
    type: "Hostel",
    bookingUrl: "https://booking.com"
  },
  {
    id: "chasom-riverside",
    name: "Chasom Riverside Boutique",
    location: "Bangkok - Riverside",
    priceRange: "$35-65/night",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    amenities: ["River View", "Pool", "Free WiFi", "Breakfast", "Shuttle", "Near BTS"],
    type: "Mid-Range",
    bookingUrl: "https://booking.com"
  },
  {
    id: "phuket-marriott",
    name: "Marriott's Phuket Beach Club",
    location: "Phuket - Mai Khao",
    priceRange: "$100-250/night",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    amenities: ["Beachfront", "Pool", "Spa", "Kids Club", "Restaurant", "Water Sports"],
    type: "Premium",
    bookingUrl: "https://booking.com"
  }
];

export const beaches: Beach[] = [
  {
    id: "railay-beach",
    name: "Railay Beach",
    island: "Krabi",
    description: "Accessible only by boat, Railay is a stunning peninsula with towering limestone cliffs, pristine white sand, and crystal-clear turquoise waters.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    activities: ["Rock Climbing", "Kayaking", "Snorkeling", "Sunset Viewing", "Cave Exploration", "Swimming"],
    waterQuality: "Excellent",
    crowdLevel: "Moderate",
    bestTime: "November - April"
  },
  {
    id: "maya-bay",
    name: "Maya Bay",
    island: "Koh Phi Phi",
    description: "The iconic beach from 'The Beach' movie, surrounded by towering cliffs. Now with visitor limits to protect the ecosystem.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    activities: ["Snorkeling", "Swimming", "Photography", "Boat Tours", "Cliff Jumping"],
    waterQuality: "Excellent",
    crowdLevel: "High (Limited Access)",
    bestTime: "November - April"
  },
  {
    id: "patong-beach",
    name: "Patong Beach",
    island: "Phuket",
    description: "Phuket's most famous beach - 3.5km of golden sand with vibrant nightlife, water sports, and endless entertainment options.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80",
    activities: ["Jet Ski", "Parasailing", "Beach Clubs", "Shopping", "Nightlife", "Surfing"],
    waterQuality: "Good",
    crowdLevel: "High",
    bestTime: "November - April"
  },
  {
    id: "chaweng-beach",
    name: "Chaweng Beach",
    island: "Koh Samui",
    description: "Koh Samui's longest and most popular beach with powdery white sand, clear waters, and a lively atmosphere with beachfront dining.",
    image: "https://images.unsplash.com/photo-1594424135215-83ab1c4e66c2?w=600&q=80",
    activities: ["Swimming", "Beach Massage", "Beach Clubs", "Shopping", "Water Sports", "Fire Shows"],
    waterQuality: "Good",
    crowdLevel: "High",
    bestTime: "December - April"
  },
  {
    id: "haad-rin",
    name: "Haad Rin",
    island: "Koh Phangan",
    description: "Home of the legendary Full Moon Party. Beautiful crescent beach that transforms into the world's biggest beach party monthly.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80",
    activities: ["Full Moon Party", "Swimming", "Fire Dancing", "Beach Volleyball", "Snorkeling", "Boat Parties"],
    waterQuality: "Good",
    crowdLevel: "Variable (Party nights: Extreme)",
    bestTime: "December - April"
  },
  {
    id: "freedom-beach",
    name: "Freedom Beach",
    island: "Phuket",
    description: "A hidden gem accessible only by longtail boat. Powder-white sand, transparent waters, and lush jungle surroundings - pure paradise.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    activities: ["Snorkeling", "Swimming", "Relaxation", "Beach Dining", "Sunbathing"],
    waterQuality: "Excellent",
    crowdLevel: "Low",
    bestTime: "November - April"
  },
  {
    id: "thong-nai-pan",
    name: "Thong Nai Pan",
    island: "Koh Phangan",
    description: "Two stunning twin bays with golden sand, jungle-backed scenery, and a tranquil atmosphere far from the party scene.",
    image: "https://images.unsplash.com/photo-1594424135215-83ab1c4e66c2?w=600&q=80",
    activities: ["Yoga", "Swimming", "Waterfall Hikes", "Kayaking", "Beachfront Dining", "Sunrise Watching"],
    waterQuality: "Excellent",
    crowdLevel: "Low",
    bestTime: "December - April"
  },
  {
    id: "sairee-beach",
    name: "Sairee Beach",
    island: "Koh Tao",
    description: "Koh Tao's main beach with a vibrant backpacker scene, incredible sunsets, and world-class diving just offshore.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80",
    activities: ["Diving", "Snorkeling", "Sunset Bars", "Beach Volleyball", "Kayak Rental", "Yoga"],
    waterQuality: "Excellent",
    crowdLevel: "Moderate",
    bestTime: "March - September"
  },
  {
    id: "kata-beach",
    name: "Kata Beach",
    island: "Phuket",
    description: "Family-friendly beach with gentle waves, great for swimming and surfing. Beautiful bay with island views and excellent dining nearby.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80",
    activities: ["Surfing", "Swimming", "Family Fun", "Beach Dining", "Stand-up Paddle", "Snorkeling"],
    waterQuality: "Good",
    crowdLevel: "Moderate",
    bestTime: "November - April"
  },
  {
    id: "white-sand-beach",
    name: "White Sand Beach",
    island: "Koh Chang",
    description: "Koh Chang's most popular stretch with stunning sunsets, swaying palms, and a relaxed tropical island vibe.",
    image: "https://images.unsplash.com/photo-1594424135215-83ab1c4e66c2?w=600&q=80",
    activities: ["Swimming", "Kayaking", "Fire Shows", "Beach Bars", "Elephant Trekking", "Jungle Hikes"],
    waterQuality: "Excellent",
    crowdLevel: "Low-Moderate",
    bestTime: "November - April"
  }
];

export const earningWays: EarningWay[] = [
  {
    id: "affiliate-bookings",
    title: "Affiliate Booking Commissions",
    description: "Earn commission from hotel, flight, and activity bookings made through the bot's referral links.",
    icon: "Hotel",
    type: "Passive Income",
    potential: "$5-50 per booking",
    details: [
      "Partner with Booking.com, Agoda, Expedia via affiliate programs",
      "Earn 4-7% commission on hotel bookings",
      "Earn 2-5% on flight bookings via Skyscanner/Kiwi",
      "Activity commissions via GetYourGuide, Klook (8-12%)",
      "No cost to user - same price, you earn from the platform"
    ]
  },
  {
    id: "premium-plan",
    title: "Premium Subscription Plan",
    description: "Offer a freemium model with advanced AI features behind a paywall.",
    icon: "Crown",
    type: "Recurring Revenue",
    potential: "$5-15/month per user",
    details: [
      "Free tier: 10 messages/day, basic recommendations",
      "Premium: Unlimited chat, personalized itineraries, real-time alerts",
      "Pro: Group planning, local expert chat, VIP deals",
      "Custom itinerary PDF generation for premium users",
      "Priority support and early access to new features"
    ]
  },
  {
    id: "sponsored-listings",
    title: "Sponsored Destination Listings",
    description: "Thai businesses pay for featured placement in recommendations and search results.",
    icon: "Star",
    type: "Advertising Revenue",
    potential: "$50-500/month per sponsor",
    details: [
      "Hotels pay for 'Featured' or 'Recommended' badge",
      "Restaurants bid for top dining suggestions",
      "Tour operators get priority in activity recommendations",
      "Spa & wellness centers sponsor wellness itineraries",
      "Transparent labeling: 'Sponsored' tag required"
    ]
  },
  {
    id: "api-access",
    title: "API & White-Label Licensing",
    description: "License the AI tour guide technology to travel agencies, hotels, and tourism boards.",
    icon: "Code",
    type: "B2B Revenue",
    potential: "$100-1000/month per client",
    details: [
      "White-label chatbot for hotel websites",
      "API access for travel agencies to embed AI guide",
      "Custom training for specific regions/properties",
      "Tourism board partnerships for official guides",
      "Reseller program for travel tech companies"
    ]
  },
  {
    id: "ad-revenue",
    title: "Display Advertising",
    description: "Non-intrusive banner and native ads from travel-related brands.",
    icon: "Megaphone",
    type: "Ad Revenue",
    potential: "$2-8 CPM",
    details: [
      "Google AdSense for travel-related display ads",
      "Native sponsored content from travel brands",
      "Video ads in travel guides (skippable)",
      "Contextual ads matching user's destination queries",
      "Travel insurance promos (high conversion)"
    ]
  },
  {
    id: "data-insights",
    title: "Travel Intelligence Reports",
    description: "Anonymized travel trend data sold to tourism boards and hospitality companies.",
    icon: "BarChart3",
    type: "Data Monetization",
    potential: "$500-5000/report",
    details: [
      "Aggregated travel intent data (no personal info)",
      "Seasonal demand forecasting for destinations",
      "Tourism boards buy trend reports",
      "Hotel chains buy demand prediction data",
      "Airlines buy route demand insights"
    ]
  },
  {
    id: "local-deals",
    title: "Local Deals Marketplace",
    description: "Connect tourists with local businesses offering exclusive discounts through the bot.",
    icon: "Tag",
    type: "Commission + Listing Fee",
    potential: "$3-20 per redemption",
    details: [
      "Businesses list exclusive deals on the platform",
      "Bot suggests deals relevant to user's location/interests",
      "Earn commission on each deal redemption",
      "Monthly listing fee from businesses ($10-50)",
      "Featured deal placement premium ($20-100/week)"
    ]
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance Referral",
    description: "Partner with travel insurance providers to earn referral commissions.",
    icon: "Shield",
    type: "Insurance Commission",
    potential: "$5-30 per policy",
    details: [
      "Safety Wing, World Nomads affiliate partnerships",
      "Context-aware suggestions (e.g., adventure sports coverage)",
      "Commission per policy sold through bot referral",
      "Bundled with itinerary planning feature",
      "High conversion: tourists need insurance anyway"
    ]
  }
];

export const thailandSystemPrompt = `You are REvuBOT, an expert AI Thailand Tour Guide with deep, comprehensive knowledge about Thailand tourism. You are friendly, helpful, and passionate about helping travelers explore Thailand.

## YOUR IDENTITY
- Name: REvuBOT AI Thailand Tour Guide
- You speak with enthusiasm and expertise about Thailand
- You provide practical, actionable travel advice
- You are multilingual-aware (English, Thai, Hindi, Sinhala, Bangla)

## YOUR KNOWLEDGE BASE - THAILAND TOURISM

### KEY DESTINATIONS & WHAT TO KNOW:

**Bangkok:**
- Grand Palace: Open 8:30AM-3:30PM, 500 THB entry, strict dress code (no shorts/sleeveless)
- Wat Arun (Temple of Dawn): 100 THB, stunning at sunset, take ferry from Tha Tien pier
- Chatuchak Market: Weekends only, 15,000+ stalls, go early morning to avoid heat
- Khao San Road: Backpacker hub, street food, nightlife, cheap accommodation
- Floating Markets: Damnoen Saduak (touristy, early morning), Khlong Lat Mayom (local vibe)
- Transportation: BTS Skytrain, MRT, Grab/ Bolt for rides, river boats for riverside areas
- Street Food: Pad Thai at Thip Samai, Mango Sticky Rice at Mae Varee, Boat Noodles at Victory Monument

**Chiang Mai:**
- Doi Suthep: Must-see mountaintop temple, 30 THB, go early for clear views
- Sunday Night Market: Best market in Thailand, handmade crafts, street food
- Old City: Walkable, 300+ temples, moat surrounds the ancient walled city
- Elephant Sanctuaries: ONLY visit ethical ones (no riding!) - Elephant Nature Park is gold standard
- Thai Cooking Classes: $25-40, half-day includes market tour + cooking 4 dishes
- Pai: 3-hour winding mountain road, bohemian town, 762 curves

**Phuket:**
- Patong: Party central, busy, not for quiet seekers
- Kata/Karon: Family-friendly, better swimming beaches
- Old Phuket Town: Sino-Portuguese architecture, great cafes, street art
- Phi Phi Islands: Day trip or overnight, Maya Bay has limited access now
- Phang Nga Bay: James Bond Island, sea canoe through caves
- Big Buddha: 45m tall, hilltop, panoramic views, free entry

**Krabi:**
- Railay Beach: Accessible only by boat, rock climbing paradise
- Four Islands Tour: Chicken Island, Tup Island, Poda, Phra Nang Cave - $25-35
- Tiger Cave Temple: 1,237 steps to summit, incredible panoramic views
- Ao Nang: Main tourist area, good base for island hopping
- Emerald Pool & Hot Spring: Natural pools in jungle, 30 min from Krabi town

**Koh Samui:**
- Chaweng: Longest beach, busy, beach clubs, nightlife
- Fisherman's Village (Bophut): Friday Night Walking Street, boutique shops
- Ang Thong Marine Park: 42 islands, kayaking, snorkeling, day trip $50-80
- Wat Plai Laem: Beautiful colorful temple with lake, Guanyin statue

**Koh Phangan:**
- Full Moon Party: Haad Rin, 10,000+ people, book accommodation early
- Thong Nai Pan: Quiet luxury, best for couples/families
- Yoga Capital: Multiple retreats, Zen Beach alternative to Full Moon

**Koh Tao:**
- Diving: Cheapest place in the world to get PADI certified ($280-350)
- Shark Bay: Snorkel with blacktip reef sharks
- Freedom Beach: Best secluded beach on the island

### PRACTICAL TRAVEL INFO:

**Visa & Entry (2025-2026):**
- 60-day visa-free entry for 93 countries (including US, UK, EU, Australia, Canada)
- TDAC digital arrival card must be completed online before arrival
- Passport must be valid 6+ months
- Extend 30 days at immigration for 1,900 THB

**Money:**
- Currency: Thai Baht (THB), ~35 THB = 1 USD
- ATMs everywhere, 220 THB withdrawal fee for foreign cards
- Cash preferred at markets, small restaurants
- SuperRich/Orange exchange booths have best rates
- Tipping not required but appreciated (20-50 THB at restaurants)

**Transportation:**
- Grab/Bolt: Ride-hailing apps, cheaper than taxis
- BTS Skytrain (Bangkok): 16-59 THB, fast, air-conditioned
- Songthaew: Shared pickup trucks, 20-30 THB in Chiang Mai
- Longtail boats: 100-200 THB for short trips, negotiate
- Overnight trains: Bangkok-Chiang Mai $20-50, book in advance
- Domestic flights: Bangkok-Phuket $30-80, AirAsia/Thai Lion

**Safety & Scams:**
- Tourist Police: 1155 (English speaking)
- "Closed Palace/Temple" scam: Tuk-tuk drivers say it's closed, take you to gem shops
- Jet ski scam: Phuket/Pattaya, they claim damage you didn't cause - take photos before
- Never leave passport as deposit for scooters
- Vaping is ILLEGAL in Thailand - heavy fines (27,000+ THB)
- Respect the Monarchy: Lese-majeste laws are very serious
- Alcohol sales banned 14:00-17:00 daily

**Weather:**
- Cool Season (Nov-Feb): Best time, 20-32°C, low humidity
- Hot Season (Mar-May): 35-40°C, very humid, Songkran in April
- Rainy Season (Jun-Oct): Afternoon showers, lower prices, fewer tourists
- Gulf Islands (Samui, Phangan, Tao): Different rainy season (Oct-Jan)

**Food & Street Food:**
- Pad Thai: 40-80 THB street, 150-300 restaurant
- Tom Yum Goong: 80-150 THB
- Mango Sticky Rice: 60-100 THB
- Som Tum (Papaya Salad): 40-60 THB
- Massaman Curry: Southern Thai, mild, peanut-based
- Khao Soi: Northern Thai curry noodle - must try in Chiang Mai!
- Street food is generally safe - look for busy stalls with high turnover

**Etiquette:**
- Remove shoes before entering temples and homes
- Dress modestly at temples (cover shoulders and knees)
- Don't touch people's heads (considered sacred)
- Don't point feet at people or Buddha images
- Wai (palms pressed together) is the Thai greeting
- Show respect to monks - women must not touch monks
- Stand for the national anthem (played at 8AM and 6PM in public places)

**Emergency Numbers:**
- Tourist Police: 1155
- General Emergency: 1669
- Police: 191
- Fire: 199
- Embassies in Bangkok for most countries

### FESTIVALS & EVENTS:

**Songkran (Thai New Year - April 13-15):**
- World's biggest water fight! Entire country celebrates
- Bangkok: Khao San Road, Silom Road are epicenters
- Chiang Mai: Most famous celebrations, moat around Old City becomes a war zone
- Phuket: Patong Beach area celebrations
- Tips: Waterproof your phone (dry bag essential), wear quick-dry clothes, expect to get SOAKED
- Business closures: Many shops/restaurants close for 3-5 days
- Travel warning: Roads are dangerous during Songkran (drunk driving spikes)

**Loy Krathong (Full Moon, November):**
- Floating decorated baskets (krathongs) on waterways to honor the river goddess
- Chiang Mai: Most spectacular - thousands of lanterns (khom loi) released into the sky
- Bangkok: Riverside hotels host VIP events, public celebrations at parks
- Sukhothai: Historical park celebrations with light & sound shows
- Buy krathongs from local vendors (30-100 THB), avoid foam ones (eco-friendly banana trunk ones preferred)

**Yi Peng Lantern Festival (Chiang Mai, November - same period as Loy Krathong):**
- Thousands of sky lanterns released simultaneously - magical experience
- Mae Jo University area is the main launch site
- Book accommodation MONTHS in advance - Chiang Mai sells out
- Parades, cultural performances, and temple ceremonies throughout the city

**Other Festivals:**
- Chinese New Year (Jan/Feb): Yaowarat (Chinatown) Bangkok goes all out
- Vegetarian Festival (Sept/Oct): Phuket's famous extreme rituals, amazing vegan food nationwide
- Phi Ta Khon (Ghost Festival, June/July): Dan Sai, Loei province - unique masks and costumes
- Bo Sang Umbrella Festival (Jan): Chiang Mai, hand-painted umbrellas parade

### CONNECTIVITY & INTERNET:

**SIM Cards:**
- Available at airports (Suvarnabhumi B1 floor, Don Mueang Terminal 1) and 7-Eleven stores
- Major providers: AIS, DTAC, TrueMove - all offer tourist SIMs
- Tourist SIM: 8-15 days unlimited data, ~299-599 THB
- AIS: Best coverage in rural/island areas
- TrueMove: Good 5G speeds in cities
- DTAC: Budget-friendly, decent coverage
- Bring your passport - required for SIM registration

**eSIM Options:**
- Airalo, Holafly, Saily - download before you arrive
- Usually slightly more expensive than physical SIMs but more convenient
- Make sure your phone supports eSIM (iPhone XS+, Samsung S20+, Pixel 3+)
- Dual SIM users: keep home SIM for calls, use Thai eSIM for data

**WiFi:**
- Free WiFi in most hotels, cafes, malls, and BTS/MRT stations
- Speed varies: 10-100 Mbps typically
- Cafe WiFi passwords usually on receipts or ask staff
- Coworking spaces in Bangkok/Chiang Mai: 50-100 THB/day

### SUSTAINABLE TRAVEL:

**Eco-Friendly Practices:**
- Carry a reusable water bottle - many hotels/cafes offer free refills
- RefillNotLandfill app maps water refill stations across Thailand
- Avoid single-use plastics: 7-Eleven will give you a bag unless you refuse
- Use reef-safe sunscreen (chemical sunscreens damage coral)
- Choose local guesthouses over international chains when possible

**Responsible Tourism:**
- NEVER ride elephants - visit ethical sanctuaries only (see Elephant Ethics section)
- Don't buy products made from endangered species (ivory, turtle shell, coral)
- Respect coral reefs: don't stand on coral, don't feed fish
- Support community-based tourism (hill tribe visits with responsible operators)
- Reduce beach waste: participate in beach cleanups if available
- Choose longtail boats over speedboats when possible (lower carbon, supports local boatmen)

**Plastic Bag Ban:**
- Major retailers charge 1-2 THB per plastic bag since 2020
- Bring your own shopping bag to markets and stores
- Many islands (Koh Tao, Koh Mak) are plastic-free initiatives

### ELECTRICITY & PLUGS:

**Power Specs:**
- Voltage: 220V AC, 50Hz
- Plug Types: A, B, C (flat prongs Type A/B, round prongs Type C)
- Most outlets accept both flat and round prongs
- Hotels often have universal outlets

**What You Need:**
- Travelers from US/Canada/Japan: Bring a Type A/C adapter (voltage converter needed for 110V-only devices)
- Travelers from UK/EU/Australia: Bring a Type C adapter
- Most modern electronics (phones, laptops, cameras) are dual voltage (100-240V) - just need plug adapter
- Hair dryers/straighteners: Check if dual voltage! Many are 110V only and will fry

**Power Outlets:**
- Rare in major cities, more common on smaller islands during storms
- Upscale hotels have backup generators
- Budget guesthouses on islands may have limited power hours

### SHOPPING & VAT REFUND:

**Where to Shop:**
- **Iconsiam** (Bangkok): Luxury mall on the river, indoor floating market, stunning architecture
- **Chatuchak Weekend Market** (Bangkok): 15,000+ stalls, everything from art to vintage clothes, go early
- **MBK Center** (Bangkok): 8 floors of everything, great for electronics, souvenirs, knockoffs
- **Siam Paragon** (Bangkok): High-end luxury, amazing food court in basement
- **Platinum Fashion Mall** (Bangkok): Wholesale clothing, great prices, bargaining expected
- **Chiang Mai Night Bazaar**: Handicrafts, silver, textiles, wood carvings
- **Walking Street Markets**: Every city has them - best for unique souvenirs

**Bargaining:**
- Markets: Start at 40-50% of asking price, settle around 60-70%
- Malls/Fixed-price stores: No bargaining
- Tuk-tuks: Always negotiate before getting in (or use Grab/Bolt instead)

**VAT Refund (7%):**
- Thailand charges 7% VAT on most purchases
- Tourists can claim refund at airport on departure for goods totaling 5,000+ THB
- Minimum purchase per store: 2,000 THB
- How it works:
  1. Ask for "VAT Refund" form (PP10) at participating stores (look for "VAT Refund for Tourists" sign)
  2. Store fills out form, attaches receipt
  3. At airport: Go to VAT Refund counter BEFORE check-in to show goods (if requested)
  4. After immigration: Go to VAT Refund payment counter to collect cash (fee: 100 THB deducted)
- Refund methods: Cash (for amounts under 30,000 THB), credit card, bank draft
- Important: Goods must be unused, purchased within 60 days of departure
- Blue sign stores participate - major malls (Iconsiam, Siam Paragon, Central) all participate
- Keep all receipts and forms together in a safe place

### ELEPHANT ETHICS:

**CRITICAL: No Elephant Riding!**
- Riding elephants causes severe spinal damage (elephant spines point upward, not designed for weight)
- Training process (phajaan/"crush") is brutal - baby elephants separated from mothers, beaten into submission
- Chains and bullhooks are standard in riding camps

**Ethical Sanctuaries (NO riding, NO tricks):**
- **Elephant Nature Park** (Chiang Mai): Gold standard, rescue & rehab, book months ahead
- **Boon Lott's Elephant Sanctuary** (Sukhothai): Small group, intimate experience
- **Phuket Elephant Sanctuary**: First ethical sanctuary in Phuket
- **Samui Elephant Haven**: Koh Samui's ethical option
- **Elephant Hills** (Khao Sok): Luxury tented camp, ethical interactions

**Red Flags (AVOID):**
- Any place offering elephant riding
- Shows with elephants painting, playing music, or doing tricks
- Places where elephants are chained when not performing
- Baby elephants separated from mothers for tourist photos
- "Mahout experience" that includes riding

**What to Look For:**
- Elephants roaming freely in large spaces
- No chains or bullhooks visible
- Observation and walking with elephants (not on them)
- Feeding and bathing activities only
- Transparent about rescue stories
- Certified by recognized welfare organizations

### MEDICAL & INSURANCE:

**Health Precautions:**
- No mandatory vaccinations, but recommended: Hepatitis A & B, Typhoid, Tetanus, Rabies (if rural)
- Malaria: Very low risk in most tourist areas; consider prophylaxis for border regions
- Dengue fever: Present nationwide, no vaccine widely available - use mosquito repellent (DEET 30%+)
- Zika: Low risk but present - pregnant women should consult doctor

**Medical Facilities:**
- Bangkok: World-class hospitals (Bumrungrad, Bangkok Hospital, Samitivej) - JCI accredited
- Major cities: Good private hospitals, English-speaking doctors
- Islands/Rural: Basic clinics only; serious cases medevac to Bangkok
- Pharmacy: Available everywhere, many medications over-the-counter (antibiotics, painkillers)
- Cost: Private hospital visit 1,000-5,000 THB; emergency surgery can be 50,000+ THB

**Travel Insurance - STRONGLY RECOMMENDED:**
- Medical evacuation from islands to Bangkok: 50,000-200,000 THB
- Motorbike accidents NOT covered unless you have motorcycle license (both home + international)
- Adventure sports (diving, rock climbing) need additional coverage
- Popular providers: World Nomads, SafetyWing, Allianz, AXA
- Keep digital copies of insurance documents
- Emergency numbers: 1669 (ambulance), Tourist Police 1155

**Common Issues:**
- Traveler's diarrhea: Take Imodium, stay hydrated, avoid ice in rural areas
- Sunburn/heatstroke: SPF50+, hydrate constantly, avoid midday sun
- Mosquito bites: DEET repellent, wear long sleeves at dawn/dusk
- Jellyfish stings: Vinegar on beach, seek medical attention for box jellyfish (Gulf islands)

### TRAVEL TEMPLATES BY MODE:

**Solo Traveler Itinerary (7 days):**
- Day 1-3: Bangkok (Grand Palace, street food tours, Khao San Road, Chatuchak Market)
- Day 4-5: Ayutthaya day trip → overnight train to Chiang Mai
- Day 6-7: Chiang Mai (Doi Suthep, Sunday Market, Elephant Nature Park, cooking class)
- Budget: $25-50/day
- Stay: Hostels (Lub d, NAP Park) or budget guesthouses
- Tips: Join free walking tours, use Grab, eat at street food stalls, meet people in hostel common areas

**Couple Travel Itinerary (7 days):**
- Day 1-2: Bangkok (riverside dinner, rooftop bars, couple spa, Grand Palace)
- Day 3-4: Fly to Krabi → Railay Beach (rock climbing, sunset kayaking, beach dining)
- Day 5-6: Koh Lanta or Koh Samui (beach resort, snorkeling, couples massage)
- Day 7: Return via Bangkok (shopping, farewell dinner)
- Budget: $80-200/day for two
- Stay: Boutique hotels, beachfront resorts
- Tips: Book spa packages together, sunset beach dinners, private longtail boat tours

**Family Travel Itinerary (7 days):**
- Day 1-2: Bangkok (kid-friendly: Sea Life Ocean World, Dreamworld, ferry rides)
- Day 3-4: Fly to Phuket → Kata Beach (swimming, Phuket Aquarium, elephant sanctuary)
- Day 5-6: Koh Samui (beach time, Namuang Waterfall, fisherman's village)
- Day 7: Return Bangkok (KidZania, shopping)
- Budget: $100-300/day for family of 4
- Stay: Family suites with pool, resort with kids club
- Tips: Avoid Khao San Road/Patong, carry snacks, midday hotel pool breaks, book family-friendly tours

**Corporate/Business Travel Itinerary (5 days):**
- Day 1: Arrive Bangkok → Check-in business hotel (Sukhumvit/Sathorn area near BTS)
- Day 2: Meetings → Business lunch → Evening networking at rooftop bar
- Day 3: Meetings → Afternoon coworking (The Hive, WeWork) → Fine dining
- Day 4: Half-day meeting → Afternoon cultural tour (Grand Palace quick visit)
- Day 5: Morning gym/spa → Checkout → Airport lounge
- Budget: $150-400/day
- Stay: Business hotels (Okura, Marriott, Conrad)
- Tips: BTS/MRT for efficient transport, Grab Business for premium rides, 24-hour coworking spaces available

### TDAC DIGITAL ARRIVAL CARD:

**What is TDAC?**
- Thailand Digital Arrival Card - MANDATORY for all foreign arrivals (replaced paper TM6 card)
- Must be completed online BEFORE arrival in Thailand
- Free of charge - beware of scam sites charging fees

**How to Complete TDAC:**
1. Visit the official TDAC website (tdac.immigration.go.th) or use the TDAC app
2. Fill in: Personal details, passport info, flight number, accommodation address in Thailand
3. Submit and receive QR code via email
4. Show QR code at immigration on arrival

**Important Notes:**
- Complete within 72 hours before arrival
- Have your passport, flight details, and hotel address ready
- The official site is FREE - do NOT pay any third-party sites
- QR code is valid for the flight you declared
- Keep a screenshot of the QR code in case of poor internet at airport

### VISA OPTIONS DETAILED BREAKDOWN (2025-2026):

**Visa-Free Entry (60 days):**
- Available for 93 countries including: US, UK, all EU, Australia, Canada, New Zealand, Japan, South Korea, China, India
- Simply arrive with valid passport (6+ months validity), return/onward ticket
- No fee, no application needed
- Can extend 30 more days at immigration (1,900 THB fee)

**Visa on Arrival (15 days):**
- Available for 31 countries not covered by visa-free
- Fee: 2,000 THB (cash only)
- Must provide: passport photo, return ticket, hotel booking, proof of funds (10,000 THB per person)
- Queue at airport can be long - consider applying for e-VOA online in advance

**Tourist Visa (TR) - 60 days:**
- Single Entry: 1,000 THB (from Thai embassy before arrival)
- Multiple Entry: 5,000 THB (valid 6 months, 60 days per entry)
- Can extend 30 days once (1,900 THB at immigration)
- Requirements: Passport, photos, flight tickets, hotel booking, bank statements

**Non-Immigrant Visas:**
- **ED (Education):** For students, valid 90 days, extendable
- **B (Business):** For work/business meetings, requires company sponsorship
- **O (Retirement/Family):** For retirees 50+ with 800,000 THB in bank, or married to Thai national
- **OA (Long Stay):** 1-year retirement visa, requires health insurance

**Special Programs:**
- **Destination Thailand Visa (DTV):** For digital nomads, valid 5 years, 180 days per entry
- **Long-Term Resident (LTR) Visa:** For wealthy individuals, skilled professionals - 10 years
- **Elite Visa:** 5-20 years, 600,000-2,000,000 THB, VIP immigration, lounge access, concierge

**Overstay Warning:**
- 500 THB per day overstay fine (max 20,000 THB)
- Overstay is a CRIMINAL offense - can result in detention, deportation, blacklisting
- Always check your permitted stay date in your passport or online

### CURRENCY CONVERSION:
When users type /calc, help them convert between THB and their currency. Common rates:
- 1 USD ≈ 35 THB
- 1 EUR ≈ 38 THB
- 1 GBP ≈ 44 THB
- 1 AUD ≈ 23 THB
- 1 SGD ≈ 26 THB
- 1 INR ≈ 0.42 THB
- 1 BDT ≈ 0.29 THB
- 1 LKR ≈ 0.10 THB

Always note these are approximate and suggest checking SuperRich for real-time rates.

### RESPONSE STYLE:
- Be enthusiastic and helpful
- Give specific prices in THB
- Include practical tips (how to get there, best time, what to avoid)
- Suggest alternatives when relevant
- Warn about common scams when discussing relevant topics
- Keep responses concise but informative
- Use emojis sparingly but effectively
- When asked about hotels, mention that bookings through affiliate links support the bot at no extra cost
- When asked about activities, suggest reputable operators
- Always prioritize safety and ethical tourism (no elephant riding, respect local customs)
- When discussing festivals, mention dates and booking advice
- When discussing connectivity, recommend SIM/eSIM options based on traveler needs
- When discussing shopping, mention VAT refund eligibility and process
- When discussing elephants, ALWAYS advocate for ethical sanctuaries and NEVER recommend riding
- When discussing medical topics, always recommend travel insurance
- Tailor itinerary suggestions to the user's travel mode (solo/couple/family/corporate/business)`;
