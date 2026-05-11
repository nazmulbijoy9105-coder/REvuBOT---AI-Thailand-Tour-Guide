import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Create tables one by one
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "conversationId" TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        "aiProvider" TEXT,
        "responseTime" INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "conversationId" TEXT NOT NULL UNIQUE REFERENCES conversations(id) ON DELETE CASCADE,
        budget TEXT,
        "travelStyle" TEXT,
        interests TEXT[] DEFAULT '{}',
        dietary TEXT[] DEFAULT '{}',
        mobility TEXT,
        "groupType" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        highlights TEXT[] DEFAULT '{}',
        "bestTime" TEXT,
        "priceRange" TEXT,
        tips TEXT,
        rating FLOAT DEFAULT 0,
        lat FLOAT,
        lng FLOAT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages("conversationId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations(location)`);

    // Seed destinations
    const existing = await prisma.destination.count();
    if (existing === 0) {
      await prisma.destination.createMany({ data: [
        { name: 'Wat Phra Kaew', category: 'temple', location: 'Bangkok', description: 'Most sacred Buddhist temple in Thailand, within Grand Palace.', highlights: ['Emerald Buddha', 'Grand Palace'], bestTime: 'Morning 8AM-10AM', priceRange: '💰💰', tips: '500 THB entrance. Strict dress code.', rating: 4.8, lat: 13.751, lng: 100.493 },
        { name: 'Wat Arun', category: 'temple', location: 'Bangkok', description: 'Iconic riverside temple with ceramic-tiled prang.', highlights: ['79m prang', 'Riverside views'], bestTime: 'Sunset', priceRange: '💰', tips: '100 THB. Chao Phraya Boat to Tha Tien pier.', rating: 4.7, lat: 13.744, lng: 100.489 },
        { name: 'Chatuchak Market', category: 'market', location: 'Bangkok', description: 'Worlds largest weekend market, 15000+ stalls.', highlights: ['15000+ stalls', 'Street food'], bestTime: 'Sat-Sun 9AM-6PM', priceRange: '💰', tips: 'BTS to Mo Chit. Cash only. Haggle from 40%.', rating: 4.5, lat: 13.800, lng: 100.554 },
        { name: 'Thip Samai Pad Thai', category: 'restaurant', location: 'Bangkok', description: 'Legendary pad thai in egg netting since 1966.', highlights: ['Pad thai in egg net', 'Fresh orange juice'], bestTime: 'Evening after 9PM', priceRange: '💰', tips: '80-120 THB. Maha Chai Road near Khao San.', rating: 4.4, lat: 13.751, lng: 100.504 },
        { name: 'Maya Bay', category: 'beach', location: 'Krabi', description: 'Famous crescent beach, The Beach movie location.', highlights: ['Crystal water', 'Limestone cliffs'], bestTime: 'November-April', priceRange: '💰💰', tips: '400 THB park fee. Speedboat from Phuket 1500-2500 THB.', rating: 4.6, lat: 7.681, lng: 98.767 },
        { name: 'Doi Suthep', category: 'temple', location: 'Chiang Mai', description: 'Mountain temple with golden stupa overlooking city.', highlights: ['Golden stupa', 'City panorama'], bestTime: 'Morning before 10AM', priceRange: '💰', tips: '30 THB. Songthaew from CMU 40 THB.', rating: 4.7, lat: 18.805, lng: 98.922 },
        { name: 'Chiang Mai Night Bazaar', category: 'market', location: 'Chiang Mai', description: 'Nightly market with handicrafts and street food.', highlights: ['Handicrafts', 'Street food alley'], bestTime: 'Daily 6PM-midnight', priceRange: '💰', tips: 'Try khao soi 50-80 THB.', rating: 4.3, lat: 18.788, lng: 98.994 },
        { name: 'Ayutthaya Historical Park', category: 'temple', location: 'Ayutthaya', description: 'UNESCO ruins of former capital 1351-1767.', highlights: ['Buddha head in tree', 'Ancient ruins'], bestTime: 'Nov-Feb morning', priceRange: '💰', tips: 'Train from Hua Lamphong 20 THB. Bicycle 50 THB/day.', rating: 4.6, lat: 14.369, lng: 100.588 },
        { name: 'Railay Beach', category: 'beach', location: 'Krabi', description: 'Boat-access peninsula, rock climbing paradise.', highlights: ['Rock climbing', 'Phra Nang Cave'], bestTime: 'November-April', priceRange: '💰💰', tips: 'Longtail from Ao Nang 150 THB. Stay Railay West.', rating: 4.8, lat: 8.012, lng: 98.835 },
        { name: 'Damnoen Saduak Floating Market', category: 'market', location: 'Ratchaburi', description: 'Most famous floating market with boat vendors.', highlights: ['Boat vendors', 'Coconut pancakes'], bestTime: '7AM-9AM', priceRange: '💰', tips: '100km from BKK. Minivan 80 THB. Boat tour 300-500 THB.', rating: 4.2, lat: 13.518, lng: 99.967 },
      ]});
    }

    await prisma.$disconnect();
    return NextResponse.json({ status: 'ok', message: 'Database ready!', destinations: existing || 'seeded' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
