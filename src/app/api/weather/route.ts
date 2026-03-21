import { NextRequest, NextResponse } from 'next/server';
import { getWeather, getWeatherForCities } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city');
  const cities = request.nextUrl.searchParams.get('cities');

  try {
    if (cities) {
      const cityList = cities.split(',').map((c) => c.trim());
      const results = await getWeatherForCities(cityList);
      return NextResponse.json({ weather: results });
    }

    if (city) {
      const result = await getWeather(city);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'city or cities parameter required' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Weather fetch failed. Please try again.' },
      { status: 500 }
    );
  }
}
