/**
 * pricingWorker.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Background Web Worker for calculating heavy multi-variable commercial freight fares,
 * fuel surcharges, GST, toll models, and backhaul rates off the main browser thread.
 * Protects Interaction to Next Paint (INP) and Time to First Byte (TTFB).
 */

self.onmessage = function (e) {
  const {
    id,
    distanceKm = 10,
    baseFare = 600,
    baseDistanceKm = 3,
    perKmRate = 25,
    estimatedTolls = 0,
    fuelSurchargePct = 0.05,
    gstPct = 0.05,
    isReturnLoad = false,
  } = e.data || {};

  try {
    const extraKm = Math.max(0, distanceKm - baseDistanceKm);
    const distanceFare = Math.round(extraKm * perKmRate);
    const fuelSurcharge = Math.round((baseFare + distanceFare) * fuelSurchargePct);
    const subtotal = baseFare + distanceFare + fuelSurcharge + estimatedTolls;
    const gstAmount = Math.round(subtotal * gstPct);
    const standardTotal = subtotal + gstAmount;

    // Backhaul return-load calculation: up to 30% savings on empty return miles
    const returnLoadDiscount = isReturnLoad ? Math.round(standardTotal * 0.30) : 0;
    const finalFare = standardTotal - returnLoadDiscount;

    // 5% platform commission model: driver keeps 95% of gross freight
    const platformCommission = Math.round(finalFare * 0.05);
    const driverPayout = finalFare - platformCommission;

    self.postMessage({
      success: true,
      id,
      data: {
        distanceKm,
        baseFare,
        distanceFare,
        fuelSurcharge,
        estimatedTolls,
        subtotal,
        gstAmount,
        standardTotal,
        returnLoadDiscount,
        finalFare,
        platformCommission,
        driverPayout,
        computedAt: Date.now(),
      },
    });
  } catch (err) {
    self.postMessage({
      success: false,
      id,
      error: err?.message || 'Pricing calculation failed',
    });
  }
};
