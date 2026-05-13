import { NextRequest, NextResponse } from 'next/server';
import { updateDriverStanding, updateConstructorStanding } from '@/lib/firestore';

// API Key for authentication (should be in environment variables)
const API_KEY = process.env.STANDINGS_API_KEY || 'polaris-motogp-2026-secret-key';

// POST /api/standings - Update standings from external source
export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    if (type === 'driver') {
      // Validate driver data
      if (!data.name || !data.team || data.points === undefined || data.position === undefined) {
        return NextResponse.json(
          { error: 'Missing required driver fields: name, team, points, position' },
          { status: 400 }
        );
      }

      await updateDriverStanding(data);
      return NextResponse.json({
        success: true,
        message: `Driver ${data.name} standing updated`,
        data: data,
      });
    } else if (type === 'constructor') {
      // Validate constructor data
      if (!data.name || data.points === undefined || data.position === undefined) {
        return NextResponse.json(
          { error: 'Missing required constructor fields: name, points, position' },
          { status: 400 }
        );
      }

      await updateConstructorStanding(data);
      return NextResponse.json({
        success: true,
        message: `Constructor ${data.name} standing updated`,
        data: data,
      });
    } else if (type === 'bulk') {
      // Bulk update both drivers and constructors
      const results = {
        drivers: [] as any[],
        constructors: [] as any[],
        errors: [] as any[],
      };

      // Update drivers
      if (data.drivers && Array.isArray(data.drivers)) {
        for (const driver of data.drivers) {
          try {
            await updateDriverStanding(driver);
            results.drivers.push(driver.name);
          } catch (error: any) {
            results.errors.push({ type: 'driver', name: driver.name, error: error.message });
          }
        }
      }

      // Update constructors
      if (data.constructors && Array.isArray(data.constructors)) {
        for (const constructor of data.constructors) {
          try {
            await updateConstructorStanding(constructor);
            results.constructors.push(constructor.name);
          } catch (error: any) {
            results.errors.push({ type: 'constructor', name: constructor.name, error: error.message });
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Bulk update completed',
        results: results,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "driver", "constructor", or "bulk"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/standings - Get current standings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Missing query parameter: type (driver or constructor)' },
        { status: 400 }
      );
    }

    // Note: For security, you might want to add API key check here too
    // For now, allowing public read access

    if (type === 'driver') {
      const { getDriverStandings } = await import('@/lib/firestore');
      const drivers = await getDriverStandings();
      return NextResponse.json({
        success: true,
        data: drivers,
      });
    } else if (type === 'constructor') {
      const { getConstructorStandings } = await import('@/lib/firestore');
      const constructors = await getConstructorStandings();
      return NextResponse.json({
        success: true,
        data: constructors,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "driver" or "constructor"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
