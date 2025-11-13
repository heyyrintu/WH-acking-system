# Changelog

All notable changes to the Warehouse Capacity Calculator will be documented in this file.

## [1.0.0] - 2025-11-13

### 🎉 Initial Release

#### Features

- **Core Calculations**
  - Area-based warehouse capacity calculations
  - Module method for exact bay placement (when L×W provided)
  - Empirical method for quick estimates
  - Support for HD pallet racks with multiple levels
  - Mezzanine storage capacity calculations
  - Pallet position counting

- **User Interface**
  - Clean, modern single-page application
  - Collapsible input sections (Warehouse, Racks, Aisles, Mezzanine, Advanced)
  - Real-time calculation updates
  - Responsive design (desktop, tablet, mobile)
  - Interactive guided walkthrough for first-time users

- **Visualizations**
  - Top-down SVG layout with color-coded areas
  - Bar chart for CBM comparison (Baseline vs Rack vs Mezzanine vs Total)
  - Pie chart for floor area allocation
  - Key insights panel with derived metrics

- **Aisle Configurations**
  - Standard reach truck configuration (10 ft aisles)
  - VNA (Very Narrow Aisle) configuration (6 ft aisles)
  - One-click toggle to compare Standard vs VNA
  - Custom aisle width support (6-12 ft)

- **Validation & Safety**
  - Real-time input validation
  - Rack height vs warehouse clear height checking
  - VNA safety warnings
  - Minimum bay count warnings
  - Mezzanine clear height recommendations

- **Bill of Quantities (BoQ)**
  - Auto-generated material lists
  - Upright pairs, beam pairs, decking panels
  - Anchor bolts, row spacers, column protectors
  - Safety margins included (5-10% extra)

- **Export Options**
  - CSV export for BoQ and capacity summary
  - SVG export for layout diagrams
  - PNG export for layout diagrams
  - Copy RFQ to clipboard (formatted text)

- **Testing**
  - Comprehensive unit test suite with Jest
  - 13 test suites covering all calculation functions
  - Integration tests with default values
  - Edge case testing
  - Expected results validation for Standard vs VNA

#### Technical Stack

- Next.js 14 (React 18)
- Tailwind CSS 3 for styling
- Recharts 2 for data visualization
- jsPDF and html2canvas for PDF export
- Jest and React Testing Library for testing

#### Documentation

- Comprehensive README with all formulas
- Quick Start Guide
- Detailed examples (Standard, VNA, E-Commerce, Cold Storage)
- Deployment guide for multiple platforms
- Inline code documentation

#### Calculations Implemented

```
✅ Area calculations (from L×W or total area)
✅ Bay footprint and module dimensions
✅ Bay count (module method and empirical)
✅ CBM per bay and total rack CBM
✅ Mezzanine CBM
✅ Pallet positions
✅ Space improvement factor
✅ BoQ with safety margins
✅ Validation rules
```

#### Default Values

- Warehouse: 108,000 sq.ft (configurable)
- Bay: 9.5 ft × 3.5 ft
- Levels: 7 @ 6 ft height (42 ft total)
- Aisles: 10 ft (Standard) or 6 ft (VNA)
- Racking: 60% of floor
- Mezzanine: 30% of racking area

#### Known Limitations

- PDF export: Basic functionality (CSV available)
- Client-side only (no backend/database)
- Single warehouse calculation at a time
- No project saving/loading (export/import via CSV)

### Expected Test Results

With default configuration (108k sqft, 300×360 ft, 10 ft aisles):
- **Bay Count**: 468 bays
- **Total CBM**: ~29,971 CBM
- **Pallet Positions**: 6,552

With VNA configuration (6 ft aisles):
- **Bay Count**: 814 bays (+74%)
- **Total CBM**: ~36,700 CBM
- **Pallet Positions**: 11,396

## [Future Enhancements]

### Planned Features

- [ ] Multi-project management with save/load
- [ ] PDF export with custom branding
- [ ] 3D visualization of rack layout
- [ ] Cost estimation per configuration
- [ ] Database backend for project storage
- [ ] User authentication and accounts
- [ ] Sharing via unique URLs
- [ ] Mobile app (React Native)
- [ ] Advanced rack types (drive-in, push-back, pallet flow)
- [ ] Integration with ERP systems
- [ ] Real-time collaboration
- [ ] Template library for common warehouse types
- [ ] Optimization suggestions based on AI
- [ ] Equipment requirement calculator
- [ ] Labor requirement estimator

### Potential Improvements

- [ ] Drag-and-drop layout editor
- [ ] Import from CAD files
- [ ] Export to AutoCAD/Revit
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline PWA support
- [ ] Advanced reporting and analytics
- [ ] Comparison mode (multiple configurations)
- [ ] Historical version tracking
- [ ] API for integrations

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-11-13 | Initial release with full feature set |

## Migration Guide

N/A - Initial release

## Breaking Changes

N/A - Initial release

---

**Maintained by**: Warehouse Capacity Calculator Team  
**License**: MIT (or as specified)  
**Repository**: [GitHub URL]

For feature requests or bug reports, please open an issue on GitHub.

