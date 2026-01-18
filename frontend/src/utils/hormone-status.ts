export const HormoneStatus = {
  IN_RANGE: "IN_RANGE",
  OUT_OF_RANGE: "OUT_OF_RANGE",
  NO_DATA: "NO_DATA",
} as const;

export type HormoneStatusType = (typeof HormoneStatus)[keyof typeof HormoneStatus];

export const getHormoneStatus = (
  value: number | null | undefined,
  isInRange: boolean | null,
): HormoneStatusType => {
  if (!value) return HormoneStatus.NO_DATA;
  if (isInRange === false) return HormoneStatus.OUT_OF_RANGE;

  return HormoneStatus.IN_RANGE;
};

export const statusStyles = {
  [HormoneStatus.OUT_OF_RANGE]: {
    container: "border-orange-200 bg-orange-50",
    badge: "bg-orange-100 text-orange-800",
    color: "#f97316",
  },
  [HormoneStatus.IN_RANGE]: {
    container: "border-green-200 bg-green-50",
    badge: "bg-green-100 text-green-800",
    color: "#16a34a",
  },
  [HormoneStatus.NO_DATA]: {
    container: "border-slate-200 bg-slate-50",
    badge: "bg-slate-100 text-slate-800",
    color: "#94a3b8",
  },
} as const;
