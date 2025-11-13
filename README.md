# Warehouse Capacity Calculator

A comprehensive web application for calculating and visualizing warehouse storage capacity using HD pallet racks and mezzanine structures.

![Warehouse Calculator](https://img.shields.io/badge/Version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 Features

- **Accurate Capacity Calculations**: Compute total storage capacity in CBM with HD racks and mezzanine
- **Top-Down Visualization**: Interactive SVG layout showing exact rack placement and aisles
- **Standard vs VNA Comparison**: Compare different aisle configurations with one click
- **Bill of Quantities (BoQ)**: Auto-generated material lists with safety margins
- **Export Options**: CSV, SVG, PNG, and RFQ text formats
- **Real-Time Validation**: Input validation with helpful warnings and error messages
- **Interactive Charts**: Bar and pie charts for capacity breakdown
- **Guided Walkthrough**: Step-by-step tutorial for first-time users
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Calculation Formulas](#calculation-formulas)
- [Default Assumptions](#default-assumptions)
- [Testing](#testing)
- [Customization](#customization)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Step-by-Step Setup

1. **Clone or extract the project**

```bash
cd warehouse-capacity-calculator
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
npm start
```

## 📖 Usage Guide

### 1. Warehouse Dimensions

Start by entering your warehouse specifications:

- **Floor Area**: Total warehouse footprint (default: 108,000 sq.ft)
- **Length & Width** (Optional): For exact layout calculations using module method
- **Clear Height**: Warehouse ceiling height for validation (default: 45 ft)
- **Baseline CBM**: Current storage capacity without racking (default: 7,500 CBM)

💡 **Tip**: Providing length and width enables the module method for precise bay placement.

### 2. Rack Specifications

Configure your HD pallet rack system:

- **Bay Length**: Along the row, typically 8-12 ft (default: 9.5 ft)
- **Bay Width/Depth**: Perpendicular to row, typically 3-4 ft (default: 3.5 ft)
- **Level Height**: Vertical spacing between beams (default: 6 ft)
- **Number of Levels**: Total beam levels per rack (default: 7 levels = 42 ft tall)
- **Floor % for Racking**: Percentage of floor dedicated to storage (default: 60%)
- **Mezzanine Allocation**: Percentage of racking area for mezzanine (default: 30%)

### 3. Aisle Configuration

Configure two types of aisles for optimal flow:

#### Main Aisle (Longitudinal)
- Runs **parallel** to rack rows (along the bays)
- **Standard (10 ft)**: For reach trucks and counterbalance forklifts
- **VNA (6 ft)**: Very Narrow Aisle - requires specialized wire-guided equipment
- Used for picking operations within a row

#### Cross-Aisle (Transverse)
- Runs **perpendicular** to rack rows (between rows) - **shown as yellow lines in layout**
- Connects different rack rows for circulation
- Can be wider than main aisle for better traffic flow
- **Standard (10 ft)**: Matches main aisle
- **Custom (12-14 ft)**: Wider for two-way traffic or busier zones

**VNA Benefits**: 30-60% more storage capacity vs standard aisles  
**VNA Requirements**: Wire guidance systems, specialized turret trucks, operator training  
**Row Pitch**: Bay width + cross-aisle width (spacing between rack rows)

### 4. Review Results

The calculator automatically computes:

- **Total CBM**: Complete storage capacity
- **Bay Count**: Number of rack bays that fit in the layout
- **Pallet Positions**: Total storage locations
- **Space Improvement Factor**: Capacity gain compared to baseline
- **Bill of Quantities**: Required materials with safety margins

### 5. Export & Share

Export your design:

- **CSV**: Download complete BoQ with all quantities
- **Copy RFQ**: Copy formatted quote text to clipboard
- **SVG/PNG**: Save layout diagrams for presentations
- **PDF** (coming soon): Generate one-page summary

## 🧮 Calculation Formulas

### Area Calculations

```javascript
// If length and width provided:
area = length × width

// Otherwise use provided area
racking_area = area × (percent_racking / 100)
mezzanine_area = racking_area × (mezz_percent / 100)
hd_area = racking_area - mezzanine_area
```

### Bay Footprint and Module

```javascript
// Bay footprint
bay_footprint = bay_length × bay_width

// Module pattern (longitudinal) - runs along rack rows
module_length = (2 × bay_length) + small_gap + main_aisle_width

// Row pitch (transverse) - spacing between rack rows
row_pitch = bay_width + cross_aisle_width
// Note: Cross-aisle can be different from main aisle for optimized flow
```

### Bay Count - Module Method

```javascript
// When exact L×W provided
modules_per_row = floor(warehouse_length / module_length)
bays_per_row = modules_per_row × 2
number_of_rows = floor(warehouse_width / row_pitch)
total_bays = bays_per_row × number_of_rows
```

### Bay Count - Empirical Method

```javascript
// When using area-based calculation
effective_area_per_bay = bay_footprint × aisle_overhead_multiplier
bay_count = floor(hd_area / effective_area_per_bay)
```

### CBM Calculations

```javascript
// CBM per bay
volume_per_level_cuft = bay_length × bay_width × level_height
volume_per_bay_cuft = volume_per_level_cuft × levels
volume_per_bay_cbm = volume_per_bay_cuft / 35.3147

// Total rack CBM
total_rack_cbm = bay_count × volume_per_bay_cbm

// Mezzanine CBM
mezz_total_cuft = mezz_area × mezz_clear_height
mezz_total_cbm = mezz_total_cuft / 35.3147

// Grand total
total_cbm = baseline_cbm + total_rack_cbm + mezz_total_cbm
```

### Pallet Positions

```javascript
pallets_per_level = floor(bay_footprint / pallet_footprint)
// Minimum of 2 pallets per level if bay is too small
pallets_per_level = max(pallets_per_level, 2)

total_pallet_positions = bay_count × pallets_per_level × levels
```

### Derived Metrics

```javascript
sqft_per_cbm = area / total_cbm
space_improvement_factor = total_cbm / baseline_cbm
extra_cbm = total_cbm - baseline_cbm
```

## 🎛️ Default Assumptions

All defaults are overrideable in the UI:

| Parameter | Default Value | Notes |
|-----------|--------------|-------|
| Warehouse Area | 108,000 sq.ft | Can provide L×W instead |
| Clear Height | 45 ft | For validation |
| Baseline CBM | 7,500 CBM | Current capacity |
| Bay Length | 9.5 ft | Along row |
| Bay Width | 3.5 ft | Depth |
| Level Height | 6 ft | Vertical spacing |
| Levels | 7 | Total beam levels |
| Rack % | 60% | Floor for racking |
| Mezzanine % | 30% | Of racking area |
| Small Gap | 1.5 ft | Between paired bays |
| Main Aisle Width (Std) | 10 ft | Longitudinal (parallel to racks) |
| Main Aisle Width (VNA) | 6 ft | Wire-guided |
| Cross-Aisle Width (Std) | 10 ft | Transverse (between rows) |
| Cross-Aisle Width (VNA) | 6 ft | Between rows |
| Overhead Multiplier (Std) | 1.5 | Conservative factor |
| Overhead Multiplier (VNA) | 1.2 | VNA factor |
| Mezzanine Clear Height | 7.2 ft | Under deck |
| Pallet Footprint | 12.92 sq.ft | 1.2m × 1.0m |

### Conversion Constants

- **1 CBM** = 35.3147 cubic feet
- **Standard Pallet**: 1.2m × 1.0m ≈ 12.92 sq.ft

## 🧪 Testing

### Run Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The test suite covers:

- ✅ Area calculations (provided vs calculated)
- ✅ Bay count calculations (module and empirical methods)
- ✅ CBM calculations (rack and mezzanine)
- ✅ Pallet position calculations
- ✅ Validation logic (errors and warnings)
- ✅ BoQ generation with safety margins
- ✅ Full integration tests with defaults
- ✅ VNA vs Standard comparison
- ✅ Edge cases and error conditions

### Expected Test Results

With default inputs (108,000 sq.ft, 300×360 ft, 7 levels, 10 ft aisles):
- **Bay Count**: 468 bays (module method)
- **Total CBM**: ~29,971 CBM
- **Pallet Positions**: 6,552 positions

With VNA configuration (6 ft aisles):
- **Bay Count**: 814 bays (module method)
- **Total CBM**: ~36,000+ CBM
- **Improvement**: 74% more bays than standard

## 🎨 Customization

### Changing Default Values

Edit `pages/index.js` line 9-34 to modify default inputs:

```javascript
const [inputs, setInputs] = useState({
  warehouseArea: 108000,  // Change this
  bayLength: 9.5,         // Or this
  // ... other defaults
});
```

### Modifying Formulas

All calculation logic is in `lib/calculations.js`. Key functions:

- `calculateWarehouseCapacity()`: Main orchestrator
- `calculateBayCountModule()`: Module method
- `calculateBayCountEmpirical()`: Area-based method
- `calculateBoQ()`: Bill of quantities with safety margins

### Adjusting Safety Margins

In `lib/calculations.js`, function `calculateBoQ()`:

```javascript
const UPRIGHT_SAFETY = 1.05;  // 5% extra uprights
const BEAM_SAFETY = 1.08;     // 8% extra beams
const DECKING_SAFETY = 1.10;  // 10% extra decking
const ANCHOR_SAFETY = 1.05;   // 5% extra anchors
```

### Styling

- **Global styles**: `styles/globals.css`
- **Tailwind config**: `tailwind.config.js`
- **Color scheme**: Edit Tailwind theme in config

## 📊 Examples

### Example 1: Standard Configuration

**Inputs:**
- Warehouse: 108,000 sq.ft (300 ft × 360 ft)
- Bay: 9.5 ft × 3.5 ft, 7 levels @ 6 ft each
- Aisles: 10 ft (Standard)
- Racking: 60% floor, 30% mezzanine

**Results:**
- Bay Count: 468 bays
- Total CBM: ~29,971 CBM
- Pallet Positions: 6,552
- Space Improvement: 4.0x baseline
- Material: 493 upright pairs, 3,539 beam pairs

### Example 2: VNA Configuration

**Inputs:**
- Same warehouse: 108,000 sq.ft
- Same bays: 9.5 ft × 3.5 ft, 7 levels
- Aisles: 6 ft (VNA)
- Racking: 60% floor, 30% mezzanine

**Results:**
- Bay Count: 814 bays (74% more!)
- Total CBM: ~36,000+ CBM
- Pallet Positions: 11,396
- Space Improvement: 4.8x baseline
- Material: 856 upright pairs, 6,156 beam pairs

**VNA Advantage**: +346 bays, +4,844 pallet positions

### Example 3: Mezzanine-Heavy Design

**Inputs:**
- Warehouse: 108,000 sq.ft
- Bay: 9.5 ft × 3.5 ft, 5 levels @ 8 ft each
- Aisles: 10 ft
- Racking: 70% floor, 50% mezzanine

**Results:**
- More mezzanine area for pick zones
- Lower rack density, more staging
- Ideal for e-commerce operations

## 🔧 Troubleshooting

### Common Issues

**Issue**: Bay count is very low (< 5)
- **Solution**: Increase floor % for racking, reduce aisle width, or check bay dimensions

**Issue**: Rack height exceeds warehouse clear height
- **Solution**: Reduce number of levels or level height

**Issue**: Layout looks wrong in visualization
- **Solution**: Ensure length and width are provided for module method

**Issue**: VNA warning appears
- **Solution**: Confirm you have VNA equipment and training; acknowledge warning

**Issue**: Tests failing
- **Solution**: Ensure all dependencies installed: `npm install`

### Performance

For very large warehouses (> 500,000 sq.ft):
- Calculations remain fast (< 100ms)
- SVG rendering may slow with 2000+ bays
- Consider reducing visualization detail

## 📁 Project Structure

```
warehouse-capacity-calculator/
├── pages/
│   ├── _app.js           # Next.js app wrapper
│   ├── _document.js      # HTML document
│   └── index.js          # Main calculator page
├── components/
│   ├── InputPanel.js     # Input form with sections
│   ├── ResultsPanel.js   # Results display + BoQ
│   ├── TopDownVisualization.js  # SVG layout
│   ├── ChartsPanel.js    # Recharts bar/pie charts
│   └── WalkthroughModal.js  # Guided tour
├── lib/
│   └── calculations.js   # Core calculation logic
├── __tests__/
│   └── calculations.test.js  # Unit tests
├── styles/
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind CSS config
├── jest.config.js        # Jest test config
└── README.md            # This file
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts 2
- **Testing**: Jest + React Testing Library
- **Export**: jsPDF, html2canvas
- **Language**: JavaScript (ES6+)

## 📝 Formula Notes

### Module Method vs Empirical Method

**Module Method** (recommended when L×W known):
- Calculates exact bay placement using module pattern
- More accurate for rectangular warehouses
- Accounts for aisle configuration precisely

**Empirical Method** (when only area known):
- Uses overhead multiplier to estimate effective area per bay
- Faster but less precise
- Good for initial estimates

### BoQ Safety Margins

Material quantities include safety margins:
- **Uprights**: +5% for cuts and end conditions
- **Beams**: +8% for adjustments and spares
- **Decking**: +10% for cuts and damaged panels
- **Anchors**: +5% for extras and replacements

These margins are industry standard for racking projects.

## 🤝 Contributing

To modify or extend this calculator:

1. Fork the project
2. Create a feature branch
3. Make changes and add tests
4. Run test suite: `npm test`
5. Build and verify: `npm run build`
6. Submit pull request

## 📄 License

This project is provided as-is for warehouse planning purposes. Modify and use freely.

## 🙋 Support

For questions or issues:

1. Check this README
2. Review calculation formulas section
3. Run unit tests to verify behavior
4. Check browser console for errors

## 🎓 Glossary

- **CBM**: Cubic Meter (1 CBM = 35.3147 cu.ft)
- **HD Racks**: Heavy-Duty pallet racking systems
- **VNA**: Very Narrow Aisle (requires wire guidance)
- **Bay**: Single rack section between two upright frames
- **Level**: Horizontal beam pair at specific height
- **Module**: Pattern of 2 bays + small gap + aisle
- **Row Pitch**: Distance between parallel rack rows
- **BoQ**: Bill of Quantities (material list)

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Author**: Warehouse Capacity Calculator Team

Happy Planning! 🏗️📦

