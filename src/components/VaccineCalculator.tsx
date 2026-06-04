import React, { useState } from "react";
import { 
  Calendar, 
  AlertCircle, 
  Printer, 
  Info, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { calculateSchedule } from "../utils";
import { CalculationResult } from "../types";

export default function VaccineCalculator() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSetToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setErrorMessage(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setErrorMessage("გთხოვთ, მიუთითოთ თარიღი");
      setResult(null);
      return;
    }

    setErrorMessage(null);
    const calculated = calculateSchedule(selectedDate);
    setResult(calculated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12" id="calculator-root">
      
      {/* Dynamic Header with Elegant Dark Badging & Smooth Intro Animation */}
      <motion.div 
        className="text-center mb-10 md:mb-14" 
        id="calc-header"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#756663]/10 border border-[#756663]/30 mb-5 shadow-lg shadow-black/15" 
          id="header-badge"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#756663] animate-pulse"></div>
          <span className="text-[11px] tracking-widest text-[#cdc1be] font-black font-sans uppercase">ანტირაბიის კალენდარი</span>
        </motion.div>
        
        {/* Revamped, Sleeker & Reduced Title Design */}
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#cdc1be] leading-tight mb-4 font-sans" id="main-title">
          ვაქცინაციის <span className="text-white px-3.5 py-1 bg-[#756663]/25 border border-[#756663]/40 rounded-2xl shadow-xl inline-block transform hover:scale-105 transition-transform duration-300 cursor-default">დაგეგმვა</span>
        </h1>
        
        <p className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed font-sans font-extrabold" id="main-subtitle">
          შეიყვანეთ პირველი აცრის თარიღი ცოფის საწინააღმდეგო პოსტექსპოზიციური პროფილაქტიკის (PEP) ზუსტი გრაფიკის მისაღებად.
        </p>
      </motion.div>

      {/* Date Picker Form Card: Interactive Glow & Smoother Animations */}
      <motion.div 
        className="bg-[#111111] border-2 border-neutral-800/80 rounded-[2rem] p-6 md:p-10 mb-10 shadow-2xl shadow-black/70 relative overflow-hidden transition-all duration-500 hover:border-[#756663]/40" 
        id="form-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      >
        {/* Decorative backdrop graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#756663]/5 rounded-full blur-[60px] pointer-events-none"></div>
        
        <form onSubmit={handleCalculate} className="space-y-8" id="calc-form">
          <div className="space-y-4" id="input-container">
            <label htmlFor="start-date-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
              პირველი აცრის თარიღი <span className="text-neutral-500 font-extrabold font-sans" id="label-desc">(საწყისი დღე 0)</span>
            </label>
            
            {/* Highly Polished Date Pick Container with Premium Hover Effect */}
            <motion.div 
              className="relative mt-2 p-1.5 bg-[#161616] border-2 border-[#2b2423] rounded-2.5xl transition-all shadow-inner" 
              id="input-icon-wrapper"
              whileHover={{ borderColor: "#756663/60", boxShadow: "0 0 20px rgba(117,102,99,0.15)" }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5" id="calendar-icon-wrapper">
                <Calendar className="h-6 w-6 text-[#756663]" id="calendar-icon" />
              </div>
              <input
                type="date"
                id="start-date-input"
                style={{ colorScheme: 'dark' }}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="block w-full bg-transparent border-none py-4.5 pl-14 pr-4 text-white text-lg font-sans font-extrabold placeholder-neutral-500 focus:outline-none cursor-pointer outline-none"
              />
            </motion.div>
            
            <div className="flex justify-between items-center text-xs pt-1" id="quick-links">
              <motion.button
                type="button"
                id="today-shortcut-btn"
                onClick={handleSetToday}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-brand-300 hover:text-brand-200 font-black transition-all flex items-center gap-2 cursor-pointer font-sans bg-[#756663]/20 hover:bg-[#756663]/30 px-3.5 py-2.5 rounded-xl border border-[#756663]/25 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#cdc1be] animate-bounce" /> დღევანდელი დღე
              </motion.button>
              <span className="text-neutral-500 font-sans font-extrabold text-[10px] uppercase tracking-wider" id="current-timezone">
                აქტიური კალენდარი
              </span>
            </div>
          </div>

          {/* Inline Error Alert */}
          <AnimatePresence id="error-alert-presence">
            {errorMessage && (
              <motion.div
                id="error-alert"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3.5 p-5 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-200 font-sans font-extrabold"
              >
                <AlertCircle className="w-5.5 h-5.5 text-rose-400 shrink-0 mt-0.5" id="error-icon" />
                <div id="error-text" className="text-sm leading-relaxed">
                  {errorMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action Block with Rounded Aesthetics */}
          <div className="pt-2" id="action-wrapper">
            <motion.button
              type="submit"
              id="calculate-button"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(117,102,99,0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#756663] hover:bg-[#867571] active:bg-[#635552] text-white font-extrabold py-5 px-6 rounded-2xl shadow-xl shadow-[#756663]/15 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer font-sans tracking-wide text-lg"
            >
              <span>გრაფიკის ჩვენება</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" id="btn-arrow" />
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Calculated Schedule Section */}
      <AnimatePresence id="result-block-presence">
        {result && (
          <motion.div
            id="result-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-[#111111] border border-neutral-800/80 rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Blurry Background Glow in Warm Brand Hue */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header of results */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-8 border-b-2 border-neutral-800/50" id="result-meta-header">
              <div id="result-meta-title-block">
                <h3 className="text-white font-black text-2xl md:text-3xl flex items-center font-sans" id="meta-title">
                  <span className="w-10 h-[3px] bg-[#756663] mr-4 rounded-full"></span>
                  აცრების განრიგი
                </h3>
                <p className="text-xs md:text-sm text-neutral-450 mt-2 font-sans font-extrabold" id="meta-desc">
                  საწყისი თარიღი: <strong className="text-[#cdc1be] font-extrabold font-sans text-sm md:text-base ml-1.5">{result.milestones[0].formattedDate}</strong>
                </p>
              </div>
              <motion.button
                type="button"
                id="print-button"
                onClick={handlePrint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2.5 px-5.5 py-3 bg-[#1a1a1a] hover:bg-[#222] border-2 border-neutral-800 rounded-2xl text-xs font-black text-[#cdc1be] hover:text-white transition-all cursor-pointer font-sans"
              >
                <Printer className="w-4 h-4 text-neutral-400 stroke-[2.5]" id="print-icon" />
                ბეჭდვა / PDF შენახვა
              </motion.button>
            </div>

            {/* Elegant Vertical Timeline with Bigger Balls and Solid rounded tracks */}
            <div className="relative space-y-12 mt-12 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-gradient-to-b before:from-[#756663] before:via-neutral-800 before:to-neutral-900" id="timeline-path">
              {result.milestones.map((milestone, index) => {
                const isFirst = index === 0;
                const isLast = index === result.milestones.length - 1;

                return (
                  <motion.div
                    key={milestone.day}
                    id={`milestone-row-${milestone.day}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.12 }}
                    className="relative flex items-start z-10 group"
                  >
                    {/* Glowing Circular Node Indicator - Rounded and bold with subtle scale-on-hover */}
                    <motion.div 
                      whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(117,102,99,0.35)", borderColor: "#756663" }}
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 shadow-lg shadow-black/40 transition-all duration-300 ${
                        isFirst 
                          ? "bg-[#756663] border-[#111] text-white" 
                          : "bg-[#161616] border-neutral-800 text-neutral-300"
                      }`}
                      id={`node-icon-${milestone.day}`}
                    >
                      <span className="text-sm font-black font-sans">{milestone.day}</span>
                    </motion.div>

                    {/* Milestone details with rounded text values */}
                    <div className="ml-6 md:ml-8 flex-1 min-w-0" id={`details-content-${milestone.day}`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2" id={`details-meta-${milestone.day}`}>
                        <div className="flex items-center gap-2.5" id={`labels-wrapper-${milestone.day}`}>
                          <span className="text-xs text-[#cdc1be] tracking-wider font-black font-sans" id={`badge-${milestone.day}`}>
                            {milestone.label}
                          </span>
                          {isFirst && (
                            <span className="text-[10px] font-extrabold text-brand-100 bg-[#756663]/40 border border-[#756663]/60 px-2.5 py-0.5 rounded-full font-sans" id="badge-start-tag">
                              საწყისი
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[10px] font-extrabold text-[#cdc1be] bg-[#756663]/25 border border-[#756663]/40 px-2.5 py-0.5 rounded-full font-sans" id="badge-end-tag">
                              საბოლოო
                            </span>
                          )}
                        </div>
                        {/* High contrast numerical target date */}
                        <div className="text-xs md:text-sm font-extrabold text-[#cdc1be] font-sans" id={`formatted-short-date-${milestone.day}`}>
                          {milestone.formattedDate}
                        </div>
                      </div>

                      {/* Georgian long verbose date sentence in ultra-rounded-friendly styling */}
                      <p className={`text-xl md:text-2xl font-black tracking-tight font-sans transition-colors duration-200 group-hover:text-brand-100 ${isLast ? 'text-[#cdc1be]' : 'text-white'}`} id={`formatted-long-date-${milestone.day}`}>
                        {milestone.formattedLongDate}
                      </p>

                      <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl mt-2 font-sans font-extrabold" id={`desc-text-${milestone.day}`}>
                        {milestone.statusDescription}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Disclaimer & Critical Medical Guidelines styled for dark theme */}
            <motion.div 
              className="mt-14 p-6 bg-[#161616]/70 border-2 border-neutral-800/80 rounded-2.5xl space-y-4" 
              id="medical-guidelines-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2.5 text-[#cdc1be]" id="guidelines-title-box">
                <Info className="w-5.5 h-5.5 shrink-0 stroke-[2.5] text-[#756663]" id="info-icon" />
                <h4 className="font-black text-sm uppercase tracking-wider font-sans">რეკომენდაციები და ვაქცინაციის წესები:</h4>
              </div>
              <ul className="list-disc pl-5 text-xs md:text-sm text-neutral-300 space-y-2 opacity-95 font-sans font-extrabold leading-relaxed" id="guideline-list">
                <li id="rule-1">
                  <strong>არ გამოტოვოთ თარიღები:</strong> ვაქცინაციის კალენდრის ზუსტი დაცვა სასიცოცხლოდ მნიშვნელოვანია სრულყოფილი იმუნიტეტის გამომუშავებისთვის.
                </li>
                <li id="rule-2">
                  <strong>სამედიცინო მეთვალყურეობა:</strong> აცრების კურსი უნდა დაიგეგმოს და განხორციელდეს მხოლოდ კვალიფიციური ექიმის ან შესაბამისი კლინიკის კონტროლითა და მეთვალყურეობით.
                </li>
                <li id="rule-3">
                  <strong>პირველადი დახმარება:</strong> ცხოველთან კონტაქტის (დაკბენა, დაკაწვრა, დორბლი) შემთხვევაში, აუცილებელია ჭრილობის დაუყოვნებლივ ჩამორეცხვა საპნითა და გამდინარე წყლით 15 წუთის განმავლობაში, რის შემდეგაც სასწრაფოდ უნდა მიმართოთ სამედიცინო პუნქტს.
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static visual fallback instruction */}
      {!result && (
        <motion.div 
          className="p-12 text-center bg-[#111111]/30 rounded-[2rem] border-2 border-dashed border-neutral-800/60" 
          id="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar className="w-8 h-8 text-[#756663] mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-neutral-300 font-sans font-extrabold max-w-xs mx-auto leading-relaxed">
            მიუთითეთ პირველი აცრის თარიღი ზედა ველში და დააჭირეთ „გრაფიკის ჩვენება“-ს, რათა გენერირდეს სრული კალენდარი და თარიღები.
          </p>
        </motion.div>
      )}

      {/* Robust High-Quality Printing styles covering root structural classes */}
      <style>{`
        @media print {
          /* Force standard light canvas for perfect readability in printed media */
          html, body, #app-root, #app-main, #calculator-root, #result-section {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111111 !important;
          }
          
          /* Hide interactive/non-document web components completely */
          #print-button, #calc-form, #quick-links, #calc-header, #empty-state, #header-badge {
            display: none !important;
          }
          
          #calculator-root {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          /* Unfold the calculated content and make it take full screen */
          #result-section {
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
          
          .text-neutral-300, .text-neutral-400, .text-neutral-450, .text-[#cdc1be] {
            color: #333333 !important;
          }
          
          .text-neutral-500, .text-neutral-600 {
            color: #666666 !important;
          }
          
          /* Adjust custom timelines to look clean on printing paper */
          #timeline-path::before {
            background: #cbd5e1 !important;
            width: 3px !important;
            left: 23px !important;
          }
          
          [id^="node-icon-"] {
            background: #f1f5f9 !important;
            border-color: #475569 !important;
            color: #111111 !important;
          }
          
          [id^="badge-"] {
            background: #cbd5e1 !important;
            color: #111111 !important;
          }
          
          #medical-guidelines-box {
            background-color: #f9fafb !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            color: #111111 !important;
            padding: 16px !important;
            margin-top: 24px !important;
          }
          
          #medical-guidelines-box * {
            color: #111111 !important;
          }
        }
      `}</style>
    </div>
  );
}
