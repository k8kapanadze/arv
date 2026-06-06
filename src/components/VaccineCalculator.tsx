import React, { useState } from "react";
import { 
  Calendar, 
  AlertCircle, 
  Printer, 
  Info, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { calculateSchedule } from "../utils";
import { CalculationResult } from "../types";

export default function VaccineCalculator({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

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
    // Check if running in an iframe context
    const isInsideIframe = window.self !== window.top;
    if (isInsideIframe) {
      // If we are inside an iframe, let the user know that they can click the
      // 'Open in new tab' button at the top of the viewport for a direct printed document.
      setShowPrintModal(true);
    }
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10" id="calculator-root">
      
      {/* Dynamic Header - Sleeker, Compact size & Intensely Animated */}
      <motion.div 
        className="text-center mb-8 md:mb-10 flex flex-col items-center" 
        id="calc-header"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Antirabies Pre-title - Clean, transparent typography strictly above the main title */}
        <p className="text-xs md:text-sm tracking-widest text-[#cdc1be] font-bold font-sans uppercase mb-2">
          ანტირაბიული კალენდარი
        </p>

        {/* Revamped Sophisticated & Shrunk Title Design */}
        <div className="relative inline-block mb-3" id="title-holder">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#cdc1be] font-sans relative z-10" id="main-title">
            ვაქცინაციის <span className="text-white">დაგეგმვა</span>
          </h1>
          
          <motion.div 
            className="h-[2px] bg-gradient-to-r from-transparent via-[#756663] to-transparent mt-2.5 rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed font-sans font-extrabold mt-2" id="main-subtitle">
          ცოფის საწინააღმდეგო პოსტექსპოზიციური პროფილაქტიკის (PEP) კალენდარული გრაფიკი.
        </p>
      </motion.div>

      {/* Date Picker Form Card with spring-loaded hover glow lines */}
      <motion.div 
        className="bg-[#111111] border-2 border-neutral-800/80 rounded-[2rem] p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#756663]/40 hover:shadow-[#756663]/5" 
        id="form-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <form onSubmit={handleCalculate} className="space-y-6" id="calc-form">
          <div className="space-y-3" id="input-container">
            <label htmlFor="start-date-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
              პირველი აცრის თარიღი <span className="text-neutral-500 font-extrabold font-sans" id="label-desc">(დღე 0)</span>
            </label>
            
            <motion.div 
              className="relative mt-2 p-1 bg-[#161616] border-2 border-[#2b2423] rounded-2xl transition-all" 
              id="input-icon-wrapper"
              whileHover={{ scale: 1.01, borderColor: "rgba(117,102,99,0.6)" }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4" id="calendar-icon-wrapper">
                <Calendar className="h-5 w-5 text-[#756663]" id="calendar-icon" />
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
                className="block w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white text-base font-sans font-extrabold focus:outline-none cursor-pointer outline-none"
              />
            </motion.div>
            
            <div className="flex justify-between items-center text-xs pt-1" id="quick-links">
              <motion.button
                type="button"
                id="today-shortcut-btn"
                onClick={handleSetToday}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-brand-300 hover:text-brand-200 font-black transition-all flex items-center gap-2 cursor-pointer font-sans bg-[#756663]/20 hover:bg-[#756663]/30 px-3.5 py-2.5 rounded-xl border border-[#756663]/25 shadow-md text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#cdc1be] animate-bounce" /> დღეს
              </motion.button>
              <span className="text-neutral-500 font-sans font-extrabold text-[10px] uppercase tracking-wider" id="current-timezone">
                აქტიური კალენდარი
              </span>
            </div>
          </div>

          {/* Error Message with Fade transitions */}
          <AnimatePresence id="error-alert-presence">
            {errorMessage && (
              <motion.div
                id="error-alert"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-200 font-sans font-extrabold"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" id="error-icon" />
                <div id="error-text" className="text-xs md:text-sm leading-relaxed">
                  {errorMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Action Submit with bouncy spring microinteractions */}
          <div className="pt-1" id="action-wrapper">
            <motion.button
              type="submit"
              id="calculate-button"
              whileHover={{ scale: 1.01, backgroundColor: "#867571" }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#756663] text-white font-extrabold py-4 px-6 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide text-base md:text-lg"
            >
              <span>გრაფიკის ჩვენება</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" id="btn-arrow" />
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Minimalist redirect block for Medication Labeler */}
      <motion.div 
        onClick={() => onNavigate?.("/medication-labeler")}
        whileHover={{ scale: 1.01, borderColor: "rgba(117,102,99,0.5)" }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-[#111111]/65 hover:bg-[#111111] border-2 border-dashed border-neutral-800/80 rounded-[1.5rem] p-4 flex items-center justify-between cursor-pointer transition-all duration-300 group mb-8"
        id="minimal-labeler-shortcut"
      >
        <span className="text-xs font-black tracking-wider text-neutral-400 group-hover:text-[#cdc1be] font-sans uppercase">
          მარკირება
        </span>
        <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#cdc1be] group-hover:translate-x-1 transition-all" />
      </motion.div>

      {/* Calculated Schedule Timeline with rich staggered entry transitions */}
      <AnimatePresence id="result-block-presence">
        {result && (
          <motion.div
            id="result-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-[#111111] border border-neutral-800/80 rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#756663]/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Results Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/50" id="result-meta-header">
              <div id="result-meta-title-block">
                <h3 className="text-white font-black text-xl md:text-2xl flex items-center font-sans" id="meta-title">
                  <span className="w-8 h-[3px] bg-[#756663] mr-3 rounded-full"></span>
                  აცრების განრიგი
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-400 mt-1.5 font-sans font-extrabold" id="meta-desc">
                  საწყისი თარიღი: <strong className="text-[#cdc1be] font-extrabold font-sans text-xs md:text-sm ml-1">{result.milestones[0].formattedDate}</strong>
                </p>
              </div>
              <motion.button
                type="button"
                id="print-button"
                onClick={handlePrint}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-neutral-800 rounded-xl text-xs font-black text-[#cdc1be] hover:text-white transition-all cursor-pointer font-sans"
              >
                <Printer className="w-4 h-4 text-neutral-400 stroke-[2.5]" id="print-icon" />
                ბეჭდვა / PDF შენახვა
              </motion.button>
            </div>

            {/* Print Iframe Advisory Modal */}
            <AnimatePresence>
              {showPrintModal && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-emerald-950/25 border border-emerald-900/55 rounded-xl text-emerald-200 text-xs font-sans font-extrabold flex items-start gap-2.5"
                >
                  <Info className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p>
                      თუ ბრაუზერი არ ხსნის ბეჭდვის გვერდს, გთხოვთ გამოიყენოთ ეკრანის ზედა მარჯვენა ნაწილში არსებული <strong>„ახალ ტაბში გახსნა (Open in new tab)“</strong> ღილაკი და იქიდან დააჭიროთ ბეჭდვას.
                    </p>
                    <button 
                      onClick={() => setShowPrintModal(false)}
                      className="text-emerald-400 underline hover:text-emerald-300 mt-1 cursor-pointer block"
                    >
                      გავიგე, დახურვა
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interactive Timeline layout */}
            <div className="relative space-y-10 mt-10 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-gradient-to-b before:from-[#756663] before:via-neutral-800 before:to-neutral-900" id="timeline-path">
              {result.milestones.map((milestone, index) => {
                const isFirst = index === 0;
                const isLast = index === result.milestones.length - 1;

                return (
                  <motion.div
                    key={milestone.day}
                    id={`milestone-row-${milestone.day}`}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14, delay: index * 0.08 }}
                    className="relative flex items-start z-10 group"
                  >
                    {/* Circle Node Node Indicator */}
                    <motion.div 
                      whileHover={{ scale: 1.15, borderColor: "#756663" }}
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 shadow-lg shadow-black/40 transition-all duration-200 ${
                        isFirst 
                          ? "bg-[#756663] border-[#111] text-white" 
                          : "bg-[#161616] border-neutral-800 text-neutral-300"
                      }`}
                      id={`node-icon-${milestone.day}`}
                    >
                      <span className="text-sm font-black font-sans">{milestone.day}</span>
                    </motion.div>

                    {/* Milestone details with spring transitions on hover */}
                    <div className="ml-5 md:ml-6 flex-1 min-w-0" id={`details-content-${milestone.day}`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5" id={`details-meta-${milestone.day}`}>
                        <div className="flex items-center gap-2" id={`labels-wrapper-${milestone.day}`}>
                          <span className="text-[11px] text-[#cdc1be] tracking-wider font-black font-sans uppercase" id={`badge-${milestone.day}`}>
                            {milestone.label}
                          </span>
                          {isFirst && (
                            <span className="text-[9px] font-extrabold text-brand-100 bg-[#756663]/30 border border-[#756663]/50 px-2 py-0.5 rounded-full font-sans" id="badge-start-tag">
                              საწყისი
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[9px] font-extrabold text-[#cdc1be] bg-[#756663]/25 border border-[#756663]/40 px-2 py-0.5 rounded-full font-sans" id="badge-end-tag">
                              საბოლოო
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-[#cdc1be] font-sans" id={`formatted-short-date-${milestone.day}`}>
                          {milestone.formattedDate}
                        </div>
                      </div>

                      {/* Georgia verbose date display */}
                      <p className={`text-lg md:text-xl font-black tracking-tight font-sans transition-colors duration-200 group-hover:text-brand-100 ${isLast ? 'text-[#cdc1be]' : 'text-white'}`} id={`formatted-long-date-${milestone.day}`}>
                        {milestone.formattedLongDate}
                      </p>

                      <p className="text-xs text-neutral-400 leading-relaxed max-w-xl mt-1.5 font-sans font-extrabold" id={`desc-text-${milestone.day}`}>
                        {milestone.statusDescription}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Disclaimer & Critical Medical Guidelines */}
            <motion.div 
              className="mt-10 p-5 bg-[#161616]/70 border-2 border-neutral-800/80 rounded-2xl space-y-3" 
              id="medical-guidelines-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-[#cdc1be]" id="guidelines-title-box">
                <Info className="w-5 h-5 shrink-0 text-[#756663]" id="info-icon" />
                <h4 className="font-black text-xs uppercase tracking-wider font-sans">რეკომენდაციები და ვაქცინაციის წესები:</h4>
              </div>
              <ul className="list-disc pl-4 text-xs text-neutral-350 space-y-1.5 opacity-90 font-sans font-extrabold leading-relaxed" id="guideline-list">
                <li id="rule-1">
                  <strong>არ გამოტოვოთ თარიღები:</strong> ვაქცინაციის კალენდრის ზუსტი დაცვა სასიცოცხლოდ მნიშვნელოვანია სრულყოფილი იმუნიტეტის გამომუშავებისთვის.
                </li>
                <li id="rule-2">
                  <strong>სამედიცინო მეთვალყურეობა:</strong> აცრების კურსი უნდა დაიგეგმოს და განხორციელდეს მხოლოდ კვალიფიციური ექიმის ან შესაბამისი კლინიკის კონტროლითა და მეთვალყურეობით.
                </li>
                <li id="rule-3">
                  <strong>პირველადი დახმარება:</strong> ცხოველთან კონტაქტის შემთხვევაში, აუცილებელია ჭრილობის დაუყოვნებლივ ჩამორეცხვა საპნითა და გამდინარე წყლით 15 წუთის განმავლობაში, რის შემდეგაც სასწრაფოდ უნდა მიმართოთ სამედიცინო პუნქტს.
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static visual fallback instruction */}
      {!result && (
        <motion.div 
          className="p-10 text-center bg-[#111111]/30 rounded-[2rem] border-2 border-dashed border-neutral-800/60" 
          id="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar className="w-8 h-8 text-[#756663] mx-auto mb-4 animate-pulse" />
          <p className="text-xs md:text-sm text-neutral-300 font-sans font-extrabold max-w-xs mx-auto leading-relaxed">
            მიუთითეთ პირველი აცრის თარიღი ზედა ველში და დააჭირეთ „გრაფიკის ჩვენება“-ს, რათა გენერირდეს სრული კალენდარი და თარიღები.
          </p>
        </motion.div>
      )}

      {/* Robust High-Quality Pure-White Printing Styles targeting body directly */}
      <style>{`
        input[type="date"], input[type="time"], select, option {
          color-scheme: dark !important;
        }
        @media print {
          /* Universal Overrides to Force Clean High-Contrast White Background */
          html, body, #app-root, #app-main, #calculator-root, #result-section {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          
          /* Hide interactive or irrelevant UI sections completely on printed paper */
          #print-button, #calc-form, #quick-links, #calc-header, #empty-state, #header-badge, nav, header, footer, #global-header, #global-footer {
            display: none !important;
          }
          
          #calculator-root {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          /* Keep the layout straightforward and full size */
          #result-section {
            background-color: #ffffff !important;
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            display: block !important;
            transform: none !important;
            opacity: 1 !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force standard typography to solid black with high contrast */
          .text-white, h3, p, span, li, strong, div {
            color: #000000 !important;
          }
          
          .text-neutral-300, .text-neutral-350, .text-neutral-400, .text-neutral-450, .text-[#cdc1be] {
            color: #1a1a1a !important;
          }
          
          .text-neutral-500, .text-neutral-600 {
            color: #4b5563 !important;
          }
          
          /* Custom printing modifications for the timeline guide lines */
          #timeline-path::before {
            background: #cbd5e1 !important;
            width: 3px !important;
            left: 23px !important;
          }
          
          [id^="node-icon-"] {
            background-color: #f1f5f9 !important;
            background: #f1f5f9 !important;
            border-color: #000000 !important;
            color: #000000 !important;
          }
          
          [id^="badge-"] {
            font-weight: bold !important;
            color: #000000 !important;
          }
          
          #medical-guidelines-box {
            background-color: #f9fafb !important;
            background: #f9fafb !important;
            border: 2px solid #cbd5e1 !important;
            border-radius: 12px !important;
            color: #000000 !important;
            padding: 16px !important;
            margin-top: 24px !important;
          }
          
          #medical-guidelines-box * {
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
