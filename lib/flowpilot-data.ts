import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
  subDays,
  subHours,
  subMinutes
} from "date-fns";

import { env } from "@/lib/env";

export type FlowPilotRole = "admin" | "manager" | "staff_viewer";
export type AutomationStatus = "Active" | "Paused" | "Draft";
export type RunResult = "Success" | "Failed" | "Pending";
export type StepResult = "Executed" | "Failed" | "Pending";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Open" | "In Progress" | "Waiting" | "Completed";
export type NotificationChannel = "Email" | "WhatsApp" | "In-app";
export type NotificationStatus = "Delivered" | "Queued" | "Failed";
export type ContactStatus =
  | "New"
  | "Qualified"
  | "Proposal"
  | "Active"
  | "Dormant";
export type IntegrationStatus = "Connected" | "Not connected" | "Coming soon";
export type SocialPostStatus =
  | "Scheduled"
  | "Awaiting approval"
  | "Published"
  | "Needs edits";
export type SocialChannelStatus = "Healthy" | "Needs review" | "Building";

export interface FlowPilotCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
  timezone: string;
  teamSize: number;
  activeWorkflows: number;
  plan: "Growth" | "Scale" | "Enterprise";
}

export interface FlowPilotProfile {
  id: string;
  fullName: string;
  email: string;
  role: FlowPilotRole;
  title: string;
  avatar: string;
  companyId: string;
  team: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

export interface WorkflowAction {
  id: string;
  type: string;
  label: string;
  description: string;
  channel?: string;
  delayHours?: number;
}

export interface FlowPilotAutomation {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: AutomationStatus;
  triggerType: string;
  triggerLabel: string;
  triggerDescription: string;
  owner: string;
  vertical: string;
  lastEditedBy: string;
  lastEditedAt: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export interface FlowPilotAutomationSummary extends FlowPilotAutomation {
  runs: number;
  lastRun: string | null;
  successRate: number;
  failureCount: number;
  pendingCount: number;
}

export interface ConditionResult {
  id: string;
  label: string;
  outcome: "Passed" | "Failed";
  detail: string;
}

export interface RunStep {
  id: string;
  label: string;
  channel: string;
  status: StepResult;
  happenedAt: string;
  detail: string;
}

export interface RunTriggerField {
  label: string;
  value: string;
}

export interface FlowPilotRun {
  id: string;
  companyId: string;
  automationId: string;
  automationName: string;
  triggeredBy: string;
  sourceEvent: string;
  startedAt: string;
  durationMs: number;
  result: RunResult;
  errorReason?: string;
  triggerFields: RunTriggerField[];
  conditionResults: ConditionResult[];
  actionTimeline: RunStep[];
}

export interface FlowPilotTask {
  id: string;
  companyId: string;
  automationId: string;
  title: string;
  contactName: string;
  dueAt: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface FlowPilotNotification {
  id: string;
  companyId: string;
  automationId?: string;
  title: string;
  detail: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  createdAt: string;
  unread: boolean;
}

export interface FlowPilotContact {
  id: string;
  companyId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ContactStatus;
  source: string;
  assignedUser: string;
  tags: string[];
  lastTouchAt: string;
}

export interface FlowPilotTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  triggerType: string;
  triggerLabel: string;
  estimatedLift: string;
  stepsSummary: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export interface FlowPilotActivityItem {
  id: string;
  companyId: string;
  title: string;
  detail: string;
  createdAt: string;
  severity: "info" | "warning" | "success" | "danger";
}

export interface FlowPilotIntegration {
  id: string;
  companyId?: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
}

export interface FlowPilotSocialPost {
  id: string;
  companyId: string;
  automationId?: string;
  title: string;
  caption: string;
  campaign: string;
  channels: string[];
  status: SocialPostStatus;
  owner: string;
  assetType: "Image" | "Carousel" | "Video" | "Text";
  scheduledFor: string;
  publishedAt?: string;
}

export interface FlowPilotSocialChannel {
  id: string;
  companyId: string;
  name: string;
  handle: string;
  cadence: string;
  queueDepth: number;
  engagementRate: number;
  bestWindow: string;
  status: SocialChannelStatus;
  connectedVia: string;
}

export interface FlowPilotMetric {
  label: string;
  value: string;
  change: string;
  tone: "brand" | "success" | "warning" | "danger";
}

export interface FlowPilotSearchItem {
  id: string;
  label: string;
  type: string;
  href: string;
  meta?: string;
}

const baseDate = new Date("2026-03-27T08:30:00.000Z");

const statusCycle: ContactStatus[] = [
  "New",
  "Qualified",
  "Proposal",
  "Active",
  "Dormant"
];
const sourceCycle = [
  "Facebook Ads",
  "Website Form",
  "Referral",
  "Google Ads",
  "WhatsApp",
  "Webinar"
] as const;
const assigneeCycle = [
  "Daniel Park",
  "Mia Alvarez",
  "Noah Peters",
  "Ayesha Khan",
  "Marcus Bell",
  "Lebo Maseko"
] as const;
const companyDistribution = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3,
  4, 4, 4, 4, 4,
  5, 5, 5
] as const;
const contactNameSeeds = [
  "Keagan Mokoena",
  "Anika Naidoo",
  "Jade Cloete",
  "Mason Dube",
  "Priya Singh",
  "Noah Bennett",
  "Talia Martin",
  "Sibusiso Khumalo",
  "Cara Johnson",
  "Aiden Patel",
  "Tanya Bosman",
  "Luca Ferreira",
  "Sofia Meyer",
  "Owen Jacobs",
  "Yasmin Daniels",
  "Mila Thompson",
  "Caleb Harris",
  "Nina Clark",
  "Ava Peterson",
  "Jayden Reed",
  "Riley Hughes",
  "Ella Foster",
  "Ethan Morris",
  "Leah Price",
  "Jonah Bell",
  "Mia Sullivan",
  "Samir Khan",
  "Aaliyah Adams",
  "Luke Barrett",
  "Kiara White",
  "Liam Cooper",
  "Zoe Palmer",
  "Kai Russell",
  "Maya Brooks",
  "Tyler Green"
] as const;
const failureReasons = [
  "WhatsApp gateway returned a 502 response from the downstream provider.",
  "Gmail OAuth token expired before the confirmation email step executed.",
  "Task assignment was blocked because the selected staff user is inactive.",
  "Invoice reminder skipped because the overdue record had no due date metadata.",
  "Webhook placeholder timed out after waiting 10 seconds for a response.",
  "Duplicate client record prevented the welcome workflow from opening a new profile.",
  "Calendar follow-up failed because the company timezone was not mapped.",
  "Document acknowledgement stopped when the shared file URL expired."
] as const;
const failedRunIndexes = [7, 23, 37, 51, 67, 82, 99, 116] as const;
const pendingRunIndexes = [5, 13, 21, 29, 45, 60, 74, 87, 108, 118] as const;

function createEmail(name: string, company: string) {
  const local = name.toLowerCase().replace(/[^a-z]+/g, ".");
  const domain = company.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${local}@${domain}.com`;
}

export const flowPilotCompanies: FlowPilotCompany[] = [
  {
    id: "company-1",
    name: "BluePeak Property Group",
    industry: "Real estate operations",
    location: "Johannesburg, ZA",
    timezone: "Africa/Johannesburg",
    teamSize: 18,
    activeWorkflows: 4,
    plan: "Enterprise"
  },
  {
    id: "company-2",
    name: "North Ridge Accounting",
    industry: "Accounting and advisory",
    location: "Cape Town, ZA",
    timezone: "Africa/Johannesburg",
    teamSize: 11,
    activeWorkflows: 2,
    plan: "Growth"
  },
  {
    id: "company-3",
    name: "Harbor Health Bookings",
    industry: "Healthcare scheduling",
    location: "Austin, US",
    timezone: "America/Chicago",
    teamSize: 23,
    activeWorkflows: 2,
    plan: "Scale"
  },
  {
    id: "company-4",
    name: "Luma Service Collective",
    industry: "Home and field services",
    location: "London, UK",
    timezone: "Europe/London",
    teamSize: 16,
    activeWorkflows: 1,
    plan: "Scale"
  },
  {
    id: "company-5",
    name: "Amandel Studio",
    industry: "Creative agency operations",
    location: "Amsterdam, NL",
    timezone: "Europe/Amsterdam",
    teamSize: 9,
    activeWorkflows: 1,
    plan: "Growth"
  },
  {
    id: "company-6",
    name: "Vector Solar Installations",
    industry: "Solar and field installation",
    location: "Denver, US",
    timezone: "America/Denver",
    teamSize: 28,
    activeWorkflows: 2,
    plan: "Enterprise"
  }
];

export const flowPilotProfiles: FlowPilotProfile[] = [
  {
    id: "profile-admin",
    fullName: "Olivia Morris",
    email: env.demoAdminEmail,
    role: "admin",
    title: "Platform Administrator",
    avatar: "OM",
    companyId: "company-1",
    team: "Revenue Ops"
  },
  {
    id: "profile-manager",
    fullName: "Daniel Park",
    email: env.demoManagerEmail,
    role: "manager",
    title: "Automation Manager",
    avatar: "DP",
    companyId: "company-1",
    team: "Sales Ops"
  },
  {
    id: "profile-staff",
    fullName: "Mia Alvarez",
    email: env.demoStaffEmail,
    role: "staff_viewer",
    title: "Operations Viewer",
    avatar: "MA",
    companyId: "company-1",
    team: "Client Success"
  }
];

export const flowPilotDemoCredentials = {
  admin: {
    email: env.demoAdminEmail,
    password: env.demoAdminPassword
  },
  manager: {
    email: env.demoManagerEmail,
    password: env.demoManagerPassword
  },
  staff_viewer: {
    email: env.demoStaffEmail,
    password: env.demoStaffPassword
  }
};

export const flowPilotContacts: FlowPilotContact[] = contactNameSeeds.map((name, index) => {
  const company = flowPilotCompanies[companyDistribution[index]];
  const status = statusCycle[index % statusCycle.length];
  const source = sourceCycle[index % sourceCycle.length];
  const assignedUser = assigneeCycle[index % assigneeCycle.length];

  return {
    id: `contact-${String(index + 1).padStart(2, "0")}`,
    companyId: company.id,
    name,
    company: company.name,
    email: createEmail(name, company.name),
    phone: `+27 71 55${String(index + 100).slice(-3)} ${String(1000 + index).slice(-4)}`,
    status,
    source,
    assignedUser,
    tags: [company.industry.split(" ")[0], source.split(" ")[0]],
    lastTouchAt: subHours(baseDate, index * 5 + 2).toISOString()
  };
});

export const flowPilotAutomations: FlowPilotAutomation[] = [
  {
    id: "automation-1",
    companyId: "company-1",
    name: "New Facebook Lead Follow-Up",
    description:
      "Respond to paid social leads in under five minutes, open a task, and move the deal into the first sales stage.",
    status: "Active",
    triggerType: "lead_created",
    triggerLabel: "New lead created",
    triggerDescription: "Runs whenever a new lead lands from Meta lead forms.",
    owner: "Daniel Park",
    vertical: "Sales",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 2).toISOString(),
    conditions: [
      {
        id: "cond-1-1",
        field: "Lead source",
        operator: "=",
        value: "Facebook",
        label: "Only if lead source = Facebook"
      },
      {
        id: "cond-1-2",
        field: "Assigned team",
        operator: "=",
        value: "Sales",
        label: "Only if assigned team = Sales"
      }
    ],
    actions: [
      {
        id: "action-1-1",
        type: "whatsapp",
        label: "Send WhatsApp intro",
        description: "Deliver an instant welcome message from the lead concierge number.",
        channel: "WhatsApp"
      },
      {
        id: "action-1-2",
        type: "task",
        label: "Create sales callback task",
        description: "Assign a 30-minute callback task to the inside sales queue.",
        channel: "Task"
      },
      {
        id: "action-1-3",
        type: "status",
        label: "Move deal to Contacted",
        description: "Update the lead stage so the team sees a live response clock.",
        channel: "CRM"
      }
    ]
  },
  {
    id: "automation-2",
    companyId: "company-1",
    name: "Booking Confirmation + Reminder",
    description:
      "Confirm new bookings instantly, remind the client the day before, and notify staff in the daily schedule.",
    status: "Active",
    triggerType: "booking_created",
    triggerLabel: "New booking made",
    triggerDescription: "Fires when a consultation booking is created.",
    owner: "Mia Alvarez",
    vertical: "Scheduling",
    lastEditedBy: "Daniel Park",
    lastEditedAt: subDays(baseDate, 4).toISOString(),
    conditions: [
      {
        id: "cond-2-1",
        field: "Booking type",
        operator: "=",
        value: "Consultation",
        label: "Only if booking type = Consultation"
      }
    ],
    actions: [
      {
        id: "action-2-1",
        type: "email",
        label: "Send confirmation email",
        description: "Deliver location details, agenda, and reschedule links.",
        channel: "Email"
      },
      {
        id: "action-2-2",
        type: "delay",
        label: "Wait 24 hours before appointment",
        description: "Queue the reminder step for the morning before the booking.",
        channel: "Delay",
        delayHours: 24
      },
      {
        id: "action-2-3",
        type: "notify",
        label: "Notify assigned staff",
        description: "Push the booking summary to the in-app staff feed.",
        channel: "In-app"
      }
    ]
  },
  {
    id: "automation-3",
    companyId: "company-1",
    name: "48h No Reply Escalation",
    description:
      "Escalate conversations that stall after two days and create follow-up work for the team lead.",
    status: "Active",
    triggerType: "no_reply",
    triggerLabel: "No reply after 48 hours",
    triggerDescription: "Checks for inactive leads every hour.",
    owner: "Daniel Park",
    vertical: "Sales",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 1).toISOString(),
    conditions: [
      {
        id: "cond-3-1",
        field: "No reply window",
        operator: ">=",
        value: "48 hours",
        label: "Only if no reply after 48 hours"
      },
      {
        id: "cond-3-2",
        field: "Lead status",
        operator: "=",
        value: "Pending",
        label: "Only if status = Pending"
      }
    ],
    actions: [
      {
        id: "action-3-1",
        type: "notify",
        label: "Notify manager",
        description: "Alert the sales manager inside the dashboard and by email.",
        channel: "In-app"
      },
      {
        id: "action-3-2",
        type: "task",
        label: "Create follow-up task",
        description: "Open a manual callback task with the contact history attached.",
        channel: "Task"
      },
      {
        id: "action-3-3",
        type: "tag",
        label: "Add stalled-conversation tag",
        description: "Makes the lead easy to segment in the CRM.",
        channel: "CRM"
      }
    ]
  },
  {
    id: "automation-4",
    companyId: "company-1",
    name: "Social Post Approval + Publish",
    description:
      "Route social post drafts for approval, notify stakeholders, and trigger a publish webhook when approved.",
    status: "Paused",
    triggerType: "status_changed",
    triggerLabel: "Status changed",
    triggerDescription: "Starts when a content request moves to Awaiting Approval.",
    owner: "Mia Alvarez",
    vertical: "Marketing",
    lastEditedBy: "Daniel Park",
    lastEditedAt: subDays(baseDate, 6).toISOString(),
    conditions: [
      {
        id: "cond-4-1",
        field: "Post channel",
        operator: "in",
        value: "Instagram, LinkedIn",
        label: "Only if post channel is Instagram or LinkedIn"
      }
    ],
    actions: [
      {
        id: "action-4-1",
        type: "task",
        label: "Create approval task",
        description: "Assign a review task to the content lead with the draft attached.",
        channel: "Task"
      },
      {
        id: "action-4-2",
        type: "email",
        label: "Send review email",
        description: "Notify the manager that approval is waiting.",
        channel: "Email"
      },
      {
        id: "action-4-3",
        type: "webhook",
        label: "Trigger publish webhook placeholder",
        description: "Send the approved post to the publishing service placeholder.",
        channel: "Webhook"
      }
    ]
  },
  {
    id: "automation-5",
    companyId: "company-2",
    name: "Invoice Due Reminder",
    description:
      "Remind clients before an invoice becomes overdue, then update the account status if payment has not landed.",
    status: "Active",
    triggerType: "invoice_overdue",
    triggerLabel: "Invoice overdue",
    triggerDescription: "Runs on invoices due within the next three days.",
    owner: "Marcus Bell",
    vertical: "Finance",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 3).toISOString(),
    conditions: [
      {
        id: "cond-5-1",
        field: "Invoice amount",
        operator: ">",
        value: "$500",
        label: "Only if invoice > amount"
      }
    ],
    actions: [
      {
        id: "action-5-1",
        type: "email",
        label: "Send reminder email",
        description: "Send a polite reminder with a payment link and due date.",
        channel: "Email"
      },
      {
        id: "action-5-2",
        type: "status",
        label: "Update account status",
        description: "Mark the account as Payment Reminder Sent.",
        channel: "Billing"
      }
    ]
  },
  {
    id: "automation-6",
    companyId: "company-2",
    name: "New Client Welcome Sequence",
    description:
      "Create the client record, queue the onboarding email, and generate the first task list for finance onboarding.",
    status: "Active",
    triggerType: "form_submitted",
    triggerLabel: "Form submitted",
    triggerDescription: "Runs when the signed onboarding form is submitted.",
    owner: "Marcus Bell",
    vertical: "Onboarding",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 8).toISOString(),
    conditions: [
      {
        id: "cond-6-1",
        field: "Form type",
        operator: "=",
        value: "Client onboarding",
        label: "Only if form submitted = Client onboarding"
      }
    ],
    actions: [
      {
        id: "action-6-1",
        type: "record",
        label: "Create client record",
        description: "Provision the contact, tags, and account owner.",
        channel: "CRM"
      },
      {
        id: "action-6-2",
        type: "email",
        label: "Send welcome sequence",
        description: "Deliver setup instructions and timeline expectations.",
        channel: "Email"
      },
      {
        id: "action-6-3",
        type: "task",
        label: "Create onboarding checklist",
        description: "Assign kickoff tasks to the finance team.",
        channel: "Task"
      }
    ]
  },
  {
    id: "automation-7",
    companyId: "company-3",
    name: "Missed Appointment Recovery",
    description:
      "Follow up after no-shows, offer a new booking link, and flag repeated misses for staff review.",
    status: "Active",
    triggerType: "status_changed",
    triggerLabel: "Status changed",
    triggerDescription: "Runs when an appointment is marked as missed.",
    owner: "Ayesha Khan",
    vertical: "Patient ops",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 5).toISOString(),
    conditions: [
      {
        id: "cond-7-1",
        field: "Appointment status",
        operator: "=",
        value: "Missed",
        label: "Only if status = Missed"
      }
    ],
    actions: [
      {
        id: "action-7-1",
        type: "whatsapp",
        label: "Send rebooking message",
        description: "Offer a quick rebooking link by WhatsApp.",
        channel: "WhatsApp"
      },
      {
        id: "action-7-2",
        type: "task",
        label: "Flag to front-desk queue",
        description: "Open a review task for repeated missed appointments.",
        channel: "Task"
      }
    ]
  },
  {
    id: "automation-8",
    companyId: "company-3",
    name: "Sales Team Instant Alert",
    description:
      "Notify the duty manager when high-value leads arrive after hours so they can respond before the next morning.",
    status: "Draft",
    triggerType: "lead_created",
    triggerLabel: "New lead created",
    triggerDescription: "Captures priority leads worth more than the VIP threshold.",
    owner: "Ayesha Khan",
    vertical: "Sales",
    lastEditedBy: "Mia Alvarez",
    lastEditedAt: subDays(baseDate, 10).toISOString(),
    conditions: [
      {
        id: "cond-8-1",
        field: "Lead value",
        operator: ">",
        value: "$2,000",
        label: "Only if lead value > amount"
      },
      {
        id: "cond-8-2",
        field: "Time window",
        operator: "outside",
        value: "Business hours",
        label: "Only if outside business hours"
      }
    ],
    actions: [
      {
        id: "action-8-1",
        type: "notify",
        label: "Notify duty manager",
        description: "Push an urgent alert to mobile and email.",
        channel: "In-app"
      }
    ]
  },
  {
    id: "automation-9",
    companyId: "company-4",
    name: "Document Submission Acknowledgement",
    description:
      "Acknowledge uploaded documents, tag the client record, and route a review task to operations.",
    status: "Active",
    triggerType: "document_uploaded",
    triggerLabel: "Document uploaded",
    triggerDescription: "Starts when a client uploads a required document.",
    owner: "Lebo Maseko",
    vertical: "Operations",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 7).toISOString(),
    conditions: [
      {
        id: "cond-9-1",
        field: "Document type",
        operator: "=",
        value: "Compliance Pack",
        label: "Only if document uploaded = Compliance Pack"
      }
    ],
    actions: [
      {
        id: "action-9-1",
        type: "email",
        label: "Send acknowledgement email",
        description: "Confirm receipt and next review steps.",
        channel: "Email"
      },
      {
        id: "action-9-2",
        type: "task",
        label: "Create review task",
        description: "Assign the document review to operations.",
        channel: "Task"
      },
      {
        id: "action-9-3",
        type: "note",
        label: "Create audit note",
        description: "Log the upload in the client timeline for traceability.",
        channel: "CRM"
      }
    ]
  },
  {
    id: "automation-10",
    companyId: "company-5",
    name: "Payment Received Thank You",
    description:
      "Acknowledge payment, update the account to settled, and create a follow-up event for the account manager.",
    status: "Paused",
    triggerType: "payment_received",
    triggerLabel: "Payment received",
    triggerDescription: "Runs when a payment webhook confirms settlement.",
    owner: "Marcus Bell",
    vertical: "Finance",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 9).toISOString(),
    conditions: [
      {
        id: "cond-10-1",
        field: "Payment amount",
        operator: ">",
        value: "$250",
        label: "Only if payment > amount"
      }
    ],
    actions: [
      {
        id: "action-10-1",
        type: "email",
        label: "Send thank-you email",
        description: "Confirm payment receipt and thank the client.",
        channel: "Email"
      },
      {
        id: "action-10-2",
        type: "status",
        label: "Update status to Settled",
        description: "Keep the finance dashboard current.",
        channel: "Billing"
      }
    ]
  },
  {
    id: "automation-11",
    companyId: "company-6",
    name: "VIP Lead Priority Routing",
    description:
      "Push VIP leads to the top of the queue, notify the manager, and shorten the follow-up SLA.",
    status: "Active",
    triggerType: "lead_created",
    triggerLabel: "New lead created",
    triggerDescription: "Runs when a lead is tagged VIP or above the premium threshold.",
    owner: "Noah Peters",
    vertical: "Revenue",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 2).toISOString(),
    conditions: [
      {
        id: "cond-11-1",
        field: "Lead tag",
        operator: "=",
        value: "VIP",
        label: "Only if lead tag = VIP"
      }
    ],
    actions: [
      {
        id: "action-11-1",
        type: "notify",
        label: "Notify manager",
        description: "Send a same-minute alert to the revenue manager.",
        channel: "In-app"
      },
      {
        id: "action-11-2",
        type: "task",
        label: "Create priority callback",
        description: "Add a 15-minute callback task to the hot lead queue.",
        channel: "Task"
      },
      {
        id: "action-11-3",
        type: "tag",
        label: "Add VIP priority tag",
        description: "Makes the lead stand out in all downstream dashboards.",
        channel: "CRM"
      }
    ]
  },
  {
    id: "automation-12",
    companyId: "company-6",
    name: "Support Ticket Escalation",
    description:
      "Escalate unresolved support tickets, notify leadership, and route urgent follow-up tasks before SLA breach.",
    status: "Active",
    triggerType: "time_based",
    triggerLabel: "Time-based trigger",
    triggerDescription: "Checks for tickets that are within one hour of SLA breach.",
    owner: "Noah Peters",
    vertical: "Support",
    lastEditedBy: "Olivia Morris",
    lastEditedAt: subDays(baseDate, 11).toISOString(),
    conditions: [
      {
        id: "cond-12-1",
        field: "Hours without update",
        operator: ">",
        value: "23",
        label: "Only if no update for 23 hours"
      }
    ],
    actions: [
      {
        id: "action-12-1",
        type: "notify",
        label: "Notify support lead",
        description: "Send an in-app alert with the open ticket summary.",
        channel: "In-app"
      },
      {
        id: "action-12-2",
        type: "task",
        label: "Create escalation follow-up",
        description: "Assign the escalation to the duty lead immediately.",
        channel: "Task"
      },
      {
        id: "action-12-3",
        type: "webhook",
        label: "Trigger webhook placeholder",
        description: "Send the escalation event to an external helpdesk placeholder.",
        channel: "Webhook"
      }
    ]
  }
];

export const flowPilotTemplates: FlowPilotTemplate[] = [
  {
    id: "template-1",
    name: "New Lead Follow-Up",
    category: "Sales",
    description: "Respond instantly to fresh leads and create an internal callback task.",
    triggerType: "lead_created",
    triggerLabel: "New lead created",
    estimatedLift: "+28% reply rate",
    stepsSummary: "WhatsApp intro, callback task, stage update",
    conditions: flowPilotAutomations[0].conditions,
    actions: flowPilotAutomations[0].actions
  },
  {
    id: "template-2",
    name: "Missed Booking Reminder",
    category: "Bookings",
    description: "Recover missed bookings with a rebooking message and staff follow-up.",
    triggerType: "status_changed",
    triggerLabel: "Status changed",
    estimatedLift: "+14% rebookings",
    stepsSummary: "WhatsApp nudge, review task",
    conditions: flowPilotAutomations[6].conditions,
    actions: flowPilotAutomations[6].actions
  },
  {
    id: "template-3",
    name: "Overdue Invoice Reminder",
    category: "Finance",
    description: "Remind overdue accounts and update finance status automatically.",
    triggerType: "invoice_overdue",
    triggerLabel: "Invoice overdue",
    estimatedLift: "-19% overdue balance",
    stepsSummary: "Reminder email, account status update",
    conditions: flowPilotAutomations[4].conditions,
    actions: flowPilotAutomations[4].actions
  },
  {
    id: "template-4",
    name: "New Client Welcome Flow",
    category: "Onboarding",
    description: "Create records, send welcome material, and launch onboarding tasks.",
    triggerType: "form_submitted",
    triggerLabel: "Form submitted",
    estimatedLift: "+31% onboarding speed",
    stepsSummary: "Client record, email, checklist task",
    conditions: flowPilotAutomations[5].conditions,
    actions: flowPilotAutomations[5].actions
  },
  {
    id: "template-5",
    name: "Social Campaign Approval + Publish",
    category: "Marketing",
    description:
      "Route draft posts for approval, notify stakeholders, and publish approved content on schedule.",
    triggerType: "status_changed",
    triggerLabel: "Status changed",
    estimatedLift: "+22% publishing consistency",
    stepsSummary: "Approval task, review email, publish webhook",
    conditions: flowPilotAutomations[3].conditions,
    actions: flowPilotAutomations[3].actions
  },
  {
    id: "template-6",
    name: "Inactive Client Re-engagement",
    category: "Retention",
    description: "Wake dormant clients up with targeted reminders and manual follow-up tasks.",
    triggerType: "client_inactive",
    triggerLabel: "Client inactive for X days",
    estimatedLift: "+12% reactivation",
    stepsSummary: "Email nudge, reminder task, CRM tag",
    conditions: [
      {
        id: "template-5-cond-1",
        field: "Inactive days",
        operator: ">",
        value: "45",
        label: "Only if client inactive for more than 45 days"
      }
    ],
    actions: [
      {
        id: "template-5-action-1",
        type: "email",
        label: "Send re-engagement email",
        description: "Invite the client back with a time-sensitive offer.",
        channel: "Email"
      },
      {
        id: "template-5-action-2",
        type: "task",
        label: "Create account manager follow-up",
        description: "Assign a same-week follow-up task to the owner.",
        channel: "Task"
      },
      {
        id: "template-5-action-3",
        type: "tag",
        label: "Add re-engagement tag",
        description: "Track the account in retention views.",
        channel: "CRM"
      }
    ]
  },
  {
    id: "template-7",
    name: "Support Ticket Escalation",
    category: "Support",
    description: "Escalate tickets before SLA breach and notify leaders automatically.",
    triggerType: "time_based",
    triggerLabel: "Time-based trigger",
    estimatedLift: "-22% SLA breaches",
    stepsSummary: "Lead alert, escalation task, webhook",
    conditions: flowPilotAutomations[11].conditions,
    actions: flowPilotAutomations[11].actions
  }
];

function getFailureReason(index: number) {
  const failureIndex = failedRunIndexes.indexOf(index as (typeof failedRunIndexes)[number]);
  return failureIndex >= 0 ? failureReasons[failureIndex] : undefined;
}

function resultForRun(index: number): RunResult {
  if (failedRunIndexes.includes(index as (typeof failedRunIndexes)[number])) {
    return "Failed";
  }

  if (pendingRunIndexes.includes(index as (typeof pendingRunIndexes)[number])) {
    return "Pending";
  }

  return "Success";
}

export const flowPilotRuns: FlowPilotRun[] = Array.from({ length: 120 }, (_, index) => {
  const automation = flowPilotAutomations[index % flowPilotAutomations.length];
  const companyContacts = flowPilotContacts.filter(
    (contact) => contact.companyId === automation.companyId
  );
  const contact =
    companyContacts[index % companyContacts.length] ?? flowPilotContacts[index % flowPilotContacts.length];
  const startedAt = subHours(baseDate, index * 4 + (index % 2)).toISOString();
  const result = resultForRun(index);
  const failureReason = getFailureReason(index);
  const durationMs = 1800 + (index % 9) * 670;

  return {
    id: `run-${String(index + 1).padStart(3, "0")}`,
    companyId: automation.companyId,
    automationId: automation.id,
    automationName: automation.name,
    triggeredBy: contact.name,
    sourceEvent: automation.triggerLabel,
    startedAt,
    durationMs,
    result,
    errorReason: failureReason,
    triggerFields: [
      { label: "Contact", value: contact.name },
      { label: "Company", value: contact.company },
      { label: "Source", value: contact.source },
      { label: "Trigger", value: automation.triggerLabel },
      { label: "Event ID", value: `evt_${automation.id.replace("automation-", "")}_${index + 1}` }
    ],
    conditionResults: automation.conditions.map((condition) => ({
      id: `${condition.id}-${index}`,
      label: condition.label,
      outcome: "Passed",
      detail: `${condition.field} ${condition.operator} ${condition.value}`
    })),
    actionTimeline: automation.actions.map((action, actionIndex) => {
      const isLastAction = actionIndex === automation.actions.length - 1;
      const status: StepResult =
        result === "Failed" && isLastAction
          ? "Failed"
          : result === "Pending" && isLastAction
            ? "Pending"
            : "Executed";

      return {
        id: `${action.id}-${index}`,
        label: action.label,
        channel: action.channel ?? action.type,
        status,
        happenedAt: new Date(
          new Date(startedAt).getTime() + (actionIndex * 3 + 1) * 60_000
        ).toISOString(),
        detail:
          status === "Failed"
            ? failureReason ?? "Step failed during execution."
            : status === "Pending"
              ? "Waiting for the queued delay or approval window to complete."
              : action.description
      };
    })
  };
});

export const flowPilotTasks: FlowPilotTask[] = Array.from({ length: 40 }, (_, index) => {
  const automation = flowPilotAutomations[index % flowPilotAutomations.length];
  const companyContacts = flowPilotContacts.filter(
    (contact) => contact.companyId === automation.companyId
  );
  const contact = companyContacts[index % companyContacts.length] ?? flowPilotContacts[index];
  const priority: TaskPriority =
    index % 9 === 0
      ? "Critical"
      : index % 4 === 0
        ? "High"
        : index % 3 === 0
          ? "Medium"
          : "Low";
  const status: TaskStatus =
    index % 6 === 0
      ? "Completed"
      : index % 4 === 0
        ? "Waiting"
        : index % 3 === 0
          ? "In Progress"
          : "Open";

  return {
    id: `task-${String(index + 1).padStart(3, "0")}`,
    companyId: automation.companyId,
    automationId: automation.id,
    title:
      index % 5 === 0
        ? `Call ${contact.name.split(" ")[0]} about next steps`
        : index % 4 === 0
          ? `Review ${automation.name.toLowerCase()} exception`
          : `Confirm follow-up for ${contact.name}`,
    contactName: contact.name,
    dueAt: new Date(baseDate.getTime() + ((index % 7) - 3) * 24 * 60 * 60 * 1000).toISOString(),
    assignee: assigneeCycle[index % assigneeCycle.length],
    priority,
    status
  };
});

export const flowPilotNotifications: FlowPilotNotification[] = Array.from(
  { length: 25 },
  (_, index) => {
    const automation = flowPilotAutomations[index % flowPilotAutomations.length];
    const recipient =
      index % 3 === 0
        ? "Sales team"
        : index % 3 === 1
          ? "Ops manager"
          : "Client inbox";
    const channel: NotificationChannel =
      index % 3 === 0 ? "Email" : index % 3 === 1 ? "WhatsApp" : "In-app";
    const status: NotificationStatus =
      index % 11 === 0
        ? "Failed"
        : index % 4 === 0
          ? "Queued"
          : "Delivered";

    return {
      id: `notification-${String(index + 1).padStart(3, "0")}`,
      companyId: automation.companyId,
      automationId: automation.id,
      title:
        status === "Failed"
          ? `${automation.name} delivery needs attention`
          : `${automation.name} sent successfully`,
      detail:
        status === "Failed"
          ? `A ${channel.toLowerCase()} step failed and was logged for review.`
          : `${channel} notification sent for ${automation.triggerLabel.toLowerCase()}.`,
      channel,
      status,
      recipient,
      createdAt: subMinutes(baseDate, index * 48 + 15).toISOString(),
      unread: index < 8
    };
  }
);

export const flowPilotActivity: FlowPilotActivityItem[] = [
  {
    id: "activity-1",
    companyId: "company-1",
    title: "VIP lead routed instantly",
    detail: "New Facebook lead moved to Contacted and callback task opened in 37 seconds.",
    createdAt: subMinutes(baseDate, 22).toISOString(),
    severity: "success"
  },
  {
    id: "activity-2",
    companyId: "company-1",
    title: "No-reply escalation triggered",
    detail: "Lead conversation stalled for 48 hours and was escalated to the sales manager.",
    createdAt: subHours(baseDate, 2).toISOString(),
    severity: "warning"
  },
  {
    id: "activity-3",
    companyId: "company-2",
    title: "Invoice reminder sent",
    detail: "Overdue reminder email delivered with payment link and account note updated.",
    createdAt: subHours(baseDate, 4).toISOString(),
    severity: "info"
  },
  {
    id: "activity-4",
    companyId: "company-3",
    title: "Appointment recovery failed",
    detail: "WhatsApp provider timed out while sending a rebooking message.",
    createdAt: subHours(baseDate, 6).toISOString(),
    severity: "danger"
  },
  {
    id: "activity-5",
    companyId: "company-4",
    title: "Document review task created",
    detail: "Compliance upload acknowledgement sent and review task assigned to operations.",
    createdAt: subHours(baseDate, 9).toISOString(),
    severity: "success"
  },
  {
    id: "activity-6",
    companyId: "company-6",
    title: "Support escalation queued",
    detail: "Ticket reached the SLA threshold and a pending escalation step was scheduled.",
    createdAt: subHours(baseDate, 11).toISOString(),
    severity: "warning"
  },
  {
    id: "activity-7",
    companyId: "company-5",
    title: "Payment webhook paused",
    detail: "Payment received workflow is paused pending updated finance copy.",
    createdAt: subHours(baseDate, 15).toISOString(),
    severity: "info"
  },
  {
    id: "activity-8",
    companyId: "company-1",
    title: "Social post approval routed",
    detail: "Draft LinkedIn post moved to approval and the review task was created.",
    createdAt: subHours(baseDate, 19).toISOString(),
    severity: "info"
  }
];

export const flowPilotIntegrations: FlowPilotIntegration[] = [
  {
    id: "integration-1",
    name: "Gmail / Email",
    category: "Messaging",
    description: "Send confirmations, reminders, and follow-up campaigns from verified inboxes.",
    status: "Connected",
    lastSync: subMinutes(baseDate, 18).toISOString()
  },
  {
    id: "integration-2",
    name: "WhatsApp",
    category: "Messaging",
    description: "Trigger instant outreach and reminders through approved WhatsApp templates.",
    status: "Connected",
    lastSync: subHours(baseDate, 1).toISOString()
  },
  {
    id: "integration-3",
    name: "Webhooks",
    category: "Infrastructure",
    description: "Send workflow events to custom systems and external services.",
    status: "Connected",
    lastSync: subHours(baseDate, 2).toISOString()
  },
  {
    id: "integration-4",
    name: "Google Calendar",
    category: "Scheduling",
    description: "Create bookings, reminders, and staff schedule events automatically.",
    status: "Not connected"
  },
  {
    id: "integration-5",
    name: "CRM",
    category: "Revenue",
    description: "Update stages, tags, and client records when workflows move forward.",
    status: "Connected",
    lastSync: subMinutes(baseDate, 44).toISOString()
  },
  {
    id: "integration-6",
    name: "Invoicing",
    category: "Finance",
    description: "Generate invoices, sync payments, and keep overdue reminders aligned.",
    status: "Not connected"
  },
  {
    id: "integration-7",
    name: "Forms",
    category: "Data capture",
    description: "Start workflows from onboarding forms, support forms, and lead capture forms.",
    status: "Connected",
    lastSync: subHours(baseDate, 3).toISOString()
  },
  {
    id: "integration-8",
    name: "Slack",
    category: "Internal alerts",
    description: "Push team notifications and approval requests into a shared operations channel.",
    status: "Coming soon"
  },
  {
    id: "integration-9",
    name: "Meta Business Suite",
    category: "Social publishing",
    description: "Schedule Instagram and Facebook content, approvals, and publish windows.",
    status: "Connected",
    lastSync: subMinutes(baseDate, 9).toISOString()
  },
  {
    id: "integration-10",
    name: "LinkedIn Pages",
    category: "Social publishing",
    description: "Queue thought leadership posts, company updates, and campaign approvals.",
    status: "Connected",
    lastSync: subMinutes(baseDate, 27).toISOString()
  },
  {
    id: "integration-11",
    name: "X / Threads",
    category: "Social publishing",
    description: "Cross-post short-form content once approval rules and channel windows are met.",
    status: "Coming soon"
  }
];

export const flowPilotSocialChannels: FlowPilotSocialChannel[] = [
  {
    id: "social-channel-1",
    companyId: "company-1",
    name: "Instagram",
    handle: "@bluepeakproperty",
    cadence: "4 posts this week",
    queueDepth: 8,
    engagementRate: 6.8,
    bestWindow: "Tue / Thu at 18:00",
    status: "Healthy",
    connectedVia: "Meta Business Suite"
  },
  {
    id: "social-channel-2",
    companyId: "company-1",
    name: "LinkedIn",
    handle: "/company/bluepeak-property-group",
    cadence: "3 posts this week",
    queueDepth: 5,
    engagementRate: 4.1,
    bestWindow: "Weekdays at 08:30",
    status: "Healthy",
    connectedVia: "LinkedIn Pages"
  },
  {
    id: "social-channel-3",
    companyId: "company-1",
    name: "Facebook",
    handle: "@bluepeakgroup",
    cadence: "2 posts this week",
    queueDepth: 4,
    engagementRate: 3.6,
    bestWindow: "Wed at 17:00",
    status: "Needs review",
    connectedVia: "Meta Business Suite"
  },
  {
    id: "social-channel-4",
    companyId: "company-5",
    name: "Instagram",
    handle: "@amandelstudio",
    cadence: "5 posts this week",
    queueDepth: 6,
    engagementRate: 7.3,
    bestWindow: "Mon / Thu at 16:00",
    status: "Healthy",
    connectedVia: "Meta Business Suite"
  },
  {
    id: "social-channel-5",
    companyId: "company-5",
    name: "LinkedIn",
    handle: "/company/amandel-studio",
    cadence: "2 posts this week",
    queueDepth: 3,
    engagementRate: 5.4,
    bestWindow: "Tue at 09:00",
    status: "Building",
    connectedVia: "LinkedIn Pages"
  },
  {
    id: "social-channel-6",
    companyId: "company-6",
    name: "Facebook",
    handle: "@vectorsolar",
    cadence: "3 posts this week",
    queueDepth: 5,
    engagementRate: 4.8,
    bestWindow: "Tue at 19:00",
    status: "Healthy",
    connectedVia: "Meta Business Suite"
  }
];

export const flowPilotSocialPosts: FlowPilotSocialPost[] = [
  {
    id: "social-post-1",
    companyId: "company-1",
    automationId: "automation-4",
    title: "Rosebank penthouse weekend teaser",
    caption: "Short-form reel introducing the new Rosebank listing before Saturday viewings.",
    campaign: "Rosebank launch",
    channels: ["Instagram", "Facebook"],
    status: "Scheduled",
    owner: "Mia Alvarez",
    assetType: "Video",
    scheduledFor: addDays(baseDate, 1).toISOString()
  },
  {
    id: "social-post-2",
    companyId: "company-1",
    automationId: "automation-4",
    title: "Q2 buyer demand market snapshot",
    caption: "Carousel post with demand highlights and CTA to book a valuation call.",
    campaign: "Market education",
    channels: ["LinkedIn"],
    status: "Awaiting approval",
    owner: "Daniel Park",
    assetType: "Carousel",
    scheduledFor: addDays(baseDate, 2).toISOString()
  },
  {
    id: "social-post-3",
    companyId: "company-1",
    title: "Open house reminder for Sandton duplex",
    caption: "Story and feed reminder driving weekend attendance for the Sandton open house.",
    campaign: "Open house push",
    channels: ["Instagram", "Facebook"],
    status: "Scheduled",
    owner: "Mia Alvarez",
    assetType: "Image",
    scheduledFor: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "social-post-4",
    companyId: "company-1",
    title: "Client success reel: Parkhurst sale",
    caption: "Published testimonial reel celebrating a quick close and referral CTA.",
    campaign: "Trust builders",
    channels: ["Instagram", "LinkedIn"],
    status: "Published",
    owner: "Olivia Morris",
    assetType: "Video",
    scheduledFor: subHours(baseDate, 8).toISOString(),
    publishedAt: subHours(baseDate, 8).toISOString()
  },
  {
    id: "social-post-5",
    companyId: "company-1",
    title: "Behind-the-scenes walkthrough cut",
    caption: "Draft cut needs tighter branding and a shorter CTA before scheduling.",
    campaign: "Agent brand",
    channels: ["Instagram"],
    status: "Needs edits",
    owner: "Mia Alvarez",
    assetType: "Video",
    scheduledFor: addDays(baseDate, 3).toISOString()
  },
  {
    id: "social-post-6",
    companyId: "company-5",
    title: "Studio sprint recap",
    caption: "Carousel recap of last week's campaign sprint with outcomes and learnings.",
    campaign: "Agency proof",
    channels: ["LinkedIn", "Instagram"],
    status: "Published",
    owner: "Lebo Maseko",
    assetType: "Carousel",
    scheduledFor: subDays(baseDate, 1).toISOString(),
    publishedAt: subDays(baseDate, 1).toISOString()
  },
  {
    id: "social-post-7",
    companyId: "company-5",
    title: "Brand refresh teaser",
    caption: "Teaser post queued for approval with a before-and-after design frame.",
    campaign: "Brand refresh",
    channels: ["Instagram"],
    status: "Awaiting approval",
    owner: "Lebo Maseko",
    assetType: "Image",
    scheduledFor: addDays(baseDate, 1).toISOString()
  },
  {
    id: "social-post-8",
    companyId: "company-6",
    title: "Battery rebate explainer",
    caption: "Educational post on the new rebate window with a quote-request CTA.",
    campaign: "Solar education",
    channels: ["Facebook", "LinkedIn"],
    status: "Published",
    owner: "Marcus Bell",
    assetType: "Text",
    scheduledFor: subHours(baseDate, 20).toISOString(),
    publishedAt: subHours(baseDate, 20).toISOString()
  },
  {
    id: "social-post-9",
    companyId: "company-6",
    title: "Installation before-and-after carousel",
    caption: "Carousel highlighting a recent install with homeowner quote and financing CTA.",
    campaign: "Proof of work",
    channels: ["Facebook", "Instagram"],
    status: "Scheduled",
    owner: "Marcus Bell",
    assetType: "Carousel",
    scheduledFor: addDays(baseDate, 2).toISOString()
  }
];

export const flowPilotLandingFeatures = [
  {
    title: "Build trigger-and-action workflows fast",
    description:
      "Launch business automations with a clean builder for leads, bookings, invoices, client records, tasks, reminders, and social publishing."
  },
  {
    title: "See what ran, what failed, and why",
    description:
      "Run logs, failure reasons, and action timelines give teams the visibility they need without digging through inboxes."
  },
  {
    title: "Automate social approvals and posting",
    description:
      "Queue drafts, route approvals, schedule channels, and publish content with the same trigger logic used everywhere else."
  },
  {
    title: "Follow up automatically",
    description:
      "Queue tasks, reminders, approvals, and notifications across email, WhatsApp, and in-app alerts."
  },
  {
    title: "Present like premium software",
    description:
      "White-label branding, polished dashboards, and realistic seeded data make the product sales-demo ready."
  },
  {
    title: "Control team permissions",
    description:
      "Admins, managers, and staff viewers each have the right access level without exposing sensitive settings."
  },
  {
    title: "Adapt it to any business model",
    description:
      "Real estate, accounting, service companies, and internal ops teams can all reuse the same workflow engine."
  }
];

export const flowPilotWorkflowCards = [
  {
    title: "Lead response flow",
    trigger: "New lead comes in",
    steps: ["Send WhatsApp", "Send email", "Create callback task"]
  },
  {
    title: "Bookings and reminders",
    trigger: "Booking created",
    steps: ["Send confirmation", "Notify staff", "Wait 24h", "Send reminder"]
  },
  {
    title: "Collections automation",
    trigger: "Invoice overdue",
    steps: ["Email reminder", "Update status", "Escalate to manager"]
  },
  {
    title: "Social approval flow",
    trigger: "Post moves to awaiting approval",
    steps: ["Create review task", "Notify manager", "Publish on schedule"]
  }
];

export const flowPilotTestimonials = [
  {
    quote:
      "FlowPilot looks like software we could sell tomorrow. The automations, logs, and notifications all feel real.",
    name: "Maya Thompson",
    title: "COO, BluePeak Property Group"
  },
  {
    quote:
      "The builder is easy to explain to clients, and the dashboard finally makes automation performance feel measurable.",
    name: "James Patel",
    title: "Director, North Ridge Accounting"
  },
  {
    quote:
      "It gives us a premium demo story for service operations without feeling like another generic admin panel.",
    name: "Amara Okafor",
    title: "Founder, Luma Service Collective"
  }
];

export const flowPilotFaqs = [
  {
    question: "Is this only for lead automation?",
    answer:
      "No. The demo covers leads, bookings, invoices, status changes, no-reply follow-ups, document uploads, payments, and social media approvals and publishing flows."
  },
  {
    question: "Can the app be white-labeled for client projects?",
    answer:
      "Yes. The branding layer supports configurable app name, company name, logo placeholder, accent color, and support email."
  },
  {
    question: "Does it already include role-based access?",
    answer:
      "Yes. Admins, managers, and staff viewers each have different access levels, with protected routes and demo sign-ins for each role."
  },
  {
    question: "How realistic is the demo data?",
    answer:
      "The seed includes believable automations, contacts, tasks, notifications, and failures so the product feels alive in sales demos."
  },
  {
    question: "Can this later connect to real APIs?",
    answer:
      "Yes. The structure is built for Supabase and integration placeholders, so it can be extended into production systems for many industries."
  }
];

export const flowPilotBuilderCatalog = {
  triggers: [
    "New lead created",
    "New booking made",
    "Form submitted",
    "Invoice overdue",
    "Status changed",
    "Time-based trigger",
    "Client inactive for X days",
    "Document uploaded",
    "Payment received",
    "Social post scheduled",
    "Social post approved",
    "Comment received"
  ],
  conditions: [
    "Only if lead source = Facebook",
    "Only if booking type = Consultation",
    "Only if invoice > amount",
    "Only if no reply after X hours",
    "Only if status = Pending",
    "Only if assigned team = Sales",
    "Only if channel = LinkedIn",
    "Only if content pillar = Listings",
    "Only if approval status = Approved"
  ],
  actions: [
    "Send email",
    "Send WhatsApp message",
    "Create task",
    "Assign to team member",
    "Update record status",
    "Add tag",
    "Create note",
    "Notify admin",
    "Send reminder",
    "Create follow-up event",
    "Move deal to next stage",
    "Generate invoice",
    "Trigger webhook placeholder",
    "Schedule social post",
    "Publish approved content",
    "Request social approval",
    "Recycle top-performing post"
  ]
};

export function getFlowPilotProfileById(id: string) {
  return flowPilotProfiles.find((profile) => profile.id === id);
}

export function getFlowPilotProfileByEmail(email: string) {
  return flowPilotProfiles.find(
    (profile) => profile.email.toLowerCase() === email.toLowerCase()
  );
}

export function getFlowPilotDefaultProfile(role: FlowPilotRole) {
  return flowPilotProfiles.find((profile) => profile.role === role) ?? flowPilotProfiles[1];
}

export function getFlowPilotCompanyById(id: string) {
  return flowPilotCompanies.find((company) => company.id === id);
}

export function getRoleLabel(role: FlowPilotRole) {
  switch (role) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    default:
      return "Staff Viewer";
  }
}

export function canManageAutomations(role: FlowPilotRole) {
  return role === "admin" || role === "manager";
}

export function canManageSettings(role: FlowPilotRole) {
  return role === "admin";
}

export function canManageIntegrations(role: FlowPilotRole) {
  return role !== "staff_viewer";
}

function scopeByCompany<T extends { companyId: string }>(items: T[], companyId?: string | null) {
  return companyId ? items.filter((item) => item.companyId === companyId) : items;
}

function calculateAutomationMetrics(automationId: string) {
  const runs = flowPilotRuns.filter((run) => run.automationId === automationId);
  const successCount = runs.filter((run) => run.result === "Success").length;
  const failureCount = runs.filter((run) => run.result === "Failed").length;
  const pendingCount = runs.filter((run) => run.result === "Pending").length;

  return {
    runs: runs.length,
    lastRun: runs[0]?.startedAt ?? null,
    successRate: runs.length ? Math.round((successCount / runs.length) * 100) : 0,
    failureCount,
    pendingCount
  };
}

export function getAutomationSummaries(companyId?: string | null): FlowPilotAutomationSummary[] {
  return scopeByCompany(flowPilotAutomations, companyId)
    .map((automation) => ({
      ...automation,
      ...calculateAutomationMetrics(automation.id)
    }))
    .sort((left, right) => {
      const leftDate = left.lastRun ? new Date(left.lastRun).getTime() : 0;
      const rightDate = right.lastRun ? new Date(right.lastRun).getTime() : 0;
      return rightDate - leftDate;
    });
}

export function getAutomationById(id: string) {
  const automation = flowPilotAutomations.find((item) => item.id === id);

  if (!automation) {
    return null;
  }

  return {
    ...automation,
    ...calculateAutomationMetrics(id)
  } satisfies FlowPilotAutomationSummary;
}

export function getTemplateById(id: string) {
  return flowPilotTemplates.find((template) => template.id === id) ?? null;
}

export function getRunById(id: string) {
  return flowPilotRuns.find((run) => run.id === id) ?? null;
}

export function getRunsForAutomation(automationId: string) {
  return flowPilotRuns
    .filter((run) => run.automationId === automationId)
    .sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime());
}

export function getScopedRuns(companyId?: string | null) {
  return scopeByCompany(flowPilotRuns, companyId).sort(
    (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
  );
}

export function getScopedTasks(companyId?: string | null) {
  return scopeByCompany(flowPilotTasks, companyId).sort(
    (left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime()
  );
}

export function getScopedContacts(companyId?: string | null) {
  return scopeByCompany(flowPilotContacts, companyId).sort(
    (left, right) => new Date(right.lastTouchAt).getTime() - new Date(left.lastTouchAt).getTime()
  );
}

export function getScopedNotifications(companyId?: string | null) {
  return scopeByCompany(flowPilotNotifications, companyId).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function getScopedActivity(companyId?: string | null) {
  return scopeByCompany(flowPilotActivity, companyId).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function getScopedIntegrations() {
  return flowPilotIntegrations;
}

export function getScopedSocialPosts(companyId?: string | null) {
  return scopeByCompany(flowPilotSocialPosts, companyId).sort(
    (left, right) => new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime()
  );
}

export function getScopedSocialChannels(companyId?: string | null) {
  return scopeByCompany(flowPilotSocialChannels, companyId).sort(
    (left, right) => right.queueDepth - left.queueDepth
  );
}

export function getSearchItems(companyId?: string | null): FlowPilotSearchItem[] {
  const automations = getAutomationSummaries(companyId);
  const contacts = getScopedContacts(companyId);
  const tasks = getScopedTasks(companyId);
  const runs = getScopedRuns(companyId).slice(0, 16);
  const socialPosts = getScopedSocialPosts(companyId).slice(0, 8);

  return [
    {
      id: "search-social-planner",
      label: "Social planner",
      type: "Workspace",
      href: "/workspace/social",
      meta: "Approvals, queue, and publishing"
    },
    ...automations.map((automation) => ({
      id: automation.id,
      label: automation.name,
      type: "Automation",
      href: `/workspace/automations/${automation.id}`,
      meta: automation.triggerLabel
    })),
    ...contacts.map((contact) => ({
      id: contact.id,
      label: contact.name,
      type: "Contact",
      href: "/workspace/contacts",
      meta: contact.company
    })),
    ...tasks.map((task) => ({
      id: task.id,
      label: task.title,
      type: "Task",
      href: "/workspace/tasks",
      meta: task.assignee
    })),
    ...runs.map((run) => ({
      id: run.id,
      label: run.id.toUpperCase(),
      type: "Run Log",
      href: `/workspace/logs/${run.id}`,
      meta: run.automationName
    })),
    ...socialPosts.map((post) => ({
      id: post.id,
      label: post.title,
      type: "Social post",
      href: "/workspace/social",
      meta: post.channels.join(", ")
    })),
    ...flowPilotTemplates.map((template) => ({
      id: template.id,
      label: template.name,
      type: "Template",
      href: `/workspace/automations/new?template=${template.id}`,
      meta: template.category
    }))
  ];
}

export function getSocialPlannerSnapshot(companyId?: string | null) {
  const posts = getScopedSocialPosts(companyId);
  const channels = getScopedSocialChannels(companyId);
  const automations = getAutomationSummaries(companyId).filter(
    (automation) => automation.vertical === "Marketing"
  );
  const templates = flowPilotTemplates.filter((template) => template.category === "Marketing");
  const scheduledThisWeek = posts.filter((post) => {
    const scheduledAt = new Date(post.scheduledFor);
    return (
      scheduledAt >= startOfDay(baseDate) &&
      scheduledAt <= endOfDay(addDays(baseDate, 6)) &&
      post.status === "Scheduled"
    );
  }).length;
  const awaitingApproval = posts.filter((post) => post.status === "Awaiting approval").length;
  const publishedThisWeek = posts.filter((post) => {
    if (!post.publishedAt) {
      return false;
    }

    return new Date(post.publishedAt) >= subDays(baseDate, 7);
  }).length;
  const averageEngagement = channels.length
    ? (channels.reduce((total, channel) => total + channel.engagementRate, 0) / channels.length).toFixed(1)
    : "0.0";
  const calendar = eachDayOfInterval({
    start: startOfDay(baseDate),
    end: endOfDay(addDays(baseDate, 4))
  }).map((day) => ({
    label: day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    posts: posts.filter((post) => isSameDay(new Date(post.scheduledFor), day))
  }));

  return {
    metrics: [
      {
        label: "Scheduled this week",
        value: String(scheduledThisWeek),
        change: "Posts queued across connected channels",
        tone: "brand" as const
      },
      {
        label: "Awaiting approval",
        value: String(awaitingApproval),
        change: "Ready for marketing or client review",
        tone: awaitingApproval ? ("warning" as const) : ("success" as const)
      },
      {
        label: "Published this week",
        value: String(publishedThisWeek),
        change: "Live content triggered from automated workflows",
        tone: "success" as const
      },
      {
        label: "Average engagement",
        value: `${averageEngagement}%`,
        change: "Across active social channels",
        tone: "brand" as const
      }
    ],
    channels,
    queue: posts.filter((post) => post.status !== "Published"),
    published: posts.filter((post) => post.status === "Published").slice(0, 4),
    calendar,
    automations,
    templates,
    channelPerformance: channels.map((channel) => ({
      label: channel.name,
      queued: channel.queueDepth,
      engagement: channel.engagementRate
    }))
  };
}

export function getDashboardSnapshot(companyId?: string | null) {
  const automations = getAutomationSummaries(companyId);
  const runs = getScopedRuns(companyId);
  const notifications = getScopedNotifications(companyId);
  const tasks = getScopedTasks(companyId);
  const recentActivity = getScopedActivity(companyId);

  const activeAutomations = automations.filter((automation) => automation.status === "Active").length;
  const runsToday = runs.filter((run) => isSameDay(new Date(run.startedAt), baseDate)).length;
  const successCount = runs.filter((run) => run.result === "Success").length;
  const failedRuns = runs.filter((run) => run.result === "Failed");
  const pendingActions = tasks.filter((task) => task.status !== "Completed").length;
  const deliveredNotifications = notifications.filter(
    (notification) => notification.status === "Delivered"
  ).length;

  const days = eachDayOfInterval({
    start: startOfDay(subDays(baseDate, 9)),
    end: endOfDay(baseDate)
  });

  const volumeChart = days.map((day) => {
    const dayRuns = runs.filter((run) => isSameDay(new Date(run.startedAt), day));
    return {
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      runs: dayRuns.length
    };
  });

  const statusChart = days.slice(-7).map((day) => {
    const dayRuns = runs.filter((run) => isSameDay(new Date(run.startedAt), day));
    return {
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      success: dayRuns.filter((run) => run.result === "Success").length,
      failed: dayRuns.filter((run) => run.result === "Failed").length,
      pending: dayRuns.filter((run) => run.result === "Pending").length
    };
  });

  const successRate = runs.length ? Math.round((successCount / runs.length) * 100) : 0;

  const metrics: FlowPilotMetric[] = [
    {
      label: "Active automations",
      value: String(activeAutomations),
      change: "+3 this month",
      tone: "brand"
    },
    {
      label: "Runs today",
      value: String(runsToday),
      change: "+18% vs yesterday",
      tone: "success"
    },
    {
      label: "Success rate",
      value: `${successRate}%`,
      change: "Stable over 7 days",
      tone: "success"
    },
    {
      label: "Failed automations",
      value: String(new Set(failedRuns.map((run) => run.automationId)).size),
      change: `${failedRuns.length} failed runs`,
      tone: failedRuns.length ? "danger" : "success"
    },
    {
      label: "Pending actions",
      value: String(pendingActions),
      change: "Needs follow-up today",
      tone: "warning"
    },
    {
      label: "Notifications sent",
      value: String(deliveredNotifications),
      change: "Across email, WhatsApp, and in-app",
      tone: "brand"
    }
  ];

  return {
    metrics,
    volumeChart,
    statusChart,
    recentActivity,
    topAutomations: automations.slice(0, 5),
    failureReasons: failedRuns.slice(0, 4)
  };
}

export function getReportingSnapshot(companyId?: string | null) {
  const automations = getAutomationSummaries(companyId);
  const runs = getScopedRuns(companyId);
  const notifications = getScopedNotifications(companyId);

  const totalRunsWeek = runs.filter(
    (run) => new Date(run.startedAt) >= subDays(baseDate, 7)
  ).length;
  const totalRunsMonth = runs.filter(
    (run) => new Date(run.startedAt) >= subDays(baseDate, 30)
  ).length;
  const averageExecutionTime = Math.round(
    runs.reduce((total, run) => total + run.durationMs, 0) / runs.length
  );

  const triggerMap = new Map<string, number>();
  automations.forEach((automation) => {
    triggerMap.set(
      automation.triggerLabel,
      (triggerMap.get(automation.triggerLabel) ?? 0) + automation.runs
    );
  });

  const notificationSummary = [
    {
      label: "Delivered",
      value: notifications.filter((item) => item.status === "Delivered").length
    },
    {
      label: "Queued",
      value: notifications.filter((item) => item.status === "Queued").length
    },
    {
      label: "Failed",
      value: notifications.filter((item) => item.status === "Failed").length
    }
  ];

  return {
    totalRunsWeek,
    totalRunsMonth,
    averageExecutionTime,
    topAutomations: [...automations].sort((left, right) => right.runs - left.runs).slice(0, 5),
    failedAutomations: automations.filter((automation) => automation.failureCount > 0),
    triggerBreakdown: [...triggerMap.entries()].map(([label, value]) => ({ label, value })),
    notificationSummary,
    weeklyTrend: eachDayOfInterval({
      start: startOfDay(subDays(baseDate, 6)),
      end: endOfDay(baseDate)
    }).map((day) => {
      const dayRuns = runs.filter((run) => isSameDay(new Date(run.startedAt), day));
      return {
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        runs: dayRuns.length
      };
    })
  };
}
