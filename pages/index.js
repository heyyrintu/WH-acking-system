import { useState, useEffect } from 'react';
import Head from 'next/head';
import InputPanel from '../components/InputPanel';
import ResultsPanel from '../components/ResultsPanel';
import TopDownVisualization from '../components/TopDownVisualization';
import ChartsPanel from '../components/ChartsPanel';
import WalkthroughModal from '../components/WalkthroughModal';
import { calculateWarehouseCapacity } from '../lib/calculations';

export default function Home() {
  // Default input values
  const [inputs, setInputs] = useState({
    // Warehouse dimensions
    warehouseArea: 108000,
    warehouseLength: 0,
    warehouseWidth: 0,
    warehouseClearHeight: 45,
    baselineCBM: 7500,
    
    // Rack specifications
    bayLength: 9.5,
    bayWidth: 3.5,
    levelHeight: 6,
    levels: 7,
    
    // Area allocation
    percentRacking: 60,
    mezzPercent: 30, // 30% of racking area goes to mezzanine
    
    // Aisle and operations
    smallGap: 1.5,
    aisleWidth: 10,
    isVNA: false,
    aisleOverheadMultiplier: 1.5,
    
    // Mezzanine
    mezzClearHeight: 7.2,
    
    // Pallets
    palletFootprint: 12.92,
    palletsPerLevelOverride: null,
    
    // Calculation method
    useModuleMethod: false, // Toggle between module and empirical
  });

  const [results, setResults] = useState(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [activeView, setActiveView] = useState('standard'); // 'standard' or 'vna'

  // Calculate on mount and input changes
  useEffect(() => {
    try {
      const calculated = calculateWarehouseCapacity(inputs);
      setResults(calculated);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [inputs]);

  // Show walkthrough on first visit
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (!hasSeenWalkthrough) {
      setShowWalkthrough(true);
      localStorage.setItem('hasSeenWalkthrough', 'true');
    }
  }, []);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadDefaults = () => {
    setInputs({
      warehouseArea: 108000,
      warehouseLength: 0,
      warehouseWidth: 0,
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
      mezzClearHeight: 7.2,
      palletFootprint: 12.92,
      palletsPerLevelOverride: null,
      useModuleMethod: false,
    });
  };

  const toggleVNAComparison = () => {
    if (activeView === 'standard') {
      // Switch to VNA
      setActiveView('vna');
      handleInputChange('aisleWidth', 6);
      handleInputChange('isVNA', true);
      handleInputChange('aisleOverheadMultiplier', 1.2);
    } else {
      // Switch back to standard
      setActiveView('standard');
      handleInputChange('aisleWidth', 10);
      handleInputChange('isVNA', false);
      handleInputChange('aisleOverheadMultiplier', 1.5);
    }
  };

  return (
    <>
      <Head>
        <title>Warehouse Capacity Calculator | HD Racks + Mezzanine</title>
        <meta name="description" content="Calculate warehouse storage capacity with HD pallet racks and mezzanine" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Warehouse Capacity Calculator
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  HD Pallet Racks + Mezzanine Storage Planning
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWalkthrough(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Show walkthrough"
                >
                  📖 Help
                </button>
                <button
                  onClick={loadDefaults}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Load default values"
                >
                  🔄 Load Defaults
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Inputs */}
            <div className="lg:col-span-1">
              <InputPanel
                inputs={inputs}
                onInputChange={handleInputChange}
                results={results}
              />
            </div>

            {/* Right Panel - Results and Visualizations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Results Summary */}
              {results && (
                <>
                  <ResultsPanel
                    results={results}
                    inputs={inputs}
                  />

                  {/* VNA Comparison Toggle */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Layout Comparison
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Compare Standard vs VNA configurations
                        </p>
                      </div>
                      <button
                        onClick={toggleVNAComparison}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeView === 'vna'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {activeView === 'standard' ? '📊 Switch to VNA' : '📊 Switch to Standard'}
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-3 rounded">
                      <strong>Current Mode:</strong> {activeView === 'vna' ? 'VNA (Very Narrow Aisle)' : 'Standard Reach Truck'}
                      <br />
                      <strong>Aisle Width:</strong> {inputs.aisleWidth} ft
                      <br />
                      <strong>Bay Count:</strong> {results.bayCount} bays
                    </div>
                  </div>

                  {/* Top-Down Visualization */}
                  <TopDownVisualization
                    inputs={inputs}
                    results={results}
                  />

                  {/* Charts */}
                  <ChartsPanel
                    results={results}
                    inputs={inputs}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Walkthrough Modal */}
        {showWalkthrough && (
          <WalkthroughModal onClose={() => setShowWalkthrough(false)} />
        )}
      </main>
    </>
  );
}

