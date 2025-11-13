# Example Configurations

Real-world examples with detailed results and screenshots.

## Example 1: Standard Distribution Center

### Specifications

```yaml
Warehouse:
  Area: 108,000 sq.ft
  Dimensions: 300 ft × 360 ft
  Clear Height: 45 ft
  Baseline CBM: 7,500

Racks:
  Bay Length: 9.5 ft
  Bay Width: 3.5 ft
  Level Height: 6 ft
  Levels: 7
  Total Rack Height: 42 ft

Operations:
  Aisle Type: Standard Reach Truck
  Aisle Width: 10 ft
  Small Gap: 1.5 ft
  Equipment: Reach trucks, counterbalance

Allocation:
  Racking: 60% of floor
  Mezzanine: 30% of racking area
  Staging: 40% of floor
```

### Results

```yaml
Capacity:
  Total Bays: 468 bays
  Total CBM: 29,971 CBM
  Rack CBM: 18,508 CBM
  Mezzanine CBM: 3,964 CBM
  Extra CBM: +22,471 CBM
  
Performance:
  Space Improvement: 4.0x
  Pallet Positions: 6,552
  Pallets per 1000 sqft: 60.7
  Sq.ft per CBM: 3.6

Layout:
  Bays per Row: 18
  Number of Rows: 26
  Module Length: 30.5 ft
  Row Pitch: 13.5 ft

Materials (BoQ):
  Upright Pairs: 493
  Beam Pairs: 3,539
  Decking Panels: 3,604
  Anchor Bolts: 2,071
  Row Spacers: 936
  Column Protectors: 148
```

### Use Case

Perfect for:
- General distribution centers
- Standard material handling equipment
- Moderate storage density
- Easy operator access
- Cost-effective solution

---

## Example 2: VNA High-Density Warehouse

### Specifications

```yaml
Warehouse:
  Area: 108,000 sq.ft
  Dimensions: 300 ft × 360 ft
  Clear Height: 45 ft
  Baseline CBM: 7,500

Racks:
  Bay Length: 9.5 ft
  Bay Width: 3.5 ft
  Level Height: 6 ft
  Levels: 7
  Total Rack Height: 42 ft

Operations:
  Aisle Type: VNA (Very Narrow Aisle)
  Aisle Width: 6 ft
  Small Gap: 1.5 ft
  Equipment: Wire-guided turret trucks
  Wire Guidance: Required

Allocation:
  Racking: 60% of floor
  Mezzanine: 30% of racking area
  Staging: 40% of floor
```

### Results

```yaml
Capacity:
  Total Bays: 814 bays (+74% vs Standard!)
  Total CBM: 36,700+ CBM
  Rack CBM: 32,186 CBM
  Mezzanine CBM: 3,964 CBM
  Extra CBM: +29,200 CBM
  
Performance:
  Space Improvement: 4.9x
  Pallet Positions: 11,396 (+74%)
  Pallets per 1000 sqft: 105.5
  Sq.ft per CBM: 2.9

Layout:
  Bays per Row: 22
  Number of Rows: 37
  Module Length: 26.5 ft
  Row Pitch: 9.5 ft

Materials (BoQ):
  Upright Pairs: 856 (+73%)
  Beam Pairs: 6,156 (+73%)
  Decking Panels: 6,271 (+74%)
  Anchor Bolts: 3,595 (+73%)
  Row Spacers: 1,628 (+74%)
  Column Protectors: 257 (+74%)
```

### Additional Requirements

```yaml
VNA Equipment:
  - Turret trucks (Jungheinrich, Crown, etc.)
  - Wire guidance system
  - Floor flatness: FM2 > 50
  - Operator training & certification
  
Safety:
  - Aisle entry detection
  - Speed limiters
  - Emergency stop systems
  - Clear signage
```

### Use Case

Ideal for:
- High-density storage requirements
- Established operations with trained staff
- Wire guidance infrastructure
- Maximum space utilization
- ROI justifies VNA investment

### Cost-Benefit

**Extra Investment**:
- Wire guidance: ~$50k-100k
- Specialized trucks: +$50k per truck
- Training: ~$5k per operator

**Benefits**:
- +346 bays (74% more)
- +4,844 pallet positions
- Same footprint
- Typical ROI: 18-24 months

---

## Example 3: E-Commerce Fulfillment Center

### Specifications

