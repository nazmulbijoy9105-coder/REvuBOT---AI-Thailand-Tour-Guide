import { NextResponse } from 'next/server';
import { beaches } from '@/data/thailand-data';

export async function GET() {
  return NextResponse.json(beaches);
}
