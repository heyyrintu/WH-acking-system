import { formatNumber, exportToCSV } from '../lib/calculations';

export default function ResultsPanel({ results, inputs }) {
  const handleDownloadCSV = () => {
    const csv = exportToCSV(results, inputs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse-capacity-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyRFQ = () => {
    const rfqText = generateRFQText();
    navigator.clipboard.writeText(rfqText).then(() => {
      alert('RFQ copied to clipboard!');
    });
  };

  const generateRFQText = () => {
    const lines = [];
    lines.push('WAREHOUSE RACKING SYSTEM - REQUEST FOR QUOTATION');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push('PROJECT SPECIFICATIONS:');
    lines.push(`Warehouse Area: ${formatNumber(results.areas.totalArea, 0)} sq.ft`);
    lines.push(`Total Rack Bays: ${results.bayCount} bays`);
    lines.push(`Rack Levels: ${inputs.levels} levels`);
    lines.push(`Bay Dimensions: ${inputs.bayLength} ft × ${inputs.bayWidth} ft`);
    lines.push(`Total Rack Height: ${results.totalRackHeight} ft`);
    lines.push('');
    lines.push('BILL OF QUANTITIES:');
    Object.entries(results.boq).forEach(([key, item]) => {
      lines.push(`${item.quantity}x ${item.description}`);
    });
    lines.push('');
    lines.push('CAPACITY SUMMARY:');
    lines.push(`Total Storage Capacity: ${formatNumber(results.totalCBM)} CBM`);
    lines.push(`Total Pallet Positions: ${formatNumber(results.totalPalletPositions, 0)}`);
    lines.push(`Space Improvement: ${formatNumber(results.spaceImprovementFactor)}x`);
    lines.push('');
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    return lines.join('\n');
  };

  const MetricCard = ({ label, value, unit, color = 'blue', help }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-2xl font-bold text-${color}-900 mt-1`}>
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        {help && (
          <button
            className="text-gray-400 hover:text-gray-600"
            title={help}
            aria-label={`Help for ${label}`}
          >
            ℹ️
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Capacity Results</h2>
          <p className="text-xs text-gray-600 mt-1">
            Calculated storage capacity and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyRFQ}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Copy RFQ to clipboard"
          >
            📋 Copy RFQ
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Download CSV"
          >
            📥 CSV
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          label="Total CBM"
          value={formatNumber(results.totalCBM)}
          unit="CBM"
          color="blue"
          help="Total storage capacity in cubic meters"
        />
        <MetricCard
          label="Rack CBM"
          value={formatNumber(results.totalRackCBM)}
          unit="CBM"
          color="indigo"
          help="Storage capacity from HD racks only"
        />
        <MetricCard
          label="Mezzanine CBM"
          value={formatNumber(results.mezzCBM)}
          unit="CBM"
          color="purple"
          help="Storage capacity from mezzanine area"
        />
        <MetricCard
          label="Total Bays"
          value={formatNumber(results.bayCount, 0)}
          unit="bays"
          color="green"
          help="Total number of rack bays"
        />
        <MetricCard
          label="Pallet Positions"
          value={formatNumber(results.totalPalletPositions, 0)}
          unit="pallets"
          color="yellow"
          help="Total pallet storage positions"
        />
        <MetricCard
          label="Space Gain"
          value={formatNumber(results.spaceImprovementFactor)}
          unit="×"
          color="red"
          help="Capacity improvement vs baseline"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Detailed Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Baseline CBM:</span>
            <span className="font-semibold">{formatNumber(results.baselineCBM)} CBM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Extra CBM Gained:</span>
            <span className="font-semibold text-green-600">+{formatNumber(results.extraCBM)} CBM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Racking Area:</span>
            <span className="font-semibold">{formatNumber(results.areas.rackingArea, 0)} sq.ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Staging Area:</span>
            <span className="font-semibold">{formatNumber(results.areas.stagingArea, 0)} sq.ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CBM per Bay:</span>
            <span className="font-semibold">{formatNumber(results.volumePerBayCBM)} CBM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pallets per Level:</span>
            <span className="font-semibold">{results.palletsPerLevel} pallets</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sq.Ft per CBM:</span>
            <span className="font-semibold">{formatNumber(results.sqftPerCBM)} sq.ft</span>
          </div>
          {results.bayCountDetails?.baysPerRow && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Bays per Row:</span>
                <span className="font-semibold">{results.bayCountDetails.baysPerRow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Rows:</span>
                <span className="font-semibold">{results.bayCountDetails.numberOfRows}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bill of Quantities */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Bill of Quantities (BoQ)
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 font-semibold text-gray-700">Item</th>
                <th className="text-right py-2 font-semibold text-gray-700">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(results.boq).map(([key, item]) => (
                <tr key={key}>
                  <td className="py-2 text-gray-700">{item.description}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">
                    {item.quantity.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Quantities include safety margins (5-10% extra for cuts and contingency)
        </p>
      </div>
    </div>
  );
}

