import { useRef } from 'react';

export default function TopDownVisualization({ inputs, results }) {
  const svgRef = useRef(null);

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse-layout-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    if (!svgRef.current) return;
    
    // Create canvas from SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warehouse-layout-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Calculate layout dimensions
  const generateLayout = () => {
    const { warehouseLength, warehouseWidth, warehouseArea } = inputs;
    const { bayLength, bayWidth, smallGap, aisleWidth, crossAisleWidth } = inputs;
    
    // Use provided dimensions or calculate from area
    let length = warehouseLength;
    let width = warehouseWidth;
    
    if (!length || !width) {
      // Estimate dimensions from area (assume 1.5:1 ratio)
      length = Math.sqrt(warehouseArea * 1.5);
      width = warehouseArea / length;
    }
    
    // SVG viewport settings
    const viewBoxWidth = 800;
    const viewBoxHeight = 600;
    const padding = 40;
    
    // Calculate scale to fit warehouse in viewport
    const scaleX = (viewBoxWidth - 2 * padding) / length;
    const scaleY = (viewBoxHeight - 2 * padding) / width;
    const scale = Math.min(scaleX, scaleY);
    
    const warehouseScaledWidth = length * scale;
    const warehouseScaledHeight = width * scale;
    
    // Center the warehouse
    const offsetX = padding + (viewBoxWidth - 2 * padding - warehouseScaledWidth) / 2;
    const offsetY = padding + (viewBoxHeight - 2 * padding - warehouseScaledHeight) / 2;
    
    // Calculate bay layout
    const moduleLength = 2 * bayLength + smallGap + aisleWidth;
    const rowPitch = bayWidth + (crossAisleWidth || aisleWidth); // Use cross-aisle for row spacing
    
    const baysPerRow = Math.floor(length / moduleLength) * 2;
    const numberOfRows = Math.floor(width / rowPitch);
    
    // Generate bay positions
    const bays = [];
    for (let row = 0; row < numberOfRows; row++) {
      const rowY = row * rowPitch;
      const modulesInRow = Math.floor(length / moduleLength);
      
      for (let module = 0; module < modulesInRow; module++) {
        const moduleX = module * moduleLength;
        
        // First bay in module
        bays.push({
          x: moduleX,
          y: rowY,
          width: bayLength,
          height: bayWidth,
        });
        
        // Second bay in module (after small gap)
        bays.push({
          x: moduleX + bayLength + smallGap,
          y: rowY,
          width: bayLength,
          height: bayWidth,
        });
      }
    }
    
    return {
      viewBoxWidth,
      viewBoxHeight,
      warehouseScaledWidth,
      warehouseScaledHeight,
      offsetX,
      offsetY,
      scale,
      bays,
      baysPerRow,
      numberOfRows,
      rowPitch,
    };
  };

  const layout = generateLayout();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Top-Down Layout</h2>
          <p className="text-xs text-gray-600 mt-1">
            Visual representation of rack layout and aisles
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportSVG}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Export as SVG"
          >
            📄 SVG
          </button>
          <button
            onClick={handleExportPNG}
            className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Export as PNG"
          >
            🖼️ PNG
          </button>
        </div>
      </div>

      {/* Layout Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
        <div>
          <span className="text-gray-600">Bays per Row:</span>
          <span className="font-semibold ml-2">{layout.baysPerRow}</span>
        </div>
        <div>
          <span className="text-gray-600">Number of Rows:</span>
          <span className="font-semibold ml-2">{layout.numberOfRows}</span>
        </div>
        <div>
          <span className="text-gray-600">Total Bays:</span>
          <span className="font-semibold ml-2 text-blue-600">{results.bayCount}</span>
        </div>
        <div>
          <span className="text-gray-600">Row Pitch:</span>
          <span className="font-semibold ml-2 text-yellow-600">{layout.rowPitch.toFixed(1)} ft</span>
        </div>
      </div>
      
      {/* Cross-Aisle Info */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-900">
        <p className="font-semibold mb-1">🟡 Yellow Lines = Cross-Aisles (Between Rows)</p>
        <p>
          Cross-Aisle Width: <strong>{inputs.crossAisleWidth || inputs.aisleWidth} ft</strong> | 
          Row Pitch (center to center): <strong>{layout.rowPitch.toFixed(1)} ft</strong> = 
          Bay Width ({inputs.bayWidth} ft) + Cross-Aisle ({inputs.crossAisleWidth || inputs.aisleWidth} ft)
        </p>
      </div>

      {/* Mezzanine Info */}
      {results.areas.mezzArea > 0 && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
          <p className="font-semibold mb-1">🟣 Purple Dashed Area = Mezzanine</p>
          <p>
            Mezzanine Area: <strong>{Math.round(results.areas.mezzArea).toLocaleString()} sq.ft</strong> 
            {' '}({((results.areas.mezzArea / results.areas.totalArea) * 100).toFixed(1)}% of total floor) | 
            Levels: <strong>{inputs.mezzLevels}</strong> | 
            Clear Height: <strong>{inputs.mezzClearHeight} ft per level</strong>
          </p>
          <p className="mt-1 text-purple-700">
            Total Mezzanine CBM: <strong>{Math.round(results.mezzCBM).toLocaleString()} CBM</strong>
          </p>
        </div>
      )}

      {/* SVG Visualization */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for patterns and gradients */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Background grid */}
          <rect
            width={layout.viewBoxWidth}
            height={layout.viewBoxHeight}
            fill="url(#grid)"
          />
          
          {/* Warehouse outline */}
          <rect
            x={layout.offsetX}
            y={layout.offsetY}
            width={layout.warehouseScaledWidth}
            height={layout.warehouseScaledHeight}
            fill="#ffffff"
            stroke="#1f2937"
            strokeWidth="2"
            filter="url(#shadow)"
          />
          
          {/* Warehouse label */}
          <text
            x={layout.offsetX + layout.warehouseScaledWidth / 2}
            y={layout.offsetY - 10}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#1f2937"
          >
            Warehouse Floor Plan
          </text>
          
          {/* Mezzanine area (if applicable) */}
          {results.areas.mezzArea > 0 && (() => {
            // Calculate mezzanine dimensions proportionally
            const mezzAreaPercent = results.areas.mezzArea / results.areas.totalArea;
            const mezzScaledArea = layout.warehouseScaledWidth * layout.warehouseScaledHeight * mezzAreaPercent;
            
            // Assume mezzanine is roughly square or follows warehouse proportions
            const mezzScaledWidth = Math.sqrt(mezzScaledArea * (layout.warehouseScaledWidth / layout.warehouseScaledHeight));
            const mezzScaledHeight = mezzScaledArea / mezzScaledWidth;
            
            // Position in upper-left corner with some padding
            const mezzX = layout.offsetX + 20;
            const mezzY = layout.offsetY + 20;
            
            return (
              <g>
                <rect
                  x={mezzX}
                  y={mezzY}
                  width={mezzScaledWidth}
                  height={mezzScaledHeight}
                  fill="#9333ea"
                  fillOpacity="0.25"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text
                  x={mezzX + mezzScaledWidth / 2}
                  y={mezzY + mezzScaledHeight / 2}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#7c3aed"
                >
                  Mezzanine
                </text>
                <text
                  x={mezzX + mezzScaledWidth / 2}
                  y={mezzY + mezzScaledHeight / 2 + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#7c3aed"
                >
                  {Math.round(results.areas.mezzArea).toLocaleString()} sq.ft
                </text>
                <text
                  x={mezzX + mezzScaledWidth / 2}
                  y={mezzY + mezzScaledHeight / 2 + 26}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#7c3aed"
                >
                  {inputs.mezzLevels} Level{inputs.mezzLevels > 1 ? 's' : ''}
                </text>
              </g>
            );
          })()}
          
          {/* Rack bays */}
          {layout.bays.map((bay, idx) => {
            const scaledX = layout.offsetX + bay.x * layout.scale;
            const scaledY = layout.offsetY + bay.y * layout.scale;
            const scaledWidth = bay.width * layout.scale;
            const scaledHeight = bay.height * layout.scale;
            
            return (
              <g key={idx}>
                <rect
                  x={scaledX}
                  y={scaledY}
                  width={scaledWidth}
                  height={scaledHeight}
                  fill="#2563eb"
                  fillOpacity="0.7"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                >
                  <title>Bay {idx + 1}</title>
                </rect>
              </g>
            );
          })}
          
          {/* Legend */}
          <g transform={`translate(${layout.offsetX}, ${layout.offsetY + layout.warehouseScaledHeight + 20})`}>
            <rect x="0" y="0" width="15" height="15" fill="#2563eb" fillOpacity="0.7" stroke="#1e40af" strokeWidth="1"/>
            <text x="20" y="12" fontSize="10" fill="#1f2937">HD Rack Bay</text>
            
            {results.areas.mezzArea > 0 && (
              <>
                <rect x="120" y="0" width="15" height="15" fill="#9333ea" fillOpacity="0.25" stroke="#9333ea" strokeWidth="2" strokeDasharray="3,3"/>
                <text x="140" y="12" fontSize="10" fill="#1f2937">Mezzanine ({Math.round(results.areas.mezzArea).toLocaleString()} sq.ft, {inputs.mezzLevels}L)</text>
              </>
            )}
            
            <rect x="260" y="0" width="15" height="15" fill="#ffffff" stroke="#9ca3af" strokeWidth="1"/>
            <text x="280" y="12" fontSize="10" fill="#1f2937">Aisle Space</text>
          </g>
        </svg>
      </div>

      {/* Layout Notes */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Blue rectangles represent individual rack bays</p>
        {results.areas.mezzArea > 0 && (
          <p>• <span className="font-semibold text-purple-600">Purple dashed area</span> = Mezzanine ({Math.round(results.areas.mezzArea).toLocaleString()} sq.ft, {inputs.mezzLevels} level{inputs.mezzLevels > 1 ? 's' : ''})</p>
        )}
        <p>• White space along rows = Main aisles (longitudinal, parallel to bays)</p>
        <p>• White space between rows = Cross-aisles (transverse, perpendicular to bays) - <span className="font-semibold text-yellow-600">Row Pitch: {layout.rowPitch.toFixed(1)} ft</span></p>
        <p>• Layout is scaled to fit; actual proportions maintained</p>
        {inputs.isVNA && (
          <p className="text-yellow-700">⚠️ VNA configuration: Ensure proper equipment and training</p>
        )}
      </div>
    </div>
  );
}

