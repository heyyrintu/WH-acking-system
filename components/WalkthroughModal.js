import { useState } from 'react';

export default function WalkthroughModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Warehouse Capacity Calculator',
      content: (
        <>
          <p className="mb-3">
            This tool helps you plan and visualize warehouse storage capacity using HD pallet racks and mezzanine structures.
          </p>
          <p className="mb-3">
            You'll be able to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Calculate total storage capacity in CBM</li>
            <li>Visualize rack layouts with top-down view</li>
            <li>Compare Standard vs VNA configurations</li>
            <li>Generate Bill of Quantities (BoQ)</li>
            <li>Export results as PDF and CSV</li>
          </ul>
        </>
      ),
      icon: '🏢'
    },
    {
      title: 'Step 1: Warehouse Dimensions',
      content: (
        <>
          <p className="mb-3">
            Start by entering your warehouse specifications:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Floor Area:</strong> Total warehouse footprint in square feet</li>
            <li><strong>Length & Width:</strong> Optional - for exact layout calculations</li>
            <li><strong>Clear Height:</strong> Ceiling height for rack clearance validation</li>
            <li><strong>Baseline CBM:</strong> Current storage capacity without racking</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
            💡 <strong>Tip:</strong> If you provide length and width, the calculator will use the module method for exact bay placement.
          </div>
        </>
      ),
      icon: '📐'
    },
    {
      title: 'Step 2: Rack Specifications',
      content: (
        <>
          <p className="mb-3">
            Configure your HD pallet rack system:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Bay Dimensions:</strong> Length (along row) and width (depth) of each rack bay</li>
            <li><strong>Level Height:</strong> Vertical spacing between beam levels (typically 6 ft)</li>
            <li><strong>Number of Levels:</strong> Total beam levels per rack (e.g., 7 levels = 42 ft tall)</li>
            <li><strong>Floor Percentage:</strong> How much floor area to dedicate to racking</li>
            <li><strong>Mezzanine Allocation:</strong> Percentage of racking area for mezzanine</li>
          </ul>
          <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
            ⚠️ <strong>Note:</strong> Total rack height must not exceed warehouse clear height.
          </div>
        </>
      ),
      icon: '📦'
    },
    {
      title: 'Step 3: Aisle Configuration',
      content: (
        <>
          <p className="mb-3">
            Choose your aisle width and equipment type:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Standard (10 ft):</strong> For reach trucks and counterbalance forklifts</li>
            <li><strong>VNA (6 ft):</strong> Very Narrow Aisle - requires specialized equipment</li>
            <li><strong>Custom:</strong> Adjust based on your specific needs</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 rounded text-sm">
            ✅ <strong>VNA Benefits:</strong> 30-60% more storage capacity vs standard aisles
          </div>
          <div className="mt-2 p-3 bg-red-50 rounded text-sm">
            ⚠️ <strong>VNA Requirements:</strong> Wire guidance, specialized trucks, operator training
          </div>
        </>
      ),
      icon: '🚛'
    },
    {
      title: 'Step 4: Review Results',
      content: (
        <>
          <p className="mb-3">
            The calculator automatically computes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Total CBM:</strong> Complete storage capacity</li>
            <li><strong>Bay Count:</strong> Number of rack bays that fit</li>
            <li><strong>Pallet Positions:</strong> Total storage locations</li>
            <li><strong>Space Improvement:</strong> Capacity gain vs baseline</li>
            <li><strong>Bill of Quantities:</strong> Required materials with safety margins</li>
          </ul>
          <div className="mt-3 p-3 bg-purple-50 rounded text-sm">
            📊 <strong>Visualizations:</strong> Interactive charts and top-down layout help you understand the design.
          </div>
        </>
      ),
      icon: '📊'
    },
    {
      title: 'Step 5: Export & Share',
      content: (
        <>
          <p className="mb-3">
            Export your design for presentations and RFQs:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>CSV Export:</strong> Download complete BoQ with all quantities</li>
            <li><strong>Copy RFQ:</strong> Copy formatted quote text to clipboard</li>
            <li><strong>SVG/PNG Export:</strong> Save layout diagrams for documentation</li>
            <li><strong>PDF Export:</strong> Generate one-page summary (coming soon)</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
            💾 <strong>Tip:</strong> Save multiple configurations to compare different layouts.
          </div>
        </>
      ),
      icon: '📥'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{steps[currentStep].icon}</span>
              <div>
                <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
                <p className="text-sm text-blue-100 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Close walkthrough"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="text-gray-700 leading-relaxed">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              ← Previous
            </button>

            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next →
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Started! 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

