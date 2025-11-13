/**
 * Warehouse Capacity Calculator - Core Calculation Module
 * All formulas and business logic for HD racks and mezzanine calculations
 */

// Constants
export const CBM_TO_CUFT = 35.3147;
export const DEFAULT_PALLET_LENGTH_FT = 3.94; // 1.2m in feet
export const DEFAULT_PALLET_WIDTH_FT = 3.28; // 1.0m in feet
export const DEFAULT_PALLET_FOOTPRINT_SQFT = 12.92; // 1.2m × 1.0m

/**
 * Calculate warehouse area from dimensions or use provided area
 */
export function calculateArea(inputs) {
  const { warehouseLength, warehouseWidth, warehouseArea } = inputs;
  
  if (warehouseLength && warehouseWidth && warehouseLength > 0 && warehouseWidth > 0) {
    return warehouseLength * warehouseWidth;
  }
  
  return warehouseArea || 0;
}

/**
 * Calculate racking and mezzanine areas
 */
export function calculateAreas(totalArea, percentRacking, mezzPercent) {
  const rackingArea = totalArea * (percentRacking / 100);
  const mezzArea = rackingArea * (mezzPercent / 100);
  const hdArea = rackingArea - mezzArea;
  
  return {
    totalArea,
    rackingArea,
    mezzArea,
    hdArea,
    stagingArea: totalArea - rackingArea
  };
}

/**
 * Calculate bay footprint and dimensions
 */
export function calculateBayDimensions(bayLength, bayWidth, levelHeight, levels) {
  const bayFootprint = bayLength * bayWidth;
  const totalRackHeight = levelHeight * levels;
  
  return {
    bayFootprint,
    totalRackHeight,
    volumePerLevelCuft: bayLength * bayWidth * levelHeight,
  };
}

/**
 * Calculate module dimensions (one module = 2 bays + small gap + aisle)
 */
export function calculateModule(bayLength, smallGap, aisleWidth) {
  // Module pattern: bay + smallGap + bay + aisle
  return 2 * bayLength + smallGap + aisleWidth;
}

/**
 * Calculate bay count using module method (when L×W provided)
 */
export function calculateBayCountModule(warehouseLength, warehouseWidth, bayLength, bayWidth, smallGap, aisleWidth, crossAisleWidth = null) {
  if (!warehouseLength || !warehouseWidth) {
    return null;
  }
  
  const moduleLength = calculateModule(bayLength, smallGap, aisleWidth);
  const baysPerRow = Math.floor(warehouseLength / moduleLength) * 2; // Each module has 2 bays
  
  // For cross aisle, use provided value or default to main aisle width
  const effectiveCrossAisle = crossAisleWidth !== null ? crossAisleWidth : aisleWidth;
  const rowPitch = bayWidth + effectiveCrossAisle;
  const numberOfRows = Math.floor(warehouseWidth / rowPitch);
  
  const totalBays = baysPerRow * numberOfRows;
  
  return {
    baysPerRow,
    numberOfRows,
    totalBays,
    moduleLength,
    rowPitch
  };
}

/**
 * Calculate bay count using empirical method (area-based)
 */
export function calculateBayCountEmpirical(hdArea, bayFootprint, aisleOverheadMultiplier) {
  const effectiveAreaPerBay = bayFootprint * aisleOverheadMultiplier;
  const bayCount = Math.floor(hdArea / effectiveAreaPerBay);
  
  return {
    effectiveAreaPerBay,
    bayCount
  };
}

/**
 * Calculate CBM per bay
 */
export function calculateBayCBM(bayLength, bayWidth, levelHeight, levels) {
  const volumePerLevelCuft = bayLength * bayWidth * levelHeight;
  const volumePerBayCuft = volumePerLevelCuft * levels;
  const volumePerBayCBM = volumePerBayCuft / CBM_TO_CUFT;
  
  return {
    volumePerLevelCuft,
    volumePerBayCuft,
    volumePerBayCBM
  };
}

/**
 * Calculate total rack CBM
 */
export function calculateRackCBM(bayCount, volumePerBayCBM) {
  return bayCount * volumePerBayCBM;
}

/**
 * Calculate mezzanine CBM
 */
export function calculateMezzanineCBM(mezzArea, mezzClearHeight) {
  const mezzTotalCuft = mezzArea * mezzClearHeight;
  const mezzTotalCBM = mezzTotalCuft / CBM_TO_CUFT;
  
  return {
    mezzTotalCuft,
    mezzTotalCBM
  };
}

/**
 * Calculate pallet positions
 */
export function calculatePalletPositions(bayFootprint, palletFootprint, levels, bayCount, palletsPerLevelOverride = null) {
  let palletsPerLevel;
  
  if (palletsPerLevelOverride !== null && palletsPerLevelOverride > 0) {
    palletsPerLevel = palletsPerLevelOverride;
  } else {
    palletsPerLevel = Math.max(Math.floor(bayFootprint / palletFootprint), 2);
  }
  
  const totalPalletPositions = bayCount * palletsPerLevel * levels;
  
  return {
    palletsPerLevel,
    totalPalletPositions
  };
}

