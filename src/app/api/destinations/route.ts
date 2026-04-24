import { NextResponse } from 'next/server';
import { destinations } from '@/data/thailand-data';

export async function GET() {
  return NextResponse.json(destinations);
}
