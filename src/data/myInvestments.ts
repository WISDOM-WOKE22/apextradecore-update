export type InvestmentStatus = "active" | "completed" | "pending";

export interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  amount?: number;
  description?: string;
  completed: boolean;
}

export interface MyInvestment {
  id: string;
  planName: string;
  invested: number;
  returns: number;
  progress: number;
  status: InvestmentStatus;
  startDate: string;
  expectedEndDate: string;
  bonus: number;
  color: string;
  timeline: TimelineEvent[];
}

export const MOCK_MY_INVESTMENTS: MyInvestment[] = [
  {
    id: "deluxe-1",
    planName: "Deluxe",
    invested: 13400,
    returns: 53600,
    progress: 100,
    status: "completed",
    startDate: "2025-01-10T09:00:00",
    expectedEndDate: "2025-01-13T18:00:00",
    bonus: 500,
    color: "from-[#6366f1] to-[#8b5cf6]",
    timeline: [
      { id: "1", label: "Investment started", date: "2025-01-10T09:00:00", amount: 13400, completed: true },
      { id: "2", label: "First return credited", date: "2025-01-12T14:00:00", amount: 26800, completed: true },
      { id: "3", label: "Bonus credited", date: "2025-01-12T14:00:00", amount: 500, description: "First-time investor bonus", completed: true },
      { id: "4", label: "Final payout", date: "2025-01-13T18:00:00", amount: 53600, completed: true },
    ],
  },
  {
    id: "premium-1",
    planName: "Premium",
    invested: 30700,
    returns: 79820,
    progress: 65,
    status: "active",
    startDate: "2025-01-20T10:00:00",
    expectedEndDate: "2025-01-23T18:00:00",
    bonus: 500,
    color: "from-[#059669] to-[#10b981]",
    timeline: [
      { id: "1", label: "Investment started", date: "2025-01-20T10:00:00", amount: 30700, completed: true },
      { id: "2", label: "First return credited", date: "2025-01-22T11:00:00", amount: 39910, completed: true },
      { id: "3", label: "Bonus credited", date: "2025-01-22T11:00:00", amount: 500, description: "First-time investor bonus", completed: true },
      { id: "4", label: "Final payout", date: "2025-01-23T18:00:00", amount: 122800, completed: false },
    ],
  },
];

export function getInvestmentById(id: string): MyInvestment | undefined {
  return MOCK_MY_INVESTMENTS.find((inv) => inv.id === id);
}
