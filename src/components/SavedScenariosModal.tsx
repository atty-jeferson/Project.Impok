import React, { useState, useEffect } from 'react';
import { SavedScenario, CalculationInputs } from '../types/mp2';
import { getSavedScenarios, saveScenario, deleteScenario } from '../lib/storage';
import { Bookmark, Trash2, X, Plus, ArrowRight } from 'lucide-react';

interface SavedScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: CalculationInputs;
  onLoadScenario: (inputs: CalculationInputs) => void;
}

export const SavedScenariosModal: React.FC<SavedScenariosModalProps> = ({
  isOpen,
  onClose,
  currentInputs,
  onLoadScenario,
}) => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setScenarios(getSavedScenarios());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    const name = newScenarioName.trim() || `MP2 Scenario (${scenarios.length + 1})`;
    const created = saveScenario(name, currentInputs);
    setScenarios(prev => [created, ...prev]);
    setNewScenarioName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteScenario(id);
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const handleLoad = (scenario: SavedScenario) => {
    onLoadScenario(scenario.inputs);
    onClose();
  };

  return (
    <div id="saved-scenarios-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123B63]/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 border border-[#CBD5E1] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E3EC]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-md bg-[#EAF3FA] text-[#0B5CAB]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123B63]">Saved MP2 Scenarios</h3>
              <p className="text-xs text-[#526575]">Persisted locally in your browser storage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#526575] hover:text-[#123B63] hover:bg-[#F1F5F9] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Action */}
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 px-4 rounded-md border border-dashed border-[#0B5CAB]/60 hover:border-[#0B5CAB] text-xs font-bold text-[#0B5CAB] flex items-center justify-center space-x-2 transition bg-[#EAF3FA]/50 hover:bg-[#EAF3FA] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current Inputs as New Scenario</span>
          </button>
        ) : (
          <div className="p-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md space-y-2">
            <label className="text-xs font-bold text-[#123B63]">Name this Scenario:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="e.g., Aggressive ₱10k/mo + Bonus"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#172B3A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B5CAB]"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 bg-[#0B5CAB] text-white text-xs font-bold rounded hover:bg-[#155E9E] transition cursor-pointer shadow-xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1.5 bg-white text-[#526575] text-xs font-semibold rounded border border-[#CBD5E1] hover:bg-[#F1F5F9] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List of Scenarios */}
        <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0] pr-1 space-y-1">
          {scenarios.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#526575]">
              No saved scenarios yet. Save your current plan to compare variations anytime!
            </div>
          ) : (
            scenarios.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between group">
                <div>
                  <div className="font-bold text-xs text-[#123B63]">{s.name}</div>
                  <div className="text-[11px] text-[#526575] font-mono-num mt-0.5">
                    ₱{s.inputs.monthlyContribution.toLocaleString('en-PH')}/mo • {s.inputs.assumedDividendRate.toFixed(2)}% rate • {s.inputs.projectionYears} yrs • {s.inputs.dividendTreatment === 'reinvest' ? 'Compounded' : 'Annual Payout'}
                  </div>
                  <div className="text-[10px] text-[#526575] mt-0.5">
                    Saved on {new Date(s.createdAt).toLocaleDateString('en-PH')}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleLoad(s)}
                    className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold text-[#0B5CAB] bg-[#EAF3FA] hover:bg-blue-100 border border-blue-200 rounded transition cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-[#526575] hover:text-[#C53030] hover:bg-red-50 rounded transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D9E3EC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#526575] hover:text-[#172B3A] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
