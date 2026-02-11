/**
 * Unit tests for warehouse capacity calculations
 * Testing core formulas and edge cases
 */

import {
  calculateArea,
  calculateAreas,
  calculateBayDimensions,
  calculateModule,
  calculateBayCountModule,
  calculateBayCountEmpirical,
  calculateBayCBM,
  calculateRackCBM,
  calculateMezzanineCBM,
  calculatePalletPositions,
  calculateDerivedMetrics,
  calculateWarehouseCapacity,
  calculateBoQ,
  CBM_TO_CUFT,
} from '../lib/calculations';

describe('Warehouse Capacity Calculator - Core Functions', () => {
  
  // Test 1: Area calculations
  describe('calculateArea', () => {
    test('should calculate area from length and width', () => {
      const inputs = {
        warehouseLength: 300,
        warehouseWidth: 360,
        warehouseArea: 100000 // Should be ignored
      };
      expect(calculateArea(inputs)).toBe(108000);
    });

    test('should use provided area when length/width not given', () => {
      const inputs = {
        warehouseLength: 0,
        warehouseWidth: 0,
        warehouseArea: 108000
      };
      expect(calculateArea(inputs)).toBe(108000);
    });
  });

  // Test 2: Area allocations
  describe('calculateAreas', () => {
    test('should correctly split areas by percentages', () => {
      const result = calculateAreas(108000, 60, 30);
      
      expect(result.totalArea).toBe(108000);
      expect(result.rackingArea).toBe(64800); // 60% of 108000
      expect(result.mezzArea).toBe(19440); // 30% of 64800
      expect(result.hdArea).toBe(45360); // 64800 - 19440
      expect(result.stagingArea).toBe(43200); // 108000 - 64800
    });

    test('should correctly use direct area input mode', () => {
      const result = calculateAreas(108000, 60, 30, true, 50000, 20000);
      
      expect(result.totalArea).toBe(108000);
      expect(result.hdArea).toBe(50000); // Direct input
      expect(result.mezzArea).toBe(20000); // Direct input
      expect(result.rackingArea).toBe(70000); // 50000 + 20000
      expect(result.stagingArea).toBe(38000); // 108000 - 70000
      expect(result.useDirectAreaInput).toBe(true);
    });

    test('should handle overflow in direct area input mode', () => {
      const result = calculateAreas(100000, 60, 30, true, 80000, 40000);
      
      expect(result.hdArea).toBe(80000);
      expect(result.mezzArea).toBe(40000);
      expect(result.rackingArea).toBe(120000); // Exceeds total
      expect(result.stagingArea).toBe(0); // Should not go negative
    });
  });

  // Test 3: Bay dimensions
  describe('calculateBayDimensions', () => {
    test('should calculate bay footprint and rack height', () => {
      const result = calculateBayDimensions(9.5, 3.5, 6, 7);
      
      expect(result.bayFootprint).toBe(33.25); // 9.5 * 3.5
      expect(result.totalRackHeight).toBe(42); // 6 * 7
      expect(result.volumePerLevelCuft).toBe(199.5); // 9.5 * 3.5 * 6
    });
  });

  // Test 4: Module calculations
  describe('calculateModule', () => {
    test('should calculate module length correctly', () => {
      const moduleLength = calculateModule(9.5, 1.5, 10);
      // Module = 2 * bayLength + smallGap + aisleWidth
      // Module = 2 * 9.5 + 1.5 + 10 = 30.5
      expect(moduleLength).toBe(30.5);
    });

    test('should work with VNA aisle width', () => {
      const moduleLength = calculateModule(9.5, 1.5, 6);
      // Module = 2 * 9.5 + 1.5 + 6 = 26.5
      expect(moduleLength).toBe(26.5);
    });
  });

  // Test 5: Bay count with module method
  describe('calculateBayCountModule', () => {
    test('should calculate correct bay count for standard aisles', () => {
      const result = calculateBayCountModule(300, 360, 9.5, 3.5, 1.5, 10);
      
      // Module length = 30.5 ft
      // Modules per row = floor(300 / 30.5) = 9
      // Bays per row = 9 * 2 = 18
      // Row pitch = 3.5 + 10 = 13.5 ft
      // Number of rows = floor(360 / 13.5) = 26
      // Total bays = 18 * 26 = 468
      
      expect(result.baysPerRow).toBe(18);
      expect(result.numberOfRows).toBe(26);
      expect(result.totalBays).toBe(468);
    });

    test('should calculate higher bay count for VNA aisles', () => {
      const result = calculateBayCountModule(300, 360, 9.5, 3.5, 1.5, 6);
      
      // Module length = 26.5 ft
      // Modules per row = floor(300 / 26.5) = 11
      // Bays per row = 11 * 2 = 22
      // Row pitch = 3.5 + 6 = 9.5 ft
      // Number of rows = floor(360 / 9.5) = 37
      // Total bays = 22 * 37 = 814
      
      expect(result.baysPerRow).toBe(22);
      expect(result.numberOfRows).toBe(37);
      expect(result.totalBays).toBe(814);
    });
  });

  // Test 6: Bay count with empirical method
  describe('calculateBayCountEmpirical', () => {
    test('should calculate bay count using area and multiplier', () => {
      const hdArea = 45360; // from earlier test
      const bayFootprint = 33.25; // 9.5 * 3.5
      const multiplier = 1.5;
      
      const result = calculateBayCountEmpirical(hdArea, bayFootprint, multiplier);
      
      // Effective area per bay = 33.25 * 1.5 = 49.875
      // Bay count = floor(45360 / 49.875) = 909
      
      expect(result.effectiveAreaPerBay).toBe(49.875);
      expect(result.bayCount).toBe(909);
    });

    test('should give higher bay count with VNA multiplier', () => {
      const hdArea = 45360;
      const bayFootprint = 33.25;
      const multiplier = 1.2; // VNA
      
      const result = calculateBayCountEmpirical(hdArea, bayFootprint, multiplier);
      
      // Effective area per bay = 33.25 * 1.2 = 39.9
      // Bay count = floor(45360 / 39.9) = 1136
      
      expect(result.effectiveAreaPerBay).toBe(39.9);
      expect(result.bayCount).toBe(1136);
    });
  });

  // Test 7: CBM calculations
  describe('calculateBayCBM', () => {
    test('should calculate CBM per bay correctly', () => {
      const result = calculateBayCBM(9.5, 3.5, 6, 7);
      
      // Volume per level = 9.5 * 3.5 * 6 = 199.5 cuft
      // Volume per bay = 199.5 * 7 = 1396.5 cuft
      // Volume per bay CBM = 1396.5 / 35.3147 = 39.546 CBM
      
      expect(result.volumePerLevelCuft).toBe(199.5);
      expect(result.volumePerBayCuft).toBe(1396.5);
      expect(result.volumePerBayCBM).toBeCloseTo(39.546, 2);
    });
  });

  // Test 8: Mezzanine CBM
  describe('calculateMezzanineCBM', () => {
    test('should calculate mezzanine CBM correctly with 1 level', () => {
      const mezzArea = 19440; // from earlier test
      const mezzClearHeight = 7.2;
      const mezzLevels = 1;
      
      const result = calculateMezzanineCBM(mezzArea, mezzClearHeight, mezzLevels);
      
      // Mezzanine cuft = 19440 * 7.2 * 1 = 139968 cuft
      // Mezzanine CBM = 139968 / 35.3147 = 3963.55 CBM
      
      expect(result.mezzTotalCuft).toBe(139968);
      expect(result.mezzTotalCBM).toBeCloseTo(3963.55, 1);
      expect(result.mezzLevels).toBe(1);
    });

    test('should calculate mezzanine CBM correctly with multiple levels', () => {
      const mezzArea = 10000;
      const mezzClearHeight = 8;
      const mezzLevels = 2;
      
      const result = calculateMezzanineCBM(mezzArea, mezzClearHeight, mezzLevels);
      
      // Mezzanine cuft = 10000 * 8 * 2 = 160000 cuft
      // Mezzanine CBM = 160000 / 35.3147 = 4530.74 CBM
      
      expect(result.mezzTotalCuft).toBe(160000);
      expect(result.mezzTotalCBM).toBeCloseTo(4530.74, 1);
      expect(result.mezzLevels).toBe(2);
    });
  });

  // Test 9: Pallet positions
  describe('calculatePalletPositions', () => {
    test('should calculate pallet positions correctly', () => {
      const bayFootprint = 33.25; // 9.5 * 3.5
      const palletFootprint = 12.92;
      const levels = 7;
      const bayCount = 468;
      
      const result = calculatePalletPositions(bayFootprint, palletFootprint, levels, bayCount);
      
      // Pallets per level = floor(33.25 / 12.92) = 2
      // Total positions = 468 * 2 * 7 = 6552
      
      expect(result.palletsPerLevel).toBe(2);
      expect(result.totalPalletPositions).toBe(6552);
    });

    test('should use override when provided', () => {
      const result = calculatePalletPositions(33.25, 12.92, 7, 468, 3);
      
      expect(result.palletsPerLevel).toBe(3);
      expect(result.totalPalletPositions).toBe(9828); // 468 * 3 * 7
    });
  });

  // Test 10: Derived metrics
  describe('calculateDerivedMetrics', () => {
    test('should calculate improvement metrics correctly', () => {
      const totalArea = 108000;
      const totalCBM = 40000;
      const baselineCBM = 7500;
      
      const result = calculateDerivedMetrics(totalArea, totalCBM, baselineCBM);
      
      // sqftPerCBM = 108000 / 40000 = 2.7
      // spaceImprovementFactor = 40000 / 7500 = 5.333
      // extraCBM = 40000 - 7500 = 32500
      
      expect(result.sqftPerCBM).toBeCloseTo(2.7, 1);
      expect(result.spaceImprovementFactor).toBeCloseTo(5.333, 2);
      expect(result.extraCBM).toBe(32500);
    });
  });

  // Test 11: BoQ calculations
  describe('calculateBoQ', () => {
    test('should generate correct BoQ with safety margins', () => {
      const bayCount = 468;
      const levels = 7;
      const bayLength = 9.5;
      const bayWidth = 3.5;
      
      const result = calculateBoQ(bayCount, levels, bayLength, bayWidth);
      
      // Uprights: (468 + 1) * 1.05 = 492.45 -> 493
      // Beam pairs: 468 * 7 * 1.08 = 3538.32 -> 3539
      // Decking: 468 * 7 * 1.10 = 3603.6 -> 3604
      // Anchors: 493 * 4 * 1.05 = 2070.6 -> 2071
      
      expect(result.uprightPairs.quantity).toBe(493);
      expect(result.beamPairs.quantity).toBe(3539);
      expect(result.deckingPanels.quantity).toBe(3604);
      expect(result.anchorBolts.quantity).toBe(2071);
      expect(result.rowSpacers.quantity).toBe(936); // 468 * 2
    });
  });

  // Test 12: Full integration test with defaults
  describe('calculateWarehouseCapacity - Integration Tests', () => {
    test('should produce correct results with default inputs (standard aisles, module method)', () => {
      const inputs = {
        warehouseLength: 300,
        warehouseWidth: 360,
        warehouseArea: 108000,
        warehouseClearHeight: 45,
        baselineCBM: 7500,
        bayLength: 9.5,
        bayWidth: 3.5,
        levelHeight: 6,
        levels: 7,
        percentRacking: 60,
        mezzPercent: 30,
        smallGap: 1.5,
        aisleWidth: 10,
        isVNA: false,
        aisleOverheadMultiplier: 1.5,
        palletFootprint: 12.92,
        palletsPerLevelOverride: null,
        mezzClearHeight: 7.2,
        mezzLevels: 1,
        useModuleMethod: true
      };

      const result = calculateWarehouseCapacity(inputs);

      // Expected bay count with module method: 468 (from earlier test)
      expect(result.bayCount).toBe(468);
      
      // Expected total rack CBM: 468 * 39.546 = 18507.528
      expect(result.totalRackCBM).toBeCloseTo(18507.5, 0);
      
      // Expected mezzanine CBM: ~3963.55
      expect(result.mezzCBM).toBeCloseTo(3963.5, 0);
      
      // Expected total CBM: 7500 + 18507.5 + 3963.5 = 29971
      expect(result.totalCBM).toBeCloseTo(29971, 0);
      
      // Expected pallet positions: 6552
      expect(result.totalPalletPositions).toBe(6552);
      
      // Should have valid validation
      expect(result.validation).toBeDefined();
      expect(result.validation.errors).toHaveLength(0);
    });

    test('should produce higher bay count with VNA configuration', () => {
      const inputs = {
        warehouseLength: 300,
        warehouseWidth: 360,
        warehouseArea: 108000,
        warehouseClearHeight: 45,
        baselineCBM: 7500,
        bayLength: 9.5,
        bayWidth: 3.5,
        levelHeight: 6,
        levels: 7,
        percentRacking: 60,
        mezzPercent: 30,
        smallGap: 1.5,
        aisleWidth: 6, // VNA
        isVNA: true,
        aisleOverheadMultiplier: 1.2, // VNA
        palletFootprint: 12.92,
        palletsPerLevelOverride: null,
        mezzClearHeight: 7.2,
        mezzLevels: 1,
        useModuleMethod: true
      };

      const result = calculateWarehouseCapacity(inputs);

      // Expected bay count with VNA: 814 (from earlier test)
      expect(result.bayCount).toBe(814);
      
      // VNA should give significantly more capacity
      expect(result.bayCount).toBeGreaterThan(468);
      
      // Should have VNA warning
      expect(result.validation.warnings.length).toBeGreaterThan(0);
    });

    test('should handle validation errors when rack height exceeds warehouse height', () => {
      const inputs = {
        warehouseLength: 300,
        warehouseWidth: 360,
        warehouseArea: 108000,
        warehouseClearHeight: 30, // Too low!
        baselineCBM: 7500,
        bayLength: 9.5,
        bayWidth: 3.5,
        levelHeight: 6,
        levels: 7, // 7 * 6 = 42 ft > 30 ft
        percentRacking: 60,
        mezzPercent: 30,
        smallGap: 1.5,
        aisleWidth: 10,
        isVNA: false,
        aisleOverheadMultiplier: 1.5,
        palletFootprint: 12.92,
        palletsPerLevelOverride: null,
        mezzClearHeight: 7.2,
        mezzLevels: 1,
        useModuleMethod: true
      };

      const result = calculateWarehouseCapacity(inputs);

      // Should have validation error
      expect(result.validation.errors.length).toBeGreaterThan(0);
      expect(result.validation.errors[0].field).toBe('levels');
    });
  });

  // Test 13: Edge cases
  describe('Edge Cases', () => {
    test('should handle zero mezzanine percentage', () => {
      const inputs = {
        warehouseLength: 300,
        warehouseWidth: 360,
        warehouseArea: 108000,
        warehouseClearHeight: 45,
        baselineCBM: 7500,
        bayLength: 9.5,
        bayWidth: 3.5,
        levelHeight: 6,
        levels: 7,
        percentRacking: 60,
        mezzPercent: 0, // No mezzanine
        smallGap: 1.5,
        aisleWidth: 10,
        isVNA: false,
        aisleOverheadMultiplier: 1.5,
        palletFootprint: 12.92,
        palletsPerLevelOverride: null,
        mezzClearHeight: 7.2,
        mezzLevels: 1,
        useModuleMethod: true
      };

      const result = calculateWarehouseCapacity(inputs);

      expect(result.mezzCBM).toBe(0);
      expect(result.areas.mezzArea).toBe(0);
    });

    test('should handle minimum bay count warning', () => {
      const inputs = {
        warehouseLength: 50,
        warehouseWidth: 50,
        warehouseArea: 2500,
        warehouseClearHeight: 45,
        baselineCBM: 100,
        bayLength: 9.5,
        bayWidth: 3.5,
        levelHeight: 6,
        levels: 7,
        percentRacking: 60,
        mezzPercent: 30,
        smallGap: 1.5,
        aisleWidth: 10,
        isVNA: false,
        aisleOverheadMultiplier: 1.5,
        palletFootprint: 12.92,
        palletsPerLevelOverride: null,
        mezzClearHeight: 7.2,
        mezzLevels: 1,
        useModuleMethod: true
      };

      const result = calculateWarehouseCapacity(inputs);

      // Small warehouse should trigger warning
      expect(result.bayCount).toBeLessThan(10);
      expect(result.validation.warnings.length).toBeGreaterThan(0);
    });
  });
});

