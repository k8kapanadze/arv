import React, { useState, useEffect, useRef } from "react";
import { 
  AlertCircle, 
  Printer, 
  ChevronRight,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Search,
  Check,
  User,
  Clock,
  Timer,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Medication {
  id: string;
  name: string;
  durationValue: number;
  durationUnit: "hours" | "days" | "weeks" | "months";
}

const DEFAULT_MEDICATIONS: Medication[] = [
  { id: "1", name: "აკურინი", durationValue: 48, durationUnit: "hours" },
  { id: "2", name: "ბეტადინი", durationValue: 7, durationUnit: "days" },
  { id: "3", name: "ლაქსივი", durationValue: 6, durationUnit: "months" },
  { id: "4", name: "წყალბადის ზეჟანგი", durationValue: 6, durationUnit: "months" },
  { id: "5", name: "ლიდოკაინი", durationValue: 28, durationUnit: "days" },
  { id: "6", name: "ბეროდუალი", durationValue: 6, durationUnit: "months" },
  { id: "7", name: "ინსულინი აქტრაპიდი", durationValue: 6, durationUnit: "weeks" },
  { id: "8", name: "მეკოლი", durationValue: 6, durationUnit: "months" }
];

export default function MedicationLabeler() {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const isV3 = localStorage.getItem("medication-v3-loaded");
    if (!isV3) {
      localStorage.setItem("medication-v3-loaded", "true");
      localStorage.setItem("medication-list", JSON.stringify(DEFAULT_MEDICATIONS));
      return DEFAULT_MEDICATIONS;
    }
    const saved = localStorage.getItem("medication-list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MEDICATIONS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedId, setSelectedMedId] = useState<string>(medications[0]?.id || "");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // Opening date and time
  const [openDate, setOpenDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [openTime, setOpenTime] = useState(() => {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, "0");
    const mm = String(today.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  // Nurse initials
  const [nurseInitials, setNurseInitials] = useState(() => {
    const saved = localStorage.getItem("nurse-initials");
    return saved || "T.K";
  });

  // Expiration layout specs - locked to 50x30 mm
  const stickerSize = "50x30";

  // Custom medication modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedValue, setNewMedValue] = useState<number>(24);
  const [newMedUnit, setNewMedUnit] = useState<"hours" | "days" | "weeks" | "months">("hours");
  const [newMedError, setNewMedError] = useState("");

  // Custom delete confirmation modal state
  const [medToDelete, setMedToDelete] = useState<Medication | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync initials & medications with localStorage
  useEffect(() => {
    localStorage.setItem("medication-list", JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem("nurse-initials", nurseInitials);
  }, [nurseInitials]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMed = medications.find(m => m.id === selectedMedId) || medications[0];

  // Logic to calculate expiration date & time
  const getExpirationDetails = () => {
    if (!selectedMed || !openDate || !openTime) return null;

    const [year, month, day] = openDate.split("-").map(Number);
    const [hours, minutes] = openTime.split(":").map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(date.getTime())) return null;

    const value = selectedMed.durationValue;
    const unit = selectedMed.durationUnit;

    const expDate = new Date(date);

    if (unit === "hours") {
      expDate.setHours(date.getHours() + value);
    } else if (unit === "days") {
      expDate.setDate(date.getDate() + value);
    } else if (unit === "weeks") {
      expDate.setDate(date.getDate() + (value * 7));
    } else if (unit === "months") {
      expDate.setMonth(date.getMonth() + value);
    }

    const formatOffset = (d: Date, useSlashes = false) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      const sep = useSlashes ? "/" : ".";
      return {
        dateStr: `${dd}${sep}${mm}${sep}${yyyy}`,
        timeStr: `${hh}:${min}`,
        fullStr: `${dd}.${mm}.${yyyy} ${hh}:${min}`
      };
    };

    return {
      opened: formatOffset(date, true),
      expires: formatOffset(expDate, false),
      medName: selectedMed.name,
      shelfLifeText: `${value} ${
        unit === "hours" ? "საათი" :
        unit === "days" ? "დღე" :
        unit === "weeks" ? "კვირა" : "თვე"
      }`
    };
  };

  const expInfo = getExpirationDetails();

  // Search filter
  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add medication handler
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) {
      setNewMedError("გთხოვთ მიუთითოთ მედიკამენტის სახელი");
      return;
    }
    if (isNaN(newMedValue) || newMedValue <= 0) {
      setNewMedError("გთხოვთ მიუთითოთ ვალიდური ციფრი");
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedName.trim(),
      durationValue: Number(newMedValue),
      durationUnit: newMedUnit
    };

    const updated = [newMed, ...medications];
    setMedications(updated);
    setSelectedMedId(newMed.id);
    
    // reset form & close modal
    setNewMedName("");
    setNewMedValue(24);
    setNewMedUnit("hours");
    setNewMedError("");
    setIsModalOpen(false);
  };

  // Delete medication handler
  const handleDeleteMedication = (medId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Stop selection from firing
    const med = medications.find(m => m.id === medId);
    if (med) {
      setMedToDelete(med);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12" id="labeler-root">
      
      {/* Header section with plain beautiful title */}
      <motion.div 
        className="text-center mb-10 md:mb-14 flex flex-col items-center" 
        id="labeler-header"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Revamped Sophisticated & Shrunk Title Design resembling Vaccine planning */}
        <div className="relative inline-block mb-3" id="title-holder">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#cdc1be] font-sans relative z-10" id="main-title">
            მედიკამენტების <span className="text-white">მარკირება</span>
          </h1>
          
          <motion.div 
            className="h-[2px] bg-gradient-to-r from-transparent via-[#756663] to-transparent mt-2.5 rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed font-sans font-extrabold mt-2" id="labeler-main-subtitle">
          ავტომატური ვადის გაანგარიშება
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="labeler-layout">
        
        {/* Step inputs and controls panel */}
        <motion.div 
          className="lg:col-span-7 bg-[#111111] border-2 border-neutral-800/80 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden"
          id="inputs-panel"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} id="labeler-form">
            
            {/* 1. SMART-SEARCH DRUG SELECTION */}
            <div className="space-y-2.5 relative" id="med-select-section" ref={dropdownRef}>
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#756663]" />
                  მედიკამენტის ძებნა და არჩევა
                </label>
                
                {/* Add new drug shortcut */}
                <button
                  type="button"
                  id="open-add-med-modal"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs text-[#cdc1be] hover:text-white bg-[#756663]/20 hover:bg-[#756663]/35 border border-[#756663]/30 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ახალი მედიკამენტი
                </button>
              </div>

              {/* Pseudo-input Trigger */}
              <div 
                className="w-full bg-[#161616] border-2 border-[#2b2423] rounded-2xl p-4 flex items-center justify-between cursor-pointer focus-within:border-[#756663] transition-all"
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                id="searchable-trigger"
              >
                <div className="flex-1">
                  <p className="text-sm text-neutral-500 text-[10px] uppercase font-bold tracking-wide">არჩეულია:</p>
                  <p className="text-white font-extrabold text-base mt-0.5">
                    {selectedMed ? selectedMed.name : "გთხოვთ აირჩიოთ მედიკამენტი"}
                  </p>
                  <span className="text-[10px] text-neutral-400 font-bold">
                    ვადა: {selectedMed?.durationValue} {
                      selectedMed?.durationUnit === "hours" ? "საათი" :
                      selectedMed?.durationUnit === "days" ? "დღე" :
                      selectedMed?.durationUnit === "weeks" ? "კვირა" : "თვე"
                    }
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpenDropdown ? 'rotate-90' : ''}`} />
              </div>

              {/* Custom Searchable Dropdown Overlay */}
              <AnimatePresence>
                {isOpenDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-20 left-0 right-0 top-[100%] mt-2 bg-[#161616] border-2 border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 flex flex-col"
                    id="searchable-dropdown-overlay"
                  >
                    {/* Search filter input inside popup */}
                    <div className="p-3 border-b border-neutral-800 flex items-center gap-2 bg-[#121212]">
                      <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                      <input 
                        type="text"
                        placeholder="ჩაწერეთ სახელი საძიებლად (მაგ. ლიდოკაინი)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-white focus:outline-none placeholder-neutral-600 font-medium"
                        id="dropdown-search-query-input"
                        autoFocus
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery("")} className="text-neutral-500 hover:text-neutral-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filtered items list */}
                    <div className="overflow-y-auto flex-1 divide-y divide-neutral-900 custom-scrollbar">
                      {filteredMeds.length > 0 ? (
                        filteredMeds.map((med) => (
                          <div 
                            key={med.id}
                            id={`med-item-${med.id}`}
                            onClick={() => {
                              setSelectedMedId(med.id);
                              setIsOpenDropdown(false);
                              setSearchQuery("");
                            }}
                            className={`p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-[#202020] ${selectedMedId === med.id ? 'bg-[#756663]/10' : ''}`}
                          >
                            <div>
                              <p className="text-xs text-neutral-400">ვადა: {med.durationValue} {
                                med.durationUnit === "hours" ? "საათი" :
                                med.durationUnit === "days" ? "დღე" :
                                med.durationUnit === "weeks" ? "კვირა" : "თვე"
                              }</p>
                              <p className="text-white font-extrabold text-sm mt-0.5">{med.name}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {selectedMedId === med.id && <Check className="w-4 h-4 text-[#cdc1be]" />}
                              <button
                                type="button"
                                id={`delete-med-${med.id}`}
                                onClick={(e) => handleDeleteMedication(med.id, e)}
                                className="text-neutral-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-colors"
                                title="სიიდან წაშლა"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-neutral-500">
                          მედიკამენტები ვერ მოიძებნა. დაამატეთ „+“ ღილაკით.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. DATE AND TIME OPENED - Pre-filled & Editable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="time-inputs-container">
              
              <div className="space-y-2" id="open-date-container">
                <label htmlFor="open-date-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#756663]" />
                  გახსნის თარიღი
                </label>
                <div className="relative p-1 bg-[#161616] border-2 border-[#2b2423] rounded-2xl focus-within:border-[#756663] transition-all">
                  <input
                    type="date"
                    id="open-date-input"
                    style={{ colorScheme: 'dark' }}
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    className="block w-full bg-transparent border-none py-3.5 px-4 text-white text-sm font-sans font-extrabold focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2" id="open-time-container">
                <label htmlFor="open-time-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#756663]" />
                  გახსნის ზუსტი დრო
                </label>
                <div className="relative p-1 bg-[#161616] border-2 border-[#2b2423] rounded-2xl focus-within:border-[#756663] transition-all">
                  <input
                    type="time"
                    id="open-time-input"
                    style={{ colorScheme: 'dark' }}
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="block w-full bg-transparent border-none py-3.5 px-4 text-white text-sm font-sans font-extrabold focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* 3. NURSES INITIALS */}
            <div className="space-y-2" id="initials-container">
              <label htmlFor="nurse-initials-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#756663]" />
                მორიგე ექთნის ინიციალები
              </label>
              <div className="relative p-1 bg-[#161616] border-2 border-[#2b2423] rounded-2xl focus-within:border-[#756663] transition-all">
                <input
                  type="text"
                  id="nurse-initials-input"
                  placeholder="მაგ. ნ.ხ"
                  value={nurseInitials}
                  onChange={(e) => setNurseInitials(e.target.value)}
                  className="block w-full bg-transparent border-none py-3.5 px-4 text-white text-sm font-sans font-extrabold placeholder-neutral-650 focus:outline-none"
                />
              </div>
            </div>

            {/* PRINT OPTION BUTTON TRIPPED */}
            <div className="pt-4" id="print-trigger-container">
              <motion.button
                type="button"
                id="print-label-button"
                onClick={handlePrint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#756663] hover:bg-[#867571] text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 cursor-pointer font-sans text-base transition-colors duration-300"
              >
                <Printer className="w-5 h-5 shrink-0" />
                <span>მარკის ბეჭდვა (PRINT)</span>
              </motion.button>
            </div>

          </form>
        </motion.div>

        {/* Realtime physical preview on the right side */}
        <motion.div 
          className="lg:col-span-12 xl:col-span-5 flex flex-col justify-start space-y-6"
          id="preview-panel"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-left">
            <h4 className="text-[#cdc1be] font-black text-sm uppercase tracking-wider font-sans mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#756663] rounded-full"></span>
              სტიკერის მაკეტი (Live Preview)
            </h4>
            <span className="text-[10px] text-neutral-500 font-extrabold uppercase font-sans">
              ამ ფორმით დაიბეჭდება პრინტერზე
            </span>
          </div>

          <div 
            className="flex items-center justify-center bg-neutral-900/60 p-6 rounded-[2rem] border border-neutral-800/80 min-h-[300px]"
            id="staged-preview-holder"
          >
            {/* The Actual Sticker Mock - Scaled nicely */}
            {expInfo ? (
              <div 
                className="bg-white text-black border-2 border-black rounded-none shadow-2xl relative select-none w-[275px] h-[165px] flex flex-col justify-between overflow-hidden"
                id="physical-sticker-layout"
                style={{
                  padding: '1mm 1.5mm 1mm 1.5mm',
                  boxSizing: 'border-box'
                }}
              >
                <div className="w-full h-full flex flex-col justify-between text-black font-sans uppercase text-left" id="inner-sticker-rows">
                  {/* Row 1: Drug Name (Large, Centered, Bold with Dynamic Shrink-wrap) */}
                  <div 
                    className="text-center font-black uppercase font-sans truncate"
                    style={{ 
                      fontSize: expInfo.medName.length <= 9 ? '17.5pt' : expInfo.medName.length <= 13 ? '15.5pt' : '14pt',
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '-0.5px',
                      paddingBottom: '1px'
                    }}
                  >
                    {expInfo.medName}
                  </div>
                  {/* Row 2: Opened Date */}
                  <div 
                    className="font-black text-left font-sans flex items-baseline"
                    style={{
                      fontSize: '11.5pt',
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '-0.4px'
                    }}
                  >
                    გახსნის თარიღი: <span className="font-black ml-1" style={{ fontSize: '11.5pt', fontWeight: 900 }}>{expInfo.opened.dateStr}</span>
                  </div>
                  {/* Row 3: Opened Time */}
                  <div 
                    className="font-black text-left font-sans flex items-baseline"
                    style={{
                      fontSize: '11.5pt',
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '-0.4px'
                    }}
                  >
                    გახსნის დრო: <span className="font-black ml-1" style={{ fontSize: '11.5pt', fontWeight: 900 }}>{expInfo.opened.timeStr}</span>
                  </div>
                  {/* Row 3.5: Expiration Title */}
                  <div 
                    className="font-black text-left font-sans flex items-baseline"
                    style={{
                      fontSize: '11.5pt',
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '-0.4px'
                    }}
                  >
                    გახსნის ვადა: <span className="font-black ml-1" style={{ fontSize: '11.5pt', fontWeight: 950 }}>{expInfo.expires.fullStr}</span>
                  </div>
                  {/* Row 4: Nurse Initials */}
                  <div 
                    className="font-black text-left font-sans flex items-baseline"
                    style={{
                      fontSize: '11pt',
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '-0.3px'
                    }}
                  >
                    ექთნის ინიციალები: <span className="underline uppercase font-black ml-1" style={{ fontSize: '11pt', fontWeight: 900 }}>{nurseInitials || "ნ.ხ"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 font-extrabold text-xs text-center p-8">
                გთხოვთ, შეავსოთ პარამეტრები მარკირებისთვის.
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* POPUP MODAL DIALOG - FOR ADDING NEW MEDICATIONS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="med-add-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border-2 border-neutral-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative"
              id="med-add-form-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#756663]/5 rounded-full blur-[60px] pointer-events-none"></div>

              {/* Modal Head */}
              <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-[#131313]">
                <h4 className="text-[#cdc1be] text-lg font-black font-sans">ახალი მედიკამენტის დამატება</h4>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal form */}
              <form onSubmit={handleAddMedication} className="p-6 space-y-5" id="add-med-raw-form">
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="new-med-name-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
                    მედიკამენტის დასახელება
                  </label>
                  <div className="p-1 bg-[#161616] border-2 border-[#2b2423] rounded-xl focus-within:border-[#756663] transition-all">
                    <input 
                      type="text" 
                      id="new-med-name-input" 
                      placeholder="მაგ. ლიდოკაინი 2%"
                      value={newMedName}
                      onChange={(e) => {
                        setNewMedName(e.target.value);
                        if (newMedError) setNewMedError("");
                      }}
                      className="block w-full bg-transparent border-none py-2.5 px-3.5 text-white text-sm font-sans font-bold placeholder-neutral-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Expiry strength/value */}
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="space-y-2">
                    <label htmlFor="new-med-value-input" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
                      სტაბილობის ვადა (ციფრი)
                    </label>
                    <div className="p-1 bg-[#161616] border-2 border-[#2b2423] rounded-xl focus-within:border-[#756663] transition-all">
                      <input 
                        type="number" 
                        min="1"
                        id="new-med-value-input" 
                        value={newMedValue}
                        onChange={(e) => {
                          setNewMedValue(parseInt(e.target.value) || 0);
                          if (newMedError) setNewMedError("");
                        }}
                        className="block w-full bg-transparent border-none py-2.5 px-3.5 text-white text-sm font-sans font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-med-unit-select" className="block text-xs uppercase tracking-wider text-[#cdc1be] font-extrabold">
                      დროის ერთეული
                    </label>
                    <div className="p-1.5 bg-[#161616] border-2 border-[#2b2423] rounded-xl focus-within:border-[#756663] transition-all">
                      <select 
                        id="new-med-unit-select"
                        value={newMedUnit}
                        onChange={(e) => setNewMedUnit(e.target.value as any)}
                        style={{ colorScheme: 'dark' }}
                        className="block w-full bg-[#161616] border-none py-2 px-1 text-white text-sm font-sans font-bold focus:outline-none cursor-pointer outline-none"
                      >
                        <option value="hours" style={{ backgroundColor: '#111111', color: '#ffffff' }}>საათი</option>
                        <option value="days" style={{ backgroundColor: '#111111', color: '#ffffff' }}>დღე</option>
                        <option value="weeks" style={{ backgroundColor: '#111111', color: '#ffffff' }}>კვირა</option>
                        <option value="months" style={{ backgroundColor: '#111111', color: '#ffffff' }}>თვე</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Modal Inline Error Alert */}
                {newMedError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-200 text-xs font-bold font-sans">
                    {newMedError}
                  </div>
                )}

                {/* Submit actions */}
                <div className="pt-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-black text-neutral-400 hover:text-white bg-transparent border border-neutral-800 rounded-xl transition-all cursor-pointer"
                  >
                    გაუქმება
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-[#756663] hover:bg-[#867571] rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    დამატება და შენახვა
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL DIALOG - FOR CONFIRMING DELETION */}
      <AnimatePresence>
        {medToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="med-delete-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border-2 border-neutral-800 rounded-[2rem] p-6 max-w-sm w-full mx-auto relative overflow-hidden text-center shadow-2xl"
              id="med-delete-form-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
              <h4 className="text-[#cdc1be] text-lg font-black font-sans mb-2">მედიკამენტის წაშლა</h4>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed font-sans">
                დარწმუნებული ხართ, რომ გსურთ მედიკამენტის „<span className="text-white font-extrabold">{medToDelete.name}</span>“ სიიდან წაშლა?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  id="confirm-delete-cancel"
                  onClick={() => setMedToDelete(null)}
                  className="px-4 py-2.5 text-xs font-black text-neutral-400 hover:text-white bg-transparent border border-neutral-800 rounded-xl transition-all cursor-pointer"
                >
                  გაუქმება
                </button>
                <button
                  type="button"
                  id="confirm-delete-submit"
                  onClick={() => {
                    const remaining = medications.filter(m => m.id !== medToDelete.id);
                    setMedications(remaining);
                    if (selectedMedId === medToDelete.id) {
                      if (remaining.length > 0) {
                        setSelectedMedId(remaining[0].id);
                      } else {
                        setSelectedMedId("");
                      }
                    }
                    setMedToDelete(null);
                  }}
                  className="px-5 py-2.5 text-xs font-black text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  წაშლა
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKER PRINT LAYOUT OVERRIDES */}
      <style>{`
        input, select, option, textarea {
          color-scheme: dark !important;
        }
        select option {
          background-color: #111111 !important;
          color: #ffffff !important;
        }
        /* Custom dark option styling across all custom dropdowns */
        select {
          background-color: #111111 !important;
          color: #ffffff !important;
        }

        /* Screen-spec on sticker divs - fully borderless cells and container! */
        #physical-sticker-layout {
          border: 1.5px solid #000000 !important; /* simple high contrast screen outline */
          background-color: #ffffff !important;
          color: #000000 !important;
          padding: 1mm 1.5mm 1mm 1.5mm !important;
          box-sizing: border-box !important;
        }

        #inner-sticker-rows {
          font-family: 'Calibri', 'Arial', sans-serif !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          background-color: #ffffff !important;
          color: #000000 !important;
        }

        #inner-sticker-rows > div:first-child {
          font-weight: 900 !important;
          text-align: center !important;
          border-bottom: none !important;
          padding-bottom: 0px !important;
          line-height: 1.05 !important;
          letter-spacing: -0.5px !important;
        }

        #inner-sticker-rows > div:not(:first-child) {
          font-weight: 900 !important;
          color: #000000 !important;
          line-height: 1.05 !important;
          display: flex !important;
          justify-content: flex-start !important;
          align-items: baseline !important;
          letter-spacing: -0.4px !important;
        }

        #inner-sticker-rows span {
          font-weight: 900 !important;
          color: #000000 !important;
        }

        /* Embedded styling to enforce physical size of 50x30mm on actual thermal outputs */
        @media print {
          /* Setup pure raw zeroed print format to avoid thermal misalignment */
          @page {
            margin: 0 !important;
            size: auto; /* Uses physical thermal printer preferences default */
          }

          html, body, #root, #app-root, #app-main, #labeler-root {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            width: 100% !important;
          }

          /* Hide everything except the custom physical sticker box */
          nav, header, footer, #global-header, #global-footer, 
          #labeler-header, #inputs-panel, #staged-preview-holder, 
          #preview-panel h4, #preview-panel span, #med-add-modal, #med-delete-modal {
            display: none !important;
          }

          #labeler-root {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
          }

          #preview-panel {
            grid-column: span 12 / span 12 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #physical-sticker-layout {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1) !important;
            box-shadow: none !important;
            border: none !important; /* Borderless in print mode as requested */
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            
            /* Physical sizing strictly locked to 50x30mm */
            width: 50mm !important;
            height: 30mm !important;
            
            /* Safe zone padding */
            padding: 1mm 1.5mm 1mm 1.5mm !important;
            box-sizing: border-box !important;
            border-radius: 0px !important;
          }

          #physical-sticker-layout .absolute {
            display: none !important; /* Hide mm label on print */
          }

          #inner-sticker-rows {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }

          /* Match physical high-contrast Calibri style for titles on 50x30mm */
          #inner-sticker-rows > div:first-child {
            /* Managed by react inline logic but overridden safely */
            font-weight: 900 !important;
            text-align: center !important;
            text-transform: uppercase !important;
            line-height: 1.05 !important;
            margin-bottom: 0px !important;
            letter-spacing: -0.5px !important;
          }

          /* Make text inside the table fully dark and robustly legible without lines */
          #inner-sticker-rows > div:not(:first-child) {
            font-weight: 900 !important;
            color: #000000 !important;
            line-height: 1.05 !important;
            display: flex !important;
            justify-content: flex-start !important;
            align-items: baseline !important;
            letter-spacing: -0.4px !important;
          }

          #inner-sticker-rows span {
            font-weight: 900 !important;
            color: #000000 !important;
          }
        }
      `}</style>

    </div>
  );
}
