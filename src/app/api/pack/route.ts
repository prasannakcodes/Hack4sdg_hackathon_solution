import { NextRequest, NextResponse } from "next/server";
import { calculatePooling } from "@/lib/packingEngine";
import { DEFAULT_TRUCK_CONFIG, SEEDED_MAKERS } from "@/lib/constants";
import { MakerShipment, TruckConfig } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shipments: MakerShipment[] =
      body.shipments && body.shipments.length > 0
        ? body.shipments
        : SEEDED_MAKERS;

    const config: TruckConfig = body.config
      ? { ...DEFAULT_TRUCK_CONFIG, ...body.config }
      : DEFAULT_TRUCK_CONFIG;

    const result = calculatePooling(shipments, config);

    return NextResponse.json({
      success: true,
      data: result,
      algorithm: "Multi-Constraint Best Fit Decreasing 2D Bin Packing (Weight & Volume)",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to calculate packing";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = calculatePooling(SEEDED_MAKERS, DEFAULT_TRUCK_CONFIG);
  return NextResponse.json({
    success: true,
    data: result,
    seededMakersCount: SEEDED_MAKERS.length,
  });
}
