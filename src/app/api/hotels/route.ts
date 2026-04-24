import { NextResponse } from 'next/server';
import { hotels } from '@/data/thailand-data';

export async function GET() {
  return NextResponse.json(hotels);
}
