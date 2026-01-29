import type { MembershipCardProps } from "./MembershipCard";

export const MEMBERSHIP_PLANS: Omit<MembershipCardProps, "variant">[] = [
  {
    title: "Deluxe Membership Card",
    price: "$13,400.00",
    description:
      "Access to tailored financial advice for growth, High security on transactions and investments.",
    features: [
      "400% return in 3 business days",
      "$500 bonus for first-time investors",
      "Flexible transfer options for payouts",
      "Priority customer support",
    ],
  },
  {
    title: "Standard Membership Card",
    price: "$22,999.00",
    description:
      "Dedicated business support services, Priority processing for investment transactions.",
    features: [
      "400% return in 3 business days",
      "$500 bonus for first-time investors",
      "Instant payouts on returns",
      "Exclusive high-yield investment options",
    ],
  },
  {
    title: "Premium Membership Card",
    price: "$30,700.00",
    description:
      "Premium customer service with direct access, Custom investment plans available for businesses.",
    features: [
      "400% return in 3 business days",
      "$500 bonus for first-time investors",
      "Exclusive networking opportunities with investors",
    ],
    badge: "Best Value",
  },
  {
    title: "Gold Membership Card",
    price: "$48,400.00",
    description:
      "Note: The Gold Membership Card includes a complimentary Tesla Model 3 vehicle. Exclusive financial planning sessions.",
    features: [
      "400% return in 3 business days",
      "$500 bonus for first-time investors",
      "VIP customer service with top-tier support",
      "Complimentary Tesla Model 3",
    ],
  },
];
