import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../lib/calculations';

export default function ChartsPanel({ results, inputs }) {
  // Data for CBM comparison bar chart
  const cbmData = [
    {
      name: 'Baseline',
      cbm: parseFloat(results.baselineCBM.toFixed(2)),
      fill: '#94a3b8'
    },
    {
      name: 'Rack CBM',
      cbm: parseFloat(results.totalRackCBM.toFixed(2)),
      fill: '#2563eb'
    },
    {
      name: 'Mezzanine',
      cbm: parseFloat(results.mezzCBM.toFixed(2)),
      fill: '#9333ea'
    },
    {
      name: 'Total CBM',
      cbm: parseFloat(results.totalCBM.toFixed(2)),
      fill: '#059669'
    }
  ];

  // Data for area allocation pie chart
  const areaData = [
    {
      name: 'HD Racking',
      value: parseFloat(results.areas.hdArea.toFixed(2)),
      percentage: ((results.areas.hdArea / results.areas.totalArea) * 100).toFixed(1),
      fill: '#2563eb'
    },
    {
      name: 'Mezzanine',
      value: parseFloat(results.areas.mezzArea.toFixed(2)),
      percentage: ((results.areas.mezzArea / results.areas.totalArea) * 100).toFixed(1),
      fill: '#9333ea'
    },
    {
      name: 'Staging/Aisles',
      value: parseFloat(results.areas.stagingArea.toFixed(2)),
      percentage: ((results.areas.stagingArea / results.areas.totalArea) * 100).toFixed(1),
      fill: '#64748b'
    }
  ].filter(item => item.value > 0);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-bold">{formatNumber(payload[0].value)}</span> CBM
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-bold">{formatNumber(payload[0].value, 0)}</span> sq.ft
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* CBM Comparison Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Storage Capacity Comparison</h2>
          <p className="text-xs text-gray-600 mt-1">
            CBM breakdown by source
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cbmData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              label={{ value: 'CBM', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="square"
            />
            <Bar
              dataKey="cbm"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {cbmData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {cbmData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-gray-700">
                {item.name}: <strong>{formatNumber(item.cbm)}</strong> CBM
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Area Allocation Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Floor Area Allocation</h2>
          <p className="text-xs text-gray-600 mt-1">
            Distribution of warehouse floor space
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={areaData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
            >
              {areaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Area Breakdown</h3>
          <div className="space-y-2">
            {areaData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {formatNumber(item.value, 0)} sq.ft
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-700">Total Warehouse Area</span>
              <span className="text-gray-900">
                {formatNumber(results.areas.totalArea, 0)} sq.ft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">📊 Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-700">
              <strong>Capacity Increase:</strong>{' '}
              <span className="text-green-600 font-bold">
                +{formatNumber(results.extraCBM)} CBM
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {formatNumber(((results.extraCBM / results.baselineCBM) * 100))}% improvement over baseline
            </p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-700">
              <strong>Space Efficiency:</strong>{' '}
              <span className="text-blue-600 font-bold">
                {formatNumber(results.sqftPerCBM)} sq.ft/CBM
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Lower is better - efficient use of floor space
            </p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-700">
              <strong>Pallet Density:</strong>{' '}
              <span className="text-purple-600 font-bold">
                {formatNumber(results.totalPalletPositions / results.areas.totalArea * 1000)} pallets/1000 sq.ft
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Storage positions per 1000 sq.ft
            </p>
          </div>
          <div className="bg-white bg-opacity-60 p-3 rounded">
            <p className="text-gray-700">
              <strong>Utilization Rate:</strong>{' '}
              <span className="text-orange-600 font-bold">
                {formatNumber((results.areas.rackingArea / results.areas.totalArea) * 100)}%
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Percentage of floor dedicated to storage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

