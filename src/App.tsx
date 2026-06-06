import React, { useState, useEffect } from "react";
import VaccineCalculator from "./components/VaccineCalculator";
import PotassiumCalculator from "./components/PotassiumCalculator";
import MedicationLabeler from "./components/MedicationLabeler";
import { Syringe, HeartPulse, Tag } from "lucide-react";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    // Listen for custom pushState navigation updates
    window.addEventListener("pushstate-changed", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate-changed", handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    // Trigger custom event so all listeners update correctly
    window.dispatchEvent(new Event("pushstate-changed"));
  };

  const isKCalc = currentPath === "/potassium-calculator";
  const isLabeler = currentPath === "/medication-labeler";

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-200 selection:bg-brand-500/30 selection:text-brand-100 font-sans" id="app-root">
      
      {/* Universal Premium Navigation Bar (Header/Menu) */}
      <header className="sticky top-0 z-50 bg-[#070707]/85 backdrop-blur-md border-b border-neutral-900/60" id="global-header">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Main Title Label */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo("/")} id="header-logo-section">
            <HeartPulse className="w-6 h-6 text-[#756663] animate-pulse" />
            <span className="text-sm font-black tracking-wider text-[#cdc1be] font-sans uppercase">
              კლინიკური ასისტენტი
            </span>
          </div>

          {/* Navigation Tab Menu */}
          <nav className="flex space-x-2 md:space-x-3" id="global-tabs">
            
            {/* Tab 1: Vaccine calendar */}
            <button
              id="nav-vaccine-tab"
              onClick={() => navigateTo("/")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-sans ${
                !isKCalc && !isLabeler
                  ? "bg-[#756663] text-white shadow-lg shadow-[#756663]/25" 
                  : "bg-[#111111] hover:bg-[#161616] text-[#cdc1be] hover:text-white border border-neutral-800/80"
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>ანტირაბია</span>
            </button>

            {/* Tab 2: Potassium Deficiency Calculator */}
            <button
              id="nav-potassium-tab"
              onClick={() => navigateTo("/potassium-calculator")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-sans ${
                isKCalc 
                  ? "bg-[#756663] text-white shadow-lg shadow-[#756663]/25" 
                  : "bg-[#111111] hover:bg-[#161616] text-[#cdc1be] hover:text-white border border-neutral-800/80"
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>კალიუმის დეფიციტი</span>
            </button>

            {/* Tab 3: Medication Labeler */}
            <button
              id="nav-labeler-tab"
              onClick={() => navigateTo("/medication-labeler")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-sans ${
                isLabeler 
                  ? "bg-[#756663] text-white shadow-lg shadow-[#756663]/25" 
                  : "bg-[#111111] hover:bg-[#161616] text-[#cdc1be] hover:text-white border border-neutral-800/80"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>მარკირება</span>
            </button>

          </nav>
        </div>
      </header>

      {/* Main active calculator display container */}
      <main className="max-w-7xl mx-auto py-6" id="app-main">
        {isKCalc ? (
          <PotassiumCalculator />
        ) : isLabeler ? (
          <MedicationLabeler />
        ) : (
          <VaccineCalculator onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="py-8 text-center text-[10px] text-neutral-600 font-sans tracking-wide font-extrabold border-t border-neutral-900/50" id="global-footer">
        კლინიკური ინსტრუმენტების პორტალი • {new Date().getFullYear()} წელი
      </footer>

      {/* Hide Header and Footer entirely on Print Output and force white canvas */}
      <style>{`
        @media print {
          html, body, #root, #app-root, #app-main {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #global-header, #global-footer {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
