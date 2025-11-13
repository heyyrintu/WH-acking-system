import { useState } from 'react';

export default function InputPanel({ inputs, onInputChange, results }) {
  const [expandedSections, setExpandedSections] = useState({
    warehouse: true,
    rack: true,
    aisles: true,
    mezzanine: true,
    advanced: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Section = ({ id, title, children }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        aria-expanded={expandedSections[id]}
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className="text-gray-500">
          {expandedSections[id] ? '▼' : '▶'}
        </span>
      </button>
      {expandedSections[id] && (
        <div className="p-4 space-y-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  const InputField = ({ label, name, type = 'number', min, max, step = 'any', unit, help }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {unit && <span className="text-gray-500 ml-1">({unit})</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={inputs[name]}
        onChange={(e) => onInputChange(name, parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-describedby={help ? `${name}-help` : undefined}
      />
      {help && (
        <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
          {help}
        </p>
      )}
    </div>
  );

  const SliderField = ({ label, name, min, max, step = 1, unit }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600">
          {inputs[name]}{unit}
        </span>
      </div>
      <input
        type="range"
        id={name}
        name={name}
        value={inputs[name]}
        onChange={(e) => onInputChange(name, parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  const ToggleField = ({ label, name, help }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={inputs[name]}
          onChange={(e) => onInputChange(name, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div className="ml-3">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
      </div>
    </div>
  );

  const SelectField = ({ label, name, options, unit }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {unit && <span className="text-gray-500 ml-1">({unit})</span>}
      </label>
      <select
        id={name}
        name={name}
        value={inputs[name]}
        onChange={(e) => onInputChange(name, parseFloat(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 flex flex-col max-h-[calc(100vh-2rem)]">
      {/* Fixed Header */}
      <div className="p-6 pb-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Input Parameters</h2>
        <p className="text-xs text-gray-600 mt-1">
          Configure your warehouse specifications
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="input-panel-scroll overflow-y-auto overflow-x-hidden flex-1 px-6 py-4 space-y-4" style={{ maxHeight: 'calc(100vh - 10rem)' }}>

      {/* Validation Warnings */}
      {results?.validation && (
        <div className="space-y-2">
          {results.validation.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-red-800 mb-2">⚠️ Errors</h4>
              {results.validation.errors.map((error, idx) => (
                <p key={idx} className="text-xs text-red-700 mb-1">
                  • {error.message}
                </p>
              ))}
            </div>
          )}
          {results.validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-yellow-800 mb-2">⚡ Warnings</h4>
              {results.validation.warnings.map((warning, idx) => (
                <p key={idx} className="text-xs text-yellow-700 mb-1">
                  • {warning.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warehouse Section */}
      <Section id="warehouse" title="🏢 Warehouse Dimensions">
        <InputField
          label="Total Floor Area"
          name="warehouseArea"
          min={0}
          unit="sq.ft"
          help="Enter total warehouse floor area"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Length"
            name="warehouseLength"
            min={0}
            unit="ft"
            help="Optional: for exact layout"
          />
          <InputField
            label="Width"
            name="warehouseWidth"
            min={0}
            unit="ft"
            help="Optional: for exact layout"
          />
        </div>

        <InputField
          label="Clear Height"
          name="warehouseClearHeight"
          min={0}
          unit="ft"
          help="Warehouse ceiling height"
        />

        <InputField
          label="Baseline CBM (No Racks)"
          name="baselineCBM"
          min={0}
          unit="CBM"
          help="Current storage capacity without racking"
        />
      </Section>

      {/* Rack Specifications */}
      <Section id="rack" title="📦 Rack Specifications">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Bay Length"
            name="bayLength"
            min={0}
            step={0.5}
            unit="ft"
          />
          <InputField
            label="Bay Width/Depth"
            name="bayWidth"
            min={0}
            step={0.5}
            unit="ft"
          />
        </div>

        <InputField
          label="Level Height"
          name="levelHeight"
          min={0}
          step={0.5}
          unit="ft"
          help="Vertical spacing between levels"
        />

        <InputField
          label="Number of Levels"
          name="levels"
          min={1}
          max={12}
          step={1}
          unit="levels"
          help="Total beam levels per rack"
        />

        <SliderField
          label="Floor Used for Racking"
          name="percentRacking"
          min={0}
          max={100}
          step={5}
          unit="%"
        />

        <SliderField
          label="Mezzanine Allocation"
          name="mezzPercent"
          min={0}
          max={100}
          step={5}
          unit="%"
        />
      </Section>

      {/* Aisles & Operations */}
      <Section id="aisles" title="🚛 Aisles & Operations">
        <ToggleField
          label="Use VNA (Very Narrow Aisle)"
          name="isVNA"
          help="VNA requires specialized equipment"
        />

        <SelectField
          label="Aisle Width"
          name="aisleWidth"
          unit="ft"
          options={[
            { value: 6, label: '6 ft (VNA)' },
            { value: 8, label: '8 ft' },
            { value: 10, label: '10 ft (Standard)' },
            { value: 12, label: '12 ft' },
          ]}
        />

        <InputField
          label="Small Gap Between Bays"
          name="smallGap"
          min={0}
          step={0.5}
          unit="ft"
          help="Gap between back-to-back bays"
        />

        <InputField
          label="Aisle Overhead Multiplier"
          name="aisleOverheadMultiplier"
          min={1}
          max={3}
          step={0.1}
          unit="x"
          help="Conservative factor for aisle space (1.5 standard, 1.2 VNA)"
        />
      </Section>

      {/* Mezzanine */}
      <Section id="mezzanine" title="🏗️ Mezzanine">
        <InputField
          label="Mezzanine Clear Height"
          name="mezzClearHeight"
          min={0}
          step={0.5}
          unit="ft"
          help="Usable height under mezzanine deck"
        />
      </Section>

      {/* Advanced Settings */}
      <Section id="advanced" title="⚙️ Advanced Settings">
        <InputField
          label="Pallet Footprint"
          name="palletFootprint"
          min={0}
          step={0.1}
          unit="sq.ft"
          help="Standard: 12.92 sq.ft (1.2m × 1.0m)"
        />

        <InputField
          label="Pallets per Level (Override)"
          name="palletsPerLevelOverride"
          min={0}
          step={1}
          unit="pallets"
          help="Leave 0 for auto-calculation"
        />

        <ToggleField
          label="Use Module Method"
          name="useModuleMethod"
          help="Use exact L×W for bay grid layout (requires length & width)"
        />
      </Section>
      </div>
      {/* End Scrollable Content */}
    </div>
  );
}

