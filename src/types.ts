export interface VaccineMilestone {
  day: number;
  label: string;
  date: Date;
  formattedDate: string;      // DD.MM.YYYY
  formattedLongDate: string;  // e.g. "4 ივნისი, 2026, ხუთშაბათი"
  statusDescription: string;  // description of this dose
}

export interface CalculationResult {
  startDate: Date;
  milestones: VaccineMilestone[];
}
