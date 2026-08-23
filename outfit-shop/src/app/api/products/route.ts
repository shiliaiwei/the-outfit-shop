import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `https://api.kesararamwithdigital.tech/api/v1/products${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'OutFIT-Haute-Atelier/1.0',
      },
      next: { revalidate: 30 }, // Cache for 30s
    });

    if (!res.ok) {
      // Fallback try HTTP if SSL had an edge handshake issue
      const fallbackUrl = `http://api.kesararamwithdigital.tech/api/v1/products${queryString ? `?${queryString}` : ''}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { 'Accept': 'application/json' },
      });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return NextResponse.json(data);
      }
      return NextResponse.json({ error: 'Failed to fetch upstream products' }, { status: res.status || 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error fetching products from API', details: String(error) },
      { status: 500 }
    );
  }
}

