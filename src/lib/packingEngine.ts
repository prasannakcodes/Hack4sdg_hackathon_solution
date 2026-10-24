import {
  MakerShipment,
  TruckConfig,
  PackedTruck,
  MakerSavings,
  PoolingResult,
} from "@/types";
import { DEFAULT_TRUCK_CONFIG } from "./constants";

/**
 * Packs shipments into trucks using multi-capacity Best-Fit Decreasing algorithm
 * taking into account both maximum weight (kg) and maximum volume (m3).
 */
export function calculatePooling(
  shipments: MakerShipment[],
  config: TruckConfig = DEFAULT_TRUCK_CONFIG
): PoolingResult {
  const emissionPerTruckKg =
    config.routeDistanceKm * config.emissionFactorKgCo2PerKm;

  // 1. BEFORE POOLING: Each maker books a dedicated truck (mostly empty)
  const beforeTrucks: PackedTruck[] = shipments.map((shipment, index) => {
    const weightUtil = Number(
      ((shipment.weightKg / config.maxWeightKg) * 100).toFixed(1)
    );
    const volumeUtil = Number(
      ((shipment.volumeM3 / config.maxVolumeM3) * 100).toFixed(1)
    );
    return {
      truckId: `before-truck-${index + 1}`,
      truckName: `Dedicated Truck #${index + 1} (${shipment.makerName})`,
      shipments: [shipment],
      totalWeightKg: shipment.weightKg,
      totalVolumeM3: Number(shipment.volumeM3.toFixed(2)),
      weightUtilizationPercent: weightUtil,
      volumeUtilizationPercent: volumeUtil,
      isOverloaded:
        shipment.weightKg > config.maxWeightKg ||
        shipment.volumeM3 > config.maxVolumeM3,
      costInr: config.costPerTripInr,
      co2Kg: Number(emissionPerTruckKg.toFixed(2)),
    };
  });

  // 2. AFTER POOLING: Group shipments going along the same corridor and pack by weight & volume
  // Sort shipments descending by weight + normalized volume to optimize packing efficiency
  const sortedShipments = [...shipments].sort((a, b) => {
    const scoreA =
      a.weightKg / config.maxWeightKg + a.volumeM3 / config.maxVolumeM3;
    const scoreB =
      b.weightKg / config.maxWeightKg + b.volumeM3 / config.maxVolumeM3;
    return scoreB - scoreA;
  });

  interface TruckBin {
    id: string;
    items: MakerShipment[];
    currentWeight: number;
    currentVolume: number;
  }

  const bins: TruckBin[] = [];

  for (const item of sortedShipments) {
    let bestBinIndex = -1;
    let minRemainingSpace = Infinity;

    // Check existing bins that can accommodate item without exceeding weight or volume
    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      if (
        bin.currentWeight + item.weightKg <= config.maxWeightKg &&
        bin.currentVolume + item.volumeM3 <= config.maxVolumeM3
      ) {
        // Evaluate remaining space metric
        const remainingWeightRatio =
          (config.maxWeightKg - (bin.currentWeight + item.weightKg)) /
          config.maxWeightKg;
        const remainingVolumeRatio =
          (config.maxVolumeM3 - (bin.currentVolume + item.volumeM3)) /
          config.maxVolumeM3;
        const combinedRemaining = remainingWeightRatio + remainingVolumeRatio;

        if (combinedRemaining < minRemainingSpace) {
          minRemainingSpace = combinedRemaining;
          bestBinIndex = i;
        }
      }
    }

    if (bestBinIndex !== -1) {
      bins[bestBinIndex].items.push(item);
      bins[bestBinIndex].currentWeight += item.weightKg;
      bins[bestBinIndex].currentVolume += item.volumeM3;
    } else {
      // Create new shared truck bin
      bins.push({
        id: `shared-truck-${bins.length + 1}`,
        items: [item],
        currentWeight: item.weightKg,
        currentVolume: item.volumeM3,
      });
    }
  }

  // Construct packed truck objects for pooled trucks
  const afterTrucks: PackedTruck[] = bins.map((bin, index) => {
    const weightUtil = Number(
      ((bin.currentWeight / config.maxWeightKg) * 100).toFixed(1)
    );
    const volumeUtil = Number(
      ((bin.currentVolume / config.maxVolumeM3) * 100).toFixed(1)
    );

    return {
      truckId: bin.id,
      truckName: `Shared Truck Alpha-${index + 1} (${bin.items.length} Makers Pooled)`,
      shipments: bin.items,
      totalWeightKg: bin.currentWeight,
      totalVolumeM3: Number(bin.currentVolume.toFixed(2)),
      weightUtilizationPercent: weightUtil,
      volumeUtilizationPercent: volumeUtil,
      isOverloaded:
        bin.currentWeight > config.maxWeightKg ||
        bin.currentVolume > config.maxVolumeM3,
      costInr: config.costPerTripInr,
      co2Kg: Number(emissionPerTruckKg.toFixed(2)),
    };
  });

  // 3. SAVINGS CARD PER MAKER
  const makerSavings: MakerSavings[] = [];

  for (const shipment of shipments) {
    // Find which shared truck the shipment belongs to
    const assignedTruck = afterTrucks.find((t) =>
      t.shipments.some((s) => s.id === shipment.id)
    );

    const beforeCost = config.costPerTripInr;
    let afterCost = beforeCost;
    let afterCo2 = emissionPerTruckKg;

    if (assignedTruck) {
      // Fair proportional cost share based on composite payload share
      // In logistics pooling cooperatives, cost is split by maker's share of cargo
      const weightShare =
        assignedTruck.totalWeightKg > 0
          ? shipment.weightKg / assignedTruck.totalWeightKg
          : 1;

      afterCost = Math.round(config.costPerTripInr * weightShare);
      afterCo2 = Number((emissionPerTruckKg * weightShare).toFixed(2));
    }

    const costSaved = Math.max(0, beforeCost - afterCost);
    const percentageSaved = Number(
      ((costSaved / beforeCost) * 100).toFixed(1)
    );
    const costSavedPerKg = Number(
      (costSaved / Math.max(1, shipment.weightKg)).toFixed(2)
    );
    const co2Avoided = Number(
      Math.max(0, emissionPerTruckKg - afterCo2).toFixed(2)
    );

    makerSavings.push({
      makerId: shipment.id,
      makerName: shipment.makerName,
      weightKg: shipment.weightKg,
      volumeM3: Number(shipment.volumeM3.toFixed(2)),
      truckAssignedId: assignedTruck ? assignedTruck.truckId : "unassigned",
      beforeCostInr: beforeCost,
      afterCostShareInr: afterCost,
      costSavedInr: costSaved,
      percentageSaved,
      costSavedPerKgInr: costSavedPerKg,
      beforeCo2Kg: Number(emissionPerTruckKg.toFixed(2)),
      afterCo2Kg: afterCo2,
      co2AvoidedKg: co2Avoided,
    });
  }

  // 4. SUMMARY METRICS
  const beforeTotalCost = beforeTrucks.reduce((sum, t) => sum + t.costInr, 0);
  const afterTotalCost = afterTrucks.reduce((sum, t) => sum + t.costInr, 0);
  const totalSavings = beforeTotalCost - afterTotalCost;
  const totalCostSavingsPercent = Number(
    ((totalSavings / Math.max(1, beforeTotalCost)) * 100).toFixed(1)
  );

  const beforeTotalCo2 = Number(
    beforeTrucks.reduce((sum, t) => sum + t.co2Kg, 0).toFixed(2)
  );
  const afterTotalCo2 = Number(
    afterTrucks.reduce((sum, t) => sum + t.co2Kg, 0).toFixed(2)
  );
  const totalCo2Avoided = Number(
    Math.max(0, beforeTotalCo2 - afterTotalCo2).toFixed(2)
  );
  const totalCo2ReductionPercent = Number(
    ((totalCo2Avoided / Math.max(0.1, beforeTotalCo2)) * 100).toFixed(1)
  );

  const totalWeight = shipments.reduce((sum, s) => sum + s.weightKg, 0);
  const totalVolume = Number(
    shipments.reduce((sum, s) => sum + s.volumeM3, 0).toFixed(2)
  );

  return {
    beforeTrucks,
    afterTrucks,
    makerSavings,
    summary: {
      totalMakers: shipments.length,
      beforeTrucksCount: beforeTrucks.length,
      afterTrucksCount: afterTrucks.length,
      trucksReduced: Math.max(0, beforeTrucks.length - afterTrucks.length),
      beforeTotalCostInr: beforeTotalCost,
      afterTotalCostInr: afterTotalCost,
      totalSavingsInr: totalSavings,
      totalCostSavingsPercent,
      beforeTotalCo2Kg: beforeTotalCo2,
      afterTotalCo2Kg: afterTotalCo2,
      totalCo2AvoidedKg: totalCo2Avoided,
      totalCo2ReductionPercent,
      routeDistanceKm: config.routeDistanceKm,
      totalWeightKg: totalWeight,
      totalVolumeM3: totalVolume,
    },
  };
}
