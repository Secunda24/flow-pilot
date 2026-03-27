import type { FlowPilotRole } from "@/lib/flowpilot-data";

export type FlowPilotNavIcon =
  | "activity"
  | "bar-chart"
  | "bell"
  | "blocks"
  | "bot"
  | "contact-round"
  | "layout-dashboard"
  | "link"
  | "list-todo"
  | "megaphone"
  | "settings"
  | "sparkles";

export interface FlowPilotNavItem {
  label: string;
  href: string;
  icon: FlowPilotNavIcon;
  roles?: FlowPilotRole[];
}

const workspaceItems: FlowPilotNavItem[] = [
  {
    label: "Dashboard",
    href: "/workspace",
    icon: "layout-dashboard"
  },
  {
    label: "Automations",
    href: "/workspace/automations",
    icon: "bot"
  },
  {
    label: "Builder",
    href: "/workspace/automations/new",
    icon: "sparkles",
    roles: ["admin", "manager"]
  },
  {
    label: "Social Planner",
    href: "/workspace/social",
    icon: "megaphone"
  },
  {
    label: "Run Logs",
    href: "/workspace/logs",
    icon: "activity"
  },
  {
    label: "Tasks",
    href: "/workspace/tasks",
    icon: "list-todo"
  },
  {
    label: "Notifications",
    href: "/workspace/notifications",
    icon: "bell"
  },
  {
    label: "Contacts",
    href: "/workspace/contacts",
    icon: "contact-round"
  },
  {
    label: "Templates",
    href: "/workspace/templates",
    icon: "blocks"
  },
  {
    label: "Reporting",
    href: "/workspace/reporting",
    icon: "bar-chart"
  },
  {
    label: "Integrations",
    href: "/workspace/integrations",
    icon: "link"
  },
  {
    label: "Settings",
    href: "/workspace/settings",
    icon: "settings",
    roles: ["admin"]
  }
];

export function getWorkspaceNav(role: FlowPilotRole) {
  return workspaceItems.filter((item) => !item.roles || item.roles.includes(role));
}

export const flowPilotMarketingNav = [
  { label: "Platform", href: "/#platform" },
  { label: "Workflows", href: "/#workflows" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" }
];
