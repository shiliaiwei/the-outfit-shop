import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.kesararamwithdigital.tech/api/v1/brands', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OutFIT-Haute-Atelier/1.0',
      },
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (!res.ok) {
      const fallbackRes = await fetch('http://api.kesararamwithdigital.tech/api/v1/brands', {
        headers: { 'Accept': 'application/json' },
      });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return NextResponse.json(data);
      }
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: res.status || 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error fetching brands', details: String(error) },
      { status: 500 }
    );
  }
}
