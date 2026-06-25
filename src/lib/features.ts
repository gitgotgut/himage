import {
  Mail,
  MailOpen,
  Bell,
  BarChart3,
  TrendingUp,
  CreditCard,
  Globe,
  Calculator,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  name: string;
  nameKey: string;
  href: string;
  icon: LucideIcon;
  description: string;
  descriptionKey: string;
};

export const FEATURES: Feature[] = [
  { name: "Gmail AI Import", nameKey: "features.gmailImport", href: "/gmail", icon: Mail, description: "Auto-detect subscriptions from receipts", descriptionKey: "features.gmailImportDesc" },
  { name: "Outlook AI Import", nameKey: "features.outlookImport", href: "/outlook", icon: MailOpen, description: "Auto-detect subscriptions from Outlook", descriptionKey: "features.outlookImportDesc" },
  { name: "Email Reminders", nameKey: "features.emailReminders", href: "/features/email-reminders", icon: Bell, description: "Renewal alerts and trial expiry warnings", descriptionKey: "features.emailRemindersDesc" },
  { name: "Spending Insights", nameKey: "features.spendingInsights", href: "/features/spending-insights", icon: BarChart3, description: "Monthly trends and spending analysis", descriptionKey: "features.spendingInsightsDesc" },
  { name: "Price Detection", nameKey: "features.priceDetection", href: "/features/price-detection", icon: TrendingUp, description: "Know when subscription prices change", descriptionKey: "features.priceDetectionDesc" },
  { name: "Subscription Tracking", nameKey: "features.subscriptionTracking", href: "/features/subscription-tracking", icon: CreditCard, description: "All your subscriptions in one place", descriptionKey: "features.subscriptionTrackingDesc" },
  { name: "Multi-Currency", nameKey: "features.multiCurrency", href: "/features/multi-currency", icon: Globe, description: "Live exchange rates for global subs", descriptionKey: "features.multiCurrencyDesc" },
  { name: "Cancel Calculator", nameKey: "features.cancelCalculator", href: "/features/cancel-calculator", icon: Calculator, description: "See how much you could save", descriptionKey: "features.cancelCalculatorDesc" },
  { name: "Household Sharing", nameKey: "features.householdSharing", href: "/features/household-sharing", icon: Users, description: "Share tracking with your family", descriptionKey: "features.householdSharingDesc" },
];