/**
 * Calculate derived metrics
 */
export function calculateDerivedMetrics(totalArea, totalCBM, baselineCBM) {
  const sqftPerCBM = totalArea / totalCBM;
  const spaceImprovementFactor = totalCBM / baselineCBM;
  const extraCBM = totalCBM - baselineCBM;
  
  return {
    sqftPerCBM,
    spaceImprovementFactor,
    extraCBM
  };
}

/**
 * Validate inputs and return warnings/errors
 */
export function validateInputs(inputs, calculations) {
  const warnings = [];
  const errors = [];
  
  // Check if rack height exceeds warehouse clear height
  if (inputs.warehouseClearHeight && calculations.totalRackHeight > inputs.warehouseClearHeight) {
    errors.push({
      field: 'levels',
      message: `Rack height (${calculations.totalRackHeight.toFixed(1)} ft) exceeds warehouse clear height (${inputs.warehouseClearHeight} ft). Reduce number of levels.`
    });
  }
  
  // Check bay count
  if (calculations.bayCount < 5) {
    warnings.push({
      field: 'bayCount',
      message: `Very low bay count (${calculations.bayCount}). Consider adjusting rack dimensions or warehouse area allocation.`
    });
  }
  
  // Check VNA aisle width
  if (inputs.isVNA && inputs.aisleWidth < 7) {
    warnings.push({
      field: 'aisleWidth',
      message: `VNA with aisle width < 7 ft requires specialized equipment and safety protocols. Ensure proper clearances.`
    });
  }
  
  // Check mezzanine clear height
  if (inputs.mezzClearHeight && inputs.mezzClearHeight < 6) {
    warnings.push({
      field: 'mezzClearHeight',
      message: `Mezzanine clear height < 6 ft may create cramped picking zones. Consider increasing height.`
    });
  }
  
  // Check area overflow
  const { rackingArea, totalArea } = calculations.areas;
  if (rackingArea > totalArea) {
    errors.push({
      field: 'percentRacking',
      message: `Racking area exceeds total warehouse area. Reduce percentage or check inputs.`
    });
  }
  
  return { warnings, errors };
}

/**
 * Calculate Bill of Quantities (BoQ) for HD racks
 */
export function calculateBoQ(bayCount, levels, bayLength, bayWidth) {
  // Safety multipliers
  const UPRIGHT_SAFETY = 1.05; // 5% extra
  const BEAM_SAFETY = 1.08; // 8% extra
  const DECKING_SAFETY = 1.10; // 10% extra
  const ANCHOR_SAFETY = 1.05; // 5% extra
  
  // Upright calculations
  // Each bay needs 3 uprights (2 ends + 1 shared), but for total we count pairs
  const uprightPairs = Math.ceil((bayCount + 1) * UPRIGHT_SAFETY); // bayCount + 1 for end uprights
  
  // Beam pairs (2 beams per level per bay)
  const beamPairs = Math.ceil(bayCount * levels * BEAM_SAFETY);
  
  // Decking panels (1 per level per bay, assuming wire decking)
  const deckingPanels = Math.ceil(bayCount * levels * DECKING_SAFETY);
  
  // Anchor bolts (4 per upright pair)
  const anchorBolts = Math.ceil(uprightPairs * 4 * ANCHOR_SAFETY);
  
  // Row spacers and safety accessories
  const rowSpacers = Math.ceil(bayCount * 2); // 2 per bay for stability
  const columnProtectors = Math.ceil(uprightPairs * 0.3); // 30% of uprights need protection
  
  return {
    uprightPairs: {
      quantity: uprightPairs,
      description: `Upright frames (${(levels * 6).toFixed(0)} ft height)`
    },
    beamPairs: {
      quantity: beamPairs,
      description: `Beam pairs (${bayLength.toFixed(1)} ft length)`
    },
    deckingPanels: {
      quantity: deckingPanels,
      description: `Wire decking panels (${bayLength.toFixed(1)} × ${bayWidth.toFixed(1)} ft)`
    },
    anchorBolts: {
      quantity: anchorBolts,
      description: 'Anchor bolts with hardware'
    },
    rowSpacers: {
      quantity: rowSpacers,
      description: 'Row spacers (back-to-back bays)'
    },
    columnProtectors: {
      quantity: columnProtectors,
      description: 'Column protectors (corner guards)'
    }
  };
}

/**
 * Main calculation function - orchestrates all calculations
 */
