import React, { useState } from "react";
import { 
  AlertCircle, 
  Printer, 
  ChevronRight,
  TrendingDown,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PotassiumCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [currentK, setCurrentK] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pWeight = parseFloat(weight);
    const pCurrentK = parseFloat(currentK);
    const targetK = 4.0; // Fixed target potassium at 4.0 mmol/L

    if (isNaN(pWeight) || pWeight <= 0) {
      setErrorMessage("გთხოვთ მიუთითოთ პაციენტის ვალიდური წონა (კგ)");
      setResult(null);
      return;
    }

    if (isNaN(pCurrentK) || pCurrentK <= 0) {
      setErrorMessage("გთხოვთ მიუთითოთ კალიუმის მიმდინარე მაჩვენებელი სისხლში");
      setResult(null);
      return;
    }

    if (pCurrentK >= targetK) {
      setErrorMessage("დეფიციტის გამოსათვლელად მიმდინარე კალიუმის მაჩვენებელი უნდა იყოს 4.0 მმოლ/ლ-ზე ნაკლები");
      setResult(null);
      return;
    }

    setErrorMessage(null);

    // Formula: K+ deficit (mEq) = (4.0 - Current K) * Weight * 0.2
    const calculatedDeficit = (targetK - pCurrentK) * pWeight * 0.2;
    
    // Round to 1 decimal place
    setResult(Math.round(calculatedDeficit * 10) / 10);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12" id="k-calculator-root">
      
      {/* Header section with badge */}
      <motion.div 
        className="text-center mb-10 md:mb-14" 
        id="k-calc-header"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#756663]/10 border border-[#756663]/30 mb-5 shadow-lg shadow-black/15" 
          id="k-header-badge"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#756663] animate-pulse"></div>
          <span className="text-[11px] tracking-widest text-[#cdc1be] font-black font-sans uppercase font-extrabold">K⁺ დეფიციტის გამოთვლა (სამიზნე: 4.0 მმოლ/ლ)</span>
        </motion.div>
        
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#cdc1be] leading-tight mb-4 font-sans" id="k-main-title">
          კალიუმის <span className="text-white px-3.5 py-1 bg-[#756663]/25 border border-[#756663]/40 rounded-2xl shadow-xl inline-block transform hover:scale-105 transition-transform duration-300 cursor-default">კალკულატორი</span>
        </h1>
        
        <p className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed font-sans font-extrabold" id="k-main-subtitle">
          მიუთითეთ პაციენტის წონა და კალიუმის მიმდინარე მაჩვენებელი სწრაფი და ზუსტი კლინიკური გაანგარიშებისთვის.
        </p>
      </motion.div>

      {/* Input container - Simplified with 2 items */}
      <motion.div 
        className="bg-[#111111] border-2 border-neutral-800/80 rounded-[2rem] p-6 md:p-10 mb-10 shadow-2xl shadow-black/70 relative overflow-hidden transition-all duration-500 hover:border-[#756663]/40" 
        id="k-form-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#756663]/5 rounded-full blur-[60px] pointer-events-none"></div>
        
        <form onSubmit={handleCalculate} className="space-y-6 md:space-y-8" id="k-calc-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="k-calc-inputs">
            
            {/* Input 1: Weight */}
            <div className="space-y-2.5" id="weight-input-container">
              <label htmlFor="patient-weight" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
                პაციენტის წონა <span className="text-neutral-500 font-extrabold font-sans" id="label-kg">(კგ)</span>
              </label>
              <div className="relative p-1.5 bg-[#161616] border-2 border-[#2b2423] rounded-2.5xl focus-within:border-[#756663] transition-all shadow-inner" id="weight-wrapper">
                <input
                  type="number"
                  step="any"
                  id="patient-weight"
                  placeholder="მაგ. 70"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="block w-full bg-transparent border-none py-4 px-4 text-white text-lg font-sans font-extrabold placeholder-neutral-600 focus:outline-none outline-none"
                />
              </div>
            </div>

            {/* Input 2: Current Potassium */}
            <div className="space-y-2.5" id="current-k-input-container">
              <label htmlFor="current-k" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
                კალიუმის მიმდინარე მაჩვენებელი <span className="text-neutral-500 font-extrabold font-sans" id="label-mK">(მმოლ/ლ)</span>
              </label>
              <div className="relative p-1.5 bg-[#161616] border-2 border-[#2b2423] rounded-2.5xl focus-within:border-[#756663] transition-all shadow-inner" id="current-k-wrapper">
                <input
                  type="number"
                  step="0.01"
                  id="current-k"
                  placeholder="მაგ. 2.8"
                  value={currentK}
                  onChange={(e) => {
                    setCurrentK(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="block w-full bg-transparent border-none py-4 px-4 text-white text-lg font-sans font-extrabold placeholder-neutral-600 focus:outline-none outline-none"
                />
              </div>
            </div>

          </div>

          {/* Inline Error Alert */}
          <AnimatePresence id="k-error-alert-presence">
            {errorMessage && (
              <motion.div
                id="k-error-alert"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3.5 p-5 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-200 font-sans font-extrabold"
              >
                <AlertCircle className="w-5.5 h-5.5 text-rose-400 shrink-0 mt-0.5" id="k-error-icon" />
                <div id="k-error-text" className="text-sm leading-relaxed">
                  {errorMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Clear & Calculate Block */}
          <div className="pt-2" id="k-action-wrapper">
            <motion.button
              type="submit"
              id="k-calculate-button"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(117,102,99,0.35)", borderColor: "rgba(117,102,99,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#161616] hover:bg-[#1a1a1a] border-2 border-neutral-800 rounded-2xl text-[#cdc1be] font-extrabold py-5 px-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer font-sans tracking-wide text-lg backdrop-blur-md"
            >
              <Activity className="w-5 h-5 text-[#cdc1be] animate-pulse" />
              <span>გამოთვლა</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" id="k-btn-arrow" />
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Result presentation Section - Extremely Clean & Minimalist */}
      <AnimatePresence id="k-result-block-presence">
        {result !== null && (
          <motion.div
            id="k-result-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-[#111111] border border-neutral-800/80 rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header of results with Printing option */}
            <div className="flex flex-row items-center justify-between gap-5 pb-6 border-b-2 border-neutral-800/50" id="k-result-meta-header">
              <h3 className="text-white font-black text-xl md:text-2xl flex items-center font-sans" id="k-meta-title">
                <span className="w-8 h-[3px] bg-[#756663] mr-3 rounded-full"></span>
                გამოთვლის შედეგი
              </h3>
              <motion.button
                type="button"
                id="k-print-button"
                onClick={handlePrint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-neutral-800 rounded-xl text-xs font-black text-[#cdc1be] hover:text-white transition-all cursor-pointer font-sans"
              >
                <Printer className="w-4 h-4 text-neutral-400 stroke-[2]" id="k-print-icon" />
                ბეჭდვა
              </motion.button>
            </div>

            {/* Large visually clean minimalist response card */}
            <div className="py-12 text-center" id="k-result-showcase">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="inline-flex flex-col items-center justify-center p-8 md:p-10 bg-[#161616] border-2 border-neutral-800/80 rounded-[2rem] min-w-[280px] md:min-w-[340px] shadow-2xl shadow-black/80"
              >
                <TrendingDown className="w-8 h-8 text-[#756663] mb-4" />
                <span className="text-xs text-neutral-400 uppercase tracking-widest font-black font-sans mb-3">დეფიციტის რაოდენობა</span>
                
                <p className="text-2xl md:text-3xl font-black text-white font-sans leading-snug">
                  📊 გადასასხმელი რაოდენობა: <span className="text-emerald-400 block sm:inline mt-2 sm:mt-0 font-extrabold text-3xl md:text-4xl">{result} მექ</span>
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-800/60 w-full text-center">
                  <span className="text-[10px] md:text-xs text-neutral-500 font-extrabold uppercase tracking-wider font-sans">
                    პარამეტრები: {weight} კგ • K⁺ {currentK} → 4.0 მმოლ/ლ
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static visual fallback instruction */}
      {result === null && (
        <motion.div 
          className="p-12 text-center bg-[#111111]/30 rounded-[2rem] border-2 border-dashed border-neutral-800/60" 
          id="k-empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TrendingDown className="w-8 h-8 text-[#756663] mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-neutral-300 font-sans font-extrabold max-w-xs mx-auto leading-relaxed">
            შეიყვანეთ პაციენტის წონა და კალიუმის მიმდინარე მაჩვენებელი, რომ მომენტალურად გამოთვალოთ გადასასხმელი რაოდენობა.
          </p>
        </motion.div>
      )}

      {/* High-Quality White Print Styles */}
      <style>{`
        @media print {
          /* Force standard light canvas for perfect readability in printed media */
          html, body, #app-root, #app-main, #k-calculator-root, #k-result-section {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111111 !important;
          }
          
          /* Hide interactive/non-document web components completely */
          #k-print-button, #k-calc-form, #k-calc-header, #k-empty-state, #k-header-badge {
            display: none !important;
          }
          
          #k-calculator-root {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          /* Unfold the calculated content and make it take full screen */
          #k-result-section {
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            display: block !important;
            transform: none !important;
            opacity: 1 !important;
            color: #111111 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force all typography styles to high-contrast dark color */
          .text-white, h3, p, span, li, strong, div {
            color: #111111 !important;
          }
          
          .text-neutral-300, .text-neutral-450, .text-neutral-400, .text-[#cdc1be] {
            color: #111111 !important;
          }
          
          .text-neutral-500, .text-neutral-600 {
            color: #555555 !important;
          }
          
          [id^="k-result-showcase"] {
            border: none !important;
            box-shadow: none !important;
            background: #f8fafc !important;
            margin-bottom: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
