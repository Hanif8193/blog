import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Perform a simple query to check the connection
    const result = await db.execute(sql`SELECT 1 as connected`);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
