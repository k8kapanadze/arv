import { VaccineMilestone, CalculationResult } from "./types";

const GEORGIAN_MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი"
];

const GEORGIAN_WEEKDAYS = [
  "კვირა",
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი"
];

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatNumericDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function formatLongDate(date: Date): string {
  const d = date.getDate();
  const month = GEORGIAN_MONTHS[date.getMonth()];
  const yyyy = date.getFullYear();
  const weekday = GEORGIAN_WEEKDAYS[date.getDay()];
  return `${d} ${month}, ${yyyy} წელი, ${weekday}`;
}

const MILESTONE_DEFS = [
  {
    day: 0,
    label: "0 დღე",
    statusDescription: "I დოზა — საწყისი აცრა (კეთდება დაუყოვნებლივ პირველივე შესაძლებლობისთანავე)",
  },
  {
    day: 3,
    label: "მე-3 დღე",
    statusDescription: "II დოზა — მეორე აცრა საწყისი დღიდან 3 დღის შემდეგ",
  },
  {
    day: 7,
    label: "მე-7 დღე",
    statusDescription: "III დოზა — მესამე აცრა საწყისი დღიდან 7 დღის შემდეგ",
  },
  {
    day: 14,
    label: "მე-14 დღე",
    statusDescription: "IV დოზა — მეოთხე აცრა საწყისი დღიდან 14 დღის შემდეგ",
  },
  {
    day: 28,
    label: "28-ე დღე",
    statusDescription: "V დოზა — მეხუთე აცრა საწყისი დღიდან 28 დღის შემდეგ (სრული კურსის დასასრული)",
  },
];

export function calculateSchedule(dateStr: string): CalculationResult {
  const startDate = parseLocalDate(dateStr);
  
  const milestones: VaccineMilestone[] = MILESTONE_DEFS.map((def) => {
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + def.day);
    
    return {
      day: def.day,
      label: def.label,
      date: targetDate,
      formattedDate: formatNumericDate(targetDate),
      formattedLongDate: formatLongDate(targetDate),
      statusDescription: def.statusDescription,
    };
  });

  return {
    startDate,
    milestones,
  };
}
