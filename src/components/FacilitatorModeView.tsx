import React, { useState } from 'react';
import {
  Users,
  Presentation,
  Printer,
  Share2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  Building2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import { calculateMp2Projection } from '../lib/mp2Calculator';

export const FacilitatorModeView: React.FC = () => {
  const [participantsCount, setParticipantsCount] = useState<number>(100);
  const [monthlyPerPerson, setMonthlyPerPerson] = useState<number>(1000);
  const [initialPerPerson, setInitialPerPerson] = useState<number>(0);
  const [durationYears, setDurationYears] = useState<number>(5);
  const [assumedRate, setAssumedRate] = useState<number>(6.5);
  const [organizationName, setOrganizationName] = useState<string>('Barangay Community Savings Program');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Individual projection
  const individualProj = calculateMp2Projection({
    startingAmount: initialPerPerson,
    monthlyContribution: monthlyPerPerson,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: assumedRate,
    dividendTreatment: 'reinvest',
    projectionYears: durationYears,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  // Collective / Group Totals
  const groupTotalContributions = individualProj.totalContributions * participantsCount;
  const groupTotalDividends = individualProj.totalDividendsEarned * participantsCount;
  const groupProjectedValue = individualProj.projectedMaturityValue * participantsCount;

  // Presets
  const PRESETS = [
    {
      name: 'Barangay Micro-Savers',
      participants: 50,
      monthly: 500,
      desc: '₱500/buwan para sa 50 nanays at riders sa komunidad'
    },
    {
      name: 'LGU / Government Staff Batch',
      participants: 100,
      monthly: 1000,
      desc: '₱1,000/buwan para sa 100 kawani ng munisipyo o ahensya'
    },
    {
      name: 'Cooperative / Association',
      participants: 200,
      monthly: 2000,
      desc: '₱2,000/buwan para sa 200 miyembro ng kooperatiba'
    }
  ];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setOrganizationName(preset.name);
    setParticipantsCount(preset.participants);
    setMonthlyPerPerson(preset.monthly);
  };

  const handleReset = () => {
    setParticipantsCount(100);
    setMonthlyPerPerson(1000);
    setInitialPerPerson(0);
    setDurationYears(5);
    setAssumedRate(6.5);
    setOrganizationName('Community Financial Literacy Session');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Hidden in Presentation Fullscreen) */}
      {!isPresentationMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] no-print">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0F1E36]">
                Facilitator & Workshop Mode
              </h1>
              <p className="text-xs text-slate-500">
                Idinisenyo para sa LGUs, kooperatiba, NGOs, at financial literacy workshops
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsPresentationMode(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B5CAB] hover:bg-[#155E9E] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Presentation Mode</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
              title="Print scenario summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title="Reset values"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PRESENTATION MODE VIEW */}
      {isPresentationMode && (
        <div className="bg-[#0A1628] text-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-8 animate-fade-in border border-blue-950">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B5CAB] text-white flex items-center justify-center font-black">
                MP2
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {organizationName}
                </h2>
                <p className="text-xs text-slate-400">
                  Kolektibong Epekto ng Pag-iipon: {participantsCount.toLocaleString()} Kalahok × ₱{monthlyPerPerson.toLocaleString()}/buwan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPresentationMode(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Lumabas sa Presentation
            </button>
          </div>

          {/* Huge Hero Numbers for Projector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Kabuuang Naihulog ng Grupo
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono-num">
                ₱{groupTotalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-slate-400">
                100% Garantisado ng Republika ng Pilipinas
              </div>
            </div>

            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                Tantiya sa Kinita (Tax-Free)
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 font-mono-num">
                +₱{groupTotalDividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-emerald-300/80">
                0% Buwis (Walang 20% Withholding Tax)
              </div>
            </div>

            <div className="p-6 rounded-xl bg-blue-950/40 border border-blue-800/80 space-y-2">
              <div className="text-xs uppercase tracking-wider font-bold text-blue-300">
                Posibleng Halaga Pagkatapos ng 5 Taon
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 font-mono-num">
                ₱{groupProjectedValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-blue-200/80">
                Base sa {assumedRate.toFixed(1)}% assumed dividend rate
              </div>
            </div>
          </div>

          {/* Per-Participant Breakdown Box */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white">Bawat Isang Miyembro: </span>
              <span>
                Sa ₱{monthlyPerPerson.toLocaleString()}/buwan, mag-iipon sila ng <strong>₱{individualProj.totalContributions.toLocaleString()}</strong> at posibleng makatanggap ng humigit-kumulang <strong>₱{individualProj.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong> (+₱{individualProj.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })} sa dividends).
              </span>
            </div>
            <div className="text-xs text-slate-400 shrink-0 italic">
              "Malaki ang nagagawa kapag sabay-sabay nag-iipon ang komunidad."
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 pt-2">
            Pang-edukasyon lamang na halimbawa. Ang aktwal na dividend rate ay dine-declare taun-taon ng Pag-IBIG Fund.
          </div>
        </div>
      )}

      {/* REGULAR WORKSHOP CONFIGURATOR */}
      {!isPresentationMode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Configurator Controls (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-[#0F1E36] flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#0B5CAB]" />
                <span>Workshop Parameters</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ayusin ang bilang ng kalahok at kanilang kakayahang mag-ipon
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Quick Community Presets:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Organization / Session Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pangalan ng Workshop o Organisasyon:
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Hal. Barangay Savings Seminar"
              />
            </div>

            {/* Participants Count */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Bilang ng mga Kalahok / Miyembro:</span>
                <span className="text-[#0B5CAB] font-mono-num">{participantsCount} katao</span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(parseInt(e.target.value) || 5)}
                className="w-full accent-[#0B5CAB]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-num">
                <span>5</span>
                <span>250</span>
                <span>500</span>
                <span>1,000</span>
              </div>
            </div>

            {/* Monthly Per Person */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Buwanang Hulog Bawat Tao:</span>
                <span className="text-[#0B5CAB] font-mono-num">₱{monthlyPerPerson.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthlyPerPerson(amt)}
                    className={`py-1 text-xs font-bold rounded border font-mono-num transition cursor-pointer ${
                      monthlyPerPerson === amt
                        ? 'bg-[#0B5CAB] text-white border-[#0B5CAB]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₱{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Dividend Rate */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Assumed Dividend Rate:</span>
                <span className="text-[#0B5CAB] font-mono-num">{assumedRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="8.5"
                step="0.1"
                value={assumedRate}
                onChange={(e) => setAssumedRate(parseFloat(e.target.value) || 6.5)}
                className="w-full accent-[#0B5CAB]"
              />
            </div>

          </div>

          {/* Right Column: Collective Results Presentation (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Collective Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  KOLEKTIBONG RESULTA PARA SA KOMUNIDAD
                </span>
                <span className="text-xs font-bold text-[#0B5CAB] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  5 Taong Programa
                </span>
              </div>

              {/* Huge Projected Value */}
              <div>
                <div className="text-xs text-slate-500">
                  Posibleng Kabuuang Yaman ng {participantsCount} Kalahok:
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F1E36] font-mono-num mt-1">
                  ₱{groupProjectedValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>

                <div className="flex flex-wrap gap-2 mt-3 text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono-num">
                    Tantiya sa Dividends: +₱{groupTotalDividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-mono-num">
                    Kabuuang Puhunan: ₱{groupTotalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Individual Saver Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Ano ang mararating ng bawat kalahok?
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Buwanang Hulog</div>
                    <div className="font-bold text-slate-900 font-mono-num">
                      ₱{monthlyPerPerson.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Ipon sa 5 Taon</div>
                    <div className="font-bold text-slate-900 font-mono-num">
                      ₱{individualProj.totalContributions.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-emerald-300">
                    <div className="text-[10px] text-emerald-700">Tantiya sa Makukuha</div>
                    <div className="font-bold text-emerald-700 font-mono-num">
                      ₱{individualProj.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilitator Talking Points */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-[#0B5CAB]">
                  Gabay sa Pagtuturo (Talking Points para sa Facilitator):
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>
                    <strong>Soberanong Garantiya:</strong> Ang ₱{groupTotalContributions.toLocaleString()} na kabuuang inihulog ng mga miyembro ay 100% garantisado ng gobyerno sa ilalim ng RA 9679.
                  </li>
                  <li>
                    <strong>0% Buwis:</strong> Lahat ng ₱{groupTotalDividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })} na kikitain ay buong makukuha dahil walang 20% withholding tax.
                  </li>
                  <li>
                    <strong>Walang sapilitan:</strong> Kung may buwan na hindi makapaghulog ang miyembro, walang penalty o forfeiture.
                  </li>
                </ul>
              </div>

            </div>

            {/* Legal / Non-promise Disclaimer */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Pabatid Pang-Edukasyon: </strong>
                Ito ay isang educational illustration lamang para sa seminar at community workshops. Ang MP2 dividend rates ay nakadepende sa taunang kita ng Pag-IBIG Fund at hindi isang garantisadong pangako ng return.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
