'use client';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  userMessage: string;
  userId: number;
  orderId?: number;
  cardLast4?: string;
  amount?: number;
}

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: string | null;
  onSelectScenario: (scenarioId: string) => void;
  onStartSimulation: () => void;
}

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onStartSimulation
}: ScenarioSelectorProps) {
  const selected = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-300 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Scenario</h2>
      <p className="text-gray-600 mb-6">
        Choose a demo scenario to see the multi-agent system in action.
      </p>

      {/* Scenario Cards */}
      <div className="space-y-3 mb-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedScenario === scenario.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-1">
              {scenario.title}
            </h3>
            <p className="text-sm text-gray-600">{scenario.description}</p>
          </div>
        ))}
      </div>

      {/* Selected Scenario Details */}
      {selected && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-700 mb-2">User Message:</h4>
          <p className="text-sm font-mono bg-white p-3 rounded border border-gray-200">
            "{selected.userMessage}"
          </p>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={onStartSimulation}
        disabled={!selectedScenario}
        className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {selectedScenario ? 'Start Simulation' : 'Select a scenario to continue'}
      </button>
    </div>
  );
}