export function calculateWarehouseCapacity(inputs) {
  // Extract inputs
  const {
    warehouseLength,
    warehouseWidth,
    warehouseArea,
    warehouseClearHeight,
    baselineCBM,
    bayLength,
    bayWidth,
    levelHeight,
    levels,
    percentRacking,
    mezzPercent,
    smallGap,
    aisleWidth,
    isVNA,
    aisleOverheadMultiplier,
    palletFootprint,
    palletsPerLevelOverride,
    mezzClearHeight,
    useModuleMethod
  } = inputs;
  
  // Step 1: Calculate areas
  const totalArea = calculateArea(inputs);
  const areas = calculateAreas(totalArea, percentRacking, mezzPercent);
  
  // Step 2: Bay dimensions
  const bayDimensions = calculateBayDimensions(bayLength, bayWidth, levelHeight, levels);
  const { bayFootprint, totalRackHeight } = bayDimensions;
  
  // Step 3: Calculate bay count
  let bayCountResult;
  let bayCount;
  
  if (useModuleMethod && warehouseLength && warehouseWidth) {
    // Use module method for exact layout
    bayCountResult = calculateBayCountModule(
      warehouseLength,
      warehouseWidth,
      bayLength,
      bayWidth,
      smallGap,
      aisleWidth
    );
    bayCount = bayCountResult.totalBays;
  } else {
    // Use empirical method
    bayCountResult = calculateBayCountEmpirical(
      areas.hdArea,
      bayFootprint,
      aisleOverheadMultiplier
    );
    bayCount = bayCountResult.bayCount;
  }
  
  // Step 4: CBM calculations
  const bayCBM = calculateBayCBM(bayLength, bayWidth, levelHeight, levels);
  const totalRackCBM = calculateRackCBM(bayCount, bayCBM.volumePerBayCBM);
  
  // Step 5: Mezzanine CBM
  const mezzCBM = calculateMezzanineCBM(areas.mezzArea, mezzClearHeight);
  
  // Step 6: Total CBM
  const totalCBM = baselineCBM + totalRackCBM + mezzCBM.mezzTotalCBM;
  
  // Step 7: Pallet positions
  const palletPositions = calculatePalletPositions(
    bayFootprint,
    palletFootprint,
    levels,
    bayCount,
    palletsPerLevelOverride
  );
  
  // Step 8: Derived metrics
  const derivedMetrics = calculateDerivedMetrics(totalArea, totalCBM, baselineCBM);
  
  // Step 9: BoQ
  const boq = calculateBoQ(bayCount, levels, bayLength, bayWidth);
  
  // Compile results
  const results = {
    areas,
    bayDimensions,
    bayCount,
    bayCountDetails: bayCountResult,
    totalRackHeight,
    totalRackCBM,
    mezzCBM: mezzCBM.mezzTotalCBM,
    totalCBM,
    baselineCBM,
    ...derivedMetrics,
    ...palletPositions,
    volumePerBayCBM: bayCBM.volumePerBayCBM,
    boq
  };
  
  // Step 10: Validate
  const validation = validateInputs(inputs, { ...results, totalRackHeight });
  results.validation = validation;
  
  return results;
}

/**
 * Format number with commas and decimal places
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Export results to CSV format for BoQ
 */
export function exportToCSV(results, inputs) {
  const lines = [];
  
  // Header
  lines.push('WAREHOUSE CAPACITY CALCULATOR - BILL OF QUANTITIES');
  lines.push('');
  
  // Inputs summary
  lines.push('INPUT PARAMETERS');
  lines.push('Parameter,Value,Unit');
  lines.push(`Warehouse Area,${formatNumber(results.areas.totalArea, 0)},sq.ft`);
  lines.push(`Bay Length,${inputs.bayLength},ft`);
  lines.push(`Bay Width,${inputs.bayWidth},ft`);
  lines.push(`Levels,${inputs.levels},count`);
  lines.push(`Level Height,${inputs.levelHeight},ft`);
  lines.push(`Aisle Width,${inputs.aisleWidth},ft`);
  lines.push(`Aisle Type,${inputs.isVNA ? 'VNA' : 'Standard'},-`);
  lines.push('');
  
  // Results summary
  lines.push('CAPACITY RESULTS');
  lines.push('Metric,Value,Unit');
  lines.push(`Total Bays,${results.bayCount},count`);
  lines.push(`Total Rack CBM,${formatNumber(results.totalRackCBM)},CBM`);
  lines.push(`Mezzanine CBM,${formatNumber(results.mezzCBM)},CBM`);
  lines.push(`Total CBM,${formatNumber(results.totalCBM)},CBM`);
  lines.push(`Space Improvement,${formatNumber(results.spaceImprovementFactor)}x,factor`);
  lines.push(`Total Pallet Positions,${formatNumber(results.totalPalletPositions, 0)},count`);
  lines.push('');
  
  // BoQ
  lines.push('BILL OF QUANTITIES');
  lines.push('Item,Quantity,Description');
  Object.entries(results.boq).forEach(([key, item]) => {
    lines.push(`${key},${item.quantity},"${item.description}"`);
  });
  
  return lines.join('\n');
}

