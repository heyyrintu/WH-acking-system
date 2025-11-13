# Quick Start Guide

Get up and running in 5 minutes! 🚀

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

## First Use

1. **See the Walkthrough**: On first visit, a guided tour will appear. Follow it!

2. **Use Default Values**: Click "Load Defaults" button to fill in standard values:
   - 108,000 sq.ft warehouse
   - 9.5×3.5 ft bay dimensions
   - 7 levels × 6 ft height
   - 10 ft standard aisles

3. **Adjust as Needed**: Modify inputs in the left panel

4. **View Results**: Right panel shows:
   - Total CBM and capacity metrics
   - Top-down layout visualization
   - Interactive charts
   - Bill of Quantities

## Quick Actions

### Compare Standard vs VNA

Click "Switch to VNA" button to see the difference:
- **Standard (10 ft aisles)**: ~468 bays
- **VNA (6 ft aisles)**: ~814 bays
- **Improvement**: 74% more capacity!

### Export Results

- **CSV**: Download complete BoQ spreadsheet
- **Copy RFQ**: Copy formatted quote to clipboard
- **SVG/PNG**: Save layout diagrams

## Common Scenarios

### Scenario 1: Standard Warehouse

```
Warehouse: 108,000 sq.ft
Bays: 9.5×3.5 ft, 7 levels
Aisles: 10 ft
Result: ~468 bays, 29,971 CBM
```

### Scenario 2: VNA Warehouse

```
Warehouse: 108,000 sq.ft
Bays: 9.5×3.5 ft, 7 levels
Aisles: 6 ft (VNA)
Result: ~814 bays, 36,000+ CBM
```

### Scenario 3: With Mezzanine

```
Warehouse: 108,000 sq.ft
Racks: 60% floor
Mezzanine: 30% of racking area
Result: HD racks + mezzanine storage
```

## Tips

✅ **Provide Length & Width** for exact layout calculations  
✅ **Watch for Validation Warnings** - they help optimize your design  
✅ **Use VNA** if you have the equipment - massive capacity gains  
✅ **Export CSV** to share BoQ with suppliers  
✅ **Compare Configurations** by adjusting inputs and exporting results  

## Need Help?

- Click "Help" button in app for the walkthrough
- Read full README.md for detailed documentation
- Run `npm test` to verify calculations

## Next Steps

1. ✅ Get familiar with default configuration
2. ✅ Input your actual warehouse dimensions
3. ✅ Adjust rack specifications to match your needs
4. ✅ Compare Standard vs VNA configurations
5. ✅ Export BoQ for procurement
6. ✅ Save layout diagrams for planning

Happy Planning! 🏗️