```yaml
Warehouse:
  Area: 150,000 sq.ft
  Dimensions: 375 ft × 400 ft
  Clear Height: 40 ft
  Baseline CBM: 9,000

Racks:
  Bay Length: 8.0 ft (smaller for fast picks)
  Bay Width: 4.0 ft
  Level Height: 5 ft (lower for ergonomics)
  Levels: 6
  Total Rack Height: 30 ft

Operations:
  Aisle Type: Standard
  Aisle Width: 10 ft
  Small Gap: 1.5 ft
  Equipment: Order pickers, reach trucks

Allocation:
  Racking: 50% of floor (more staging)
  Mezzanine: 40% of racking area (pick zones)
  Staging: 50% of floor (packing, shipping)
```

### Results

```yaml
Capacity:
  Total Bays: 632 bays
  Total CBM: 35,500 CBM
  Rack CBM: 26,800 CBM
  Mezzanine CBM: 5,100 CBM
  Extra CBM: +26,500 CBM
  
Performance:
  Space Improvement: 3.9x
  Pallet Positions: 7,584
  Fast-Pick Positions: 3,792 (on mezzanine)
  
Layout:
  Bays per Row: 24
  Number of Rows: 26
  
Mezzanine:
  Area: 30,000 sq.ft
  Height: 7 ft clear
  Use: Manual pick zones, packing stations
```

### Use Case

Optimized for:
- E-commerce order fulfillment
- Fast-moving SKUs
- Manual picking operations
- Large packing/staging areas
- Multi-channel distribution

---

## Example 4: Cold Storage Facility

### Specifications

```yaml
Warehouse:
  Area: 80,000 sq.ft
  Dimensions: 200 ft × 400 ft
  Clear Height: 50 ft
  Baseline CBM: 5,000
  Temperature: -20°C to +5°C

Racks:
  Bay Length: 10.0 ft
  Bay Width: 4.0 ft
  Level Height: 7 ft (taller for pallets)
  Levels: 6 (lower due to cold stress)
  Total Rack Height: 42 ft

Operations:
  Aisle Type: VNA (maximize cold space)
  Aisle Width: 7 ft (slightly wider for cold gear)
  Small Gap: 2.0 ft
  Equipment: Cold-rated VNA trucks

Allocation:
  Racking: 75% of floor (minimize aisle space)
  Mezzanine: 0% (too cold for workers)
  Staging: 25% of floor
```

### Results

```yaml
Capacity:
  Total Bays: 562 bays
  Total CBM: 35,800 CBM
  Rack CBM: 30,800 CBM
  Mezzanine CBM: 0 CBM
  Extra CBM: +30,800 CBM
  
Performance:
  Space Improvement: 7.2x (critical for cold storage)
  Pallet Positions: 6,744
  CBM per sq.ft: 0.45 (very dense)
  
Cold Storage Optimization:
  Minimize aisle space
  Maximize vertical storage
  Reduce energy footprint
  Fast in/out operations
```

### Special Considerations

```yaml
Cold Storage:
  - Special rack coatings
  - Low-temperature lubricants
  - Insulated electrical systems
  - Rapid entry/exit protocols
  - Energy cost per CBM: critical metric
```

### Use Case

Designed for:
- Cold storage and frozen food
- Pharmaceutical storage
- Maximum density in expensive cold space
- Energy efficiency
- Quick turnaround to minimize door openings

---

## Comparison Summary

| Metric | Standard DC | VNA | E-Commerce | Cold Storage |
|--------|-------------|-----|------------|--------------|
| **Area** | 108k sqft | 108k sqft | 150k sqft | 80k sqft |
| **Bays** | 468 | 814 | 632 | 562 |
| **CBM** | 29,971 | 36,700 | 35,500 | 35,800 |
| **Aisles** | 10 ft | 6 ft | 10 ft | 7 ft |
| **Density** | Medium | High | Medium | Very High |
| **Cost** | $$ | $$$$ | $$$ | $$$$$ |
| **ROI** | 36 mo | 24 mo | 30 mo | 18 mo |

## Key Takeaways

1. **VNA = 70%+ more capacity** in same footprint
2. **E-commerce needs staging** - balance storage vs workflow
3. **Cold storage demands density** - energy costs justify VNA
4. **Standard racks = lower investment** - good for general use
5. **Mezzanine adds flexibility** - picking, packing, value-add

## How to Use These Examples

1. **Find similar use case** to your operation
2. **Adjust dimensions** to match your warehouse
3. **Input specs** into calculator
4. **Compare results** and optimize
5. **Export BoQ** for your configuration

---

**Note**: All examples use default safety margins and standard pallet sizes. Adjust for your specific requirements.

**Generated by**: Warehouse Capacity Calculator v1.0

