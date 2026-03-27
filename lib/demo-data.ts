import { addDays, subDays } from "date-fns";

import { env } from "@/lib/env";
import type {
  ActivityLog,
  Company,
  DocumentItem,
  InvoiceItem,
  KnowledgeBaseArticle,
  NotificationItem,
  Profile,
  ProjectItem,
  ProjectMilestone,
  RequestItem,
  RequestMessage,
  RequestStatus,
  StatusTone
} from "@/lib/types";

const now = new Date();

const companySeeds = [
  ["company-1", "Amandel Studio", "Creative Services", "Sarah Chen", "Cape Town, ZA"],
  ["company-2", "Vector Health Partners", "Healthcare Consulting", "James Patel", "Austin, US"],
  ["company-3", "Harbor & Finch Legal", "Legal Operations", "Maya Thompson", "London, UK"],
  ["company-4", "TerraCore Facilities", "Facilities Management", "Ethan Reed", "Denver, US"],
  ["company-5", "Luma Commerce", "Retail Operations", "Amara Okafor", "Johannesburg, ZA"],
  ["company-6", "North Ridge Advisory", "Finance Advisory", "Daniel Kim", "Toronto, CA"],
  ["company-7", "Helio Energy Group", "Energy Services", "Priya Nair", "Dubai, UAE"],
  ["company-8", "Briar Hospitality", "Hospitality", "Sophia Alvarez", "Miami, US"],
  ["company-9", "Monarch Learning Co.", "Education Services", "Noah Bennett", "Seattle, US"],
  ["company-10", "Pulse Industrial", "Industrial Services", "Layla Hassan", "Manchester, UK"]
] as const;

export const companies: Company[] = companySeeds.map(
  ([id, name, industry, contactName, location], index) => ({
    id,
    name,
    industry,
    contactName,
    contactEmail: `${contactName.toLowerCase().replace(/[^a-z]+/g, ".")}@${name
      .toLowerCase()
      .replace(/[^a-z]+/g, "")}.com`,
    phone: `+1 (555) 010-${String(index + 11).padStart(2, "0")}`,
    plan: index < 4 ? "Growth" : index < 8 ? "Scale" : "Enterprise",
    location,
    clientSince: subDays(now, 40 + index * 23).toISOString()
  })
);

export const clientProfiles: Profile[] = companies.map((company, index) => ({
  id: `client-${index + 1}`,
  fullName: company.contactName,
  email:
    index === 0
      ? env.demoClientEmail
      : `${company.contactName.toLowerCase().replace(/[^a-z]+/g, ".")}@${company.name
          .toLowerCase()
          .replace(/[^a-z]+/g, "")}.com`,
  role: "client",
  companyId: company.id,
  title:
    index % 3 === 0
      ? "Operations Director"
      : index % 3 === 1
        ? "Client Services Lead"
        : "Finance Manager",
  avatar: company.contactName
    .split(" ")
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  phone: company.phone
}));

export const adminProfiles: Profile[] = [
  {
    id: "admin-1",
    fullName: "Olivia Morris",
    email: env.demoAdminEmail,
    role: "admin",
    companyId: "internal",
    title: "Portal Administrator",
    avatar: "OM",
    phone: "+1 (555) 555-0101"
  },
  {
    id: "admin-2",
    fullName: "Marcus Bell",
    email: "marcus.bell@clientflowportal.com",
    role: "admin",
    companyId: "internal",
    title: "Success Manager",
    avatar: "MB",
    phone: "+1 (555) 555-0102"
  }
];

export const profiles: Profile[] = [...clientProfiles, ...adminProfiles];

const requestStatusSequence: RequestStatus[] = [
  "New",
  "In Progress",
  "Waiting on Client",
  "Completed",
  "Overdue"
];

const requestCategories = [
  "onboarding",
  "support",
  "billing",
  "maintenance",
  "custom development",
  "compliance"
];

const requestSubjects = [
  "Portal access onboarding checklist",
  "Quarterly invoice discrepancy review",
  "Critical workflow automation fix",
  "Compliance document package refresh",
  "Website change request for landing pages",
  "New team member access provisioning",
  "Maintenance window confirmation",
  "Analytics dashboard export request",
  "Client approval needed for rollout",
  "Brand asset replacement for portal"
];

export const requests: RequestItem[] = Array.from({ length: 30 }, (_, index) => {
  const company = companies[index % companies.length];
  const status = requestStatusSequence[index % requestStatusSequence.length];
  const createdAt = subDays(now, 24 - index).toISOString();
  const lastUpdated = subDays(now, (index % 7) + 1).toISOString();

  return {
    id: `REQ-${1040 + index}`,
    companyId: company.id,
    subject: requestSubjects[index % requestSubjects.length],
    category: requestCategories[index % requestCategories.length],
    priority:
      index % 6 === 0
        ? "Critical"
        : index % 4 === 0
          ? "High"
          : index % 3 === 0
            ? "Medium"
            : "Low",
    status,
    assignee: index % 2 === 0 ? "Olivia Morris" : "Marcus Bell",
    lastUpdated,
    createdAt,
    description:
      "We need this handled with a polished client-facing experience, clear communication, and clean documentation across each milestone.",
    relatedDocumentIds: [`DOC-${200 + (index % 20)}`, `DOC-${220 + (index % 10)}`]
  };
});

export const requestMessages: RequestMessage[] = requests.flatMap((request, index) => [
  {
    id: `RM-${index + 1}-1`,
    requestId: request.id,
    author: companies.find((company) => company.id === request.companyId)?.contactName ?? "Client",
    role: "client",
    body:
      "Sharing the latest context here. We’d love visibility into next steps and whether anything else is needed from our side.",
    createdAt: request.createdAt
  },
  {
    id: `RM-${index + 1}-2`,
    requestId: request.id,
    author: request.assignee,
    role: "staff",
    body:
      "Thanks, we’ve reviewed the request and mapped the work against our internal checklist. We’ll keep this thread updated as progress moves forward.",
    createdAt: subDays(new Date(request.lastUpdated), 1).toISOString()
  },
  {
    id: `RM-${index + 1}-3`,
    requestId: request.id,
    author: companies.find((company) => company.id === request.companyId)?.contactName ?? "Client",
    role: "client",
    body:
      index % 4 === 0
        ? "Approved from our side. Please proceed with the planned update window."
        : "Appreciate the update. We’ve added one small clarification to the original request details.",
    createdAt: request.lastUpdated
  }
]);

const projectNames = [
  "Client onboarding experience",
  "Operations dashboard rollout",
  "Compliance remediation sprint",
  "Knowledge base modernization",
  "Invoice automation upgrade",
  "Service request triage redesign",
  "Document control migration",
  "Executive reporting workspace"
];

export const projects: ProjectItem[] = Array.from({ length: 8 }, (_, index) => {
  const company = companies[index];
  return {
    id: `PRJ-${301 + index}`,
    companyId: company.id,
    name: projectNames[index],
    status:
      index % 4 === 3
        ? "Review"
        : index % 4 === 2
          ? "Planning"
          : index % 4 === 1
            ? "Complete"
            : "In Progress",
    progress: [68, 100, 28, 84, 61, 46, 73, 58][index],
    manager: index % 2 === 0 ? "Olivia Morris" : "Marcus Bell",
    deadline: addDays(now, 12 + index * 6).toISOString(),
    description:
      "A multi-step delivery engagement with milestones, visible status, and client-friendly reporting.",
    budget: 12000 + index * 3500
  };
});

export const projectMilestones: ProjectMilestone[] = projects.flatMap((project, index) => [
  {
    id: `${project.id}-M1`,
    projectId: project.id,
    title: "Discovery and scope sign-off",
    dueDate: subDays(new Date(project.deadline), 18).toISOString(),
    status: "Done"
  },
  {
    id: `${project.id}-M2`,
    projectId: project.id,
    title: "Core implementation sprint",
    dueDate: subDays(new Date(project.deadline), 8).toISOString(),
    status: index % 3 === 0 ? "In Progress" : "Done"
  },
  {
    id: `${project.id}-M3`,
    projectId: project.id,
    title: "QA, approvals, and handoff",
    dueDate: project.deadline,
    status: index % 2 === 0 ? "Upcoming" : "In Progress"
  }
]);

export const invoices: InvoiceItem[] = Array.from({ length: 20 }, (_, index) => {
  const company = companies[index % companies.length];
  const issuedAt = subDays(now, 40 - index * 2).toISOString();
  const dueDate = addDays(new Date(issuedAt), 18).toISOString();
  return {
    id: `INV-${5000 + index}`,
    companyId: company.id,
    invoiceNumber: `CF-${2026}${String(index + 1).padStart(3, "0")}`,
    amount: 1200 + (index % 6) * 850,
    issuedAt,
    dueDate,
    status:
      index % 5 === 0 ? "Overdue" : index % 3 === 0 ? "Paid" : "Unpaid",
    summary:
      index % 2 === 0
        ? "Monthly retainer and support coverage"
        : "Project milestone billing and document processing"
  };
});

const documentCategories = [
  "Service Agreements",
  "Invoices",
  "Compliance",
  "Project Files",
  "Reports"
];

export const documents: DocumentItem[] = Array.from({ length: 40 }, (_, index) => {
  const company = companies[index % companies.length];
  return {
    id: `DOC-${200 + index}`,
    companyId: company.id,
    name:
      index % 5 === 0
        ? "service-agreement-summary.pdf"
        : index % 4 === 0
          ? "monthly-status-report.pdf"
          : index % 3 === 0
            ? "implementation-plan.docx"
            : "invoice-supporting-docs.zip",
    category: documentCategories[index % documentCategories.length],
    visibility: index % 7 === 0 ? "internal" : "client",
    size: `${1 + (index % 9)}.${index % 3} MB`,
    uploadedAt: subDays(now, index + 1).toISOString(),
    uploadedBy: index % 2 === 0 ? "Olivia Morris" : "Marcus Bell",
    summary:
      "Securely shared portal file with tagging, visibility controls, and audit trail metadata."
  };
});

const kbTopics = [
  "How to submit a request",
  "Understanding invoice statuses",
  "Where to find signed documents",
  "How approval workflows work",
  "Resetting your portal password",
  "Uploading files securely",
  "Project milestone terminology",
  "Exporting request history",
  "Managing notification preferences",
  "Preparing for onboarding",
  "How document visibility works",
  "What happens during maintenance",
  "Request priority guidelines",
  "Escalation process overview",
  "Using the knowledge base effectively"
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = kbTopics.map(
  (title, index) => ({
    id: `KB-${index + 1}`,
    title,
    category:
      index % 5 === 0
        ? "Onboarding"
        : index % 5 === 1
          ? "Billing"
          : index % 5 === 2
            ? "Documents"
            : index % 5 === 3
              ? "Projects"
              : "Support",
    excerpt:
      "Concise guidance written for clients so they can self-serve common questions without waiting on support.",
    content:
      "This article explains the process in straightforward language, outlines expected timelines, and links clients to the next best action when they need help.",
    published: index !== 13,
    updatedAt: subDays(now, index + 2).toISOString()
  })
);

export const notifications: NotificationItem[] = [
  {
    id: "NOTIF-1",
    title: "Invoice CF-2026007 is due in 3 days",
    description: "Finance reminder scheduled for your operations contact.",
    createdAt: subDays(now, 1).toISOString(),
    unread: true,
    audience: "client"
  },
  {
    id: "NOTIF-2",
    title: "REQ-1052 moved to Waiting on Client",
    description: "A new file approval is needed before we can complete rollout.",
    createdAt: subDays(now, 1).toISOString(),
    unread: true,
    audience: "client"
  },
  {
    id: "NOTIF-3",
    title: "Daily activity digest ready",
    description: "16 requests updated across the portfolio today.",
    createdAt: subDays(now, 1).toISOString(),
    unread: true,
    audience: "admin"
  },
  {
    id: "NOTIF-4",
    title: "New document uploaded",
    description: "Compliance packet shared for Harbor & Finch Legal.",
    createdAt: subDays(now, 2).toISOString(),
    unread: false,
    audience: "all"
  }
];

export const activityLogs: ActivityLog[] = [
  {
    id: "ACT-1",
    companyId: "company-1",
    title: "New request submitted",
    detail: "Amandel Studio opened REQ-1040 for portal onboarding support.",
    actor: "Sarah Chen",
    createdAt: subDays(now, 1).toISOString(),
    type: "request"
  },
  {
    id: "ACT-2",
    companyId: "company-5",
    title: "Invoice marked paid",
    detail: "Luma Commerce settled CF-2026006 through ACH.",
    actor: "Olivia Morris",
    createdAt: subDays(now, 1).toISOString(),
    type: "invoice"
  },
  {
    id: "ACT-3",
    companyId: "company-3",
    title: "Project milestone completed",
    detail: "Compliance remediation sprint passed QA and moved into review.",
    actor: "Marcus Bell",
    createdAt: subDays(now, 2).toISOString(),
    type: "project"
  },
  {
    id: "ACT-4",
    companyId: "company-7",
    title: "Document visibility changed",
    detail: "A compliance report was published to the client portal.",
    actor: "Olivia Morris",
    createdAt: subDays(now, 2).toISOString(),
    type: "document"
  },
  {
    id: "ACT-5",
    companyId: "company-2",
    title: "Access granted",
    detail: "New portal access was provisioned for Vector Health Partners.",
    actor: "Marcus Bell",
    createdAt: subDays(now, 3).toISOString(),
    type: "account"
  },
  {
    id: "ACT-6",
    companyId: "company-9",
    title: "Priority escalated",
    detail: "REQ-1065 was escalated to critical after client feedback.",
    actor: "Olivia Morris",
    createdAt: subDays(now, 3).toISOString(),
    type: "request"
  }
];

export const testimonials = [
  {
    quote:
      "ClientFlow Portal gave us the kind of premium digital front door we had been patching together in spreadsheets and email for years.",
    name: "Maya Thompson",
    company: "Harbor & Finch Legal"
  },
  {
    quote:
      "The demo feels like a real product. It makes it easy for clients to see progress and for our team to look far more organized.",
    name: "James Patel",
    company: "Vector Health Partners"
  },
  {
    quote:
      "From invoices to project milestones, everything finally lives in one polished place our clients actually want to use.",
    name: "Amara Okafor",
    company: "Luma Commerce"
  }
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "$149/mo",
    description: "For smaller teams that need a branded request and document portal.",
    features: ["Client dashboard", "Requests and documents", "Invoices", "Knowledge base"]
  },
  {
    name: "Growth",
    price: "$349/mo",
    description: "For agencies and service teams that want projects, messaging, and admin workflows.",
    features: ["Everything in Starter", "Project tracking", "Messaging", "Custom branding"]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For larger firms needing white-label deployment, advanced automation, and deeper integrations.",
    features: ["Impersonation mode", "Audit logs", "Supabase deployment", "Custom integrations"]
  }
];

export const demoCredentials = {
  client: {
    email: env.demoClientEmail,
    password: env.demoClientPassword
  },
  admin: {
    email: env.demoAdminEmail,
    password: env.demoAdminPassword
  }
};

export function getCompanyById(companyId: string) {
  return companies.find((company) => company.id === companyId);
}

export function getProfileByEmail(email: string) {
  return profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase());
}

export function getProfileById(profileId: string) {
  return profiles.find((profile) => profile.id === profileId);
}

export function getClientCompanyId(profileId: string) {
  return getProfileById(profileId)?.companyId;
}

export function getClientDashboard(companyId: string) {
  const companyRequests = requests.filter((request) => request.companyId === companyId);
  const companyProjects = projects.filter((project) => project.companyId === companyId);
  const companyInvoices = invoices.filter((invoice) => invoice.companyId === companyId);
  const companyDocuments = documents.filter(
    (document) => document.companyId === companyId && document.visibility === "client"
  );

  return {
    openRequests: companyRequests.filter((request) => request.status !== "Completed").length,
    activeProjects: companyProjects.filter((project) => project.status !== "Complete").length,
    unpaidInvoices: companyInvoices.filter((invoice) => invoice.status !== "Paid").length,
    unreadMessages: companyRequests.filter(
      (request) => request.status === "Waiting on Client" || request.status === "New"
    ).length,
    activity: activityLogs.filter((log) => log.companyId === companyId).slice(0, 5),
    requestStatusBreakdown: requestStatusSequence.map((status) => ({
      status,
      count: companyRequests.filter((request) => request.status === status).length
    })),
    documentsCount: companyDocuments.length
  };
}

export function getAdminDashboard() {
  return {
    totalClients: companies.length,
    openRequests: requests.filter((request) => request.status !== "Completed").length,
    overdueInvoices: invoices.filter((invoice) => invoice.status === "Overdue").length,
    activeProjects: projects.filter((project) => project.status !== "Complete").length,
    requestVolume: Array.from({ length: 6 }, (_, index) => ({
      label: `W${index + 1}`,
      value: 5 + index * 3 + (index % 2)
    })),
    requestStatusBreakdown: requestStatusSequence.map((status) => ({
      status,
      count: requests.filter((request) => request.status === status).length
    })),
    recentActivity: activityLogs
  };
}

export function getRequestById(id: string) {
  return requests.find((request) => request.id === id);
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getInvoiceById(id: string) {
  return invoices.find((invoice) => invoice.id === id);
}

export function getKnowledgeBaseArticleById(id: string) {
  return knowledgeBaseArticles.find((article) => article.id === id);
}

export function getRequestTone(status: RequestStatus): StatusTone {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    case "Waiting on Client":
      return "warning";
    case "Overdue":
      return "danger";
    default:
      return "neutral";
  }
}

export function getInvoiceTone(status: InvoiceItem["status"]): StatusTone {
  switch (status) {
    case "Paid":
      return "success";
    case "Overdue":
      return "danger";
    default:
      return "warning";
  }
}

export function getProjectTone(status: ProjectItem["status"]): StatusTone {
  switch (status) {
    case "Complete":
      return "success";
    case "In Progress":
      return "info";
    case "Review":
      return "warning";
    default:
      return "neutral";
  }
}

export function getRequestsForCompany(companyId: string) {
  return requests.filter((request) => request.companyId === companyId);
}

export function getProjectsForCompany(companyId: string) {
  return projects.filter((project) => project.companyId === companyId);
}

export function getInvoicesForCompany(companyId: string) {
  return invoices.filter((invoice) => invoice.companyId === companyId);
}

export function getDocumentsForCompany(companyId: string) {
  return documents.filter((document) => document.companyId === companyId);
}

export function getMessagesForRequest(requestId: string) {
  return requestMessages.filter((message) => message.requestId === requestId);
}

export function getMilestonesForProject(projectId: string) {
  return projectMilestones.filter((milestone) => milestone.projectId === projectId);
}

export function getKnowledgeBaseCategories() {
  return Array.from(new Set(knowledgeBaseArticles.map((article) => article.category)));
}

export function getGlobalSearchIndex() {
  return [
    ...requests.map((request) => ({
      id: request.id,
      type: "Request",
      label: request.subject,
      href: `/portal/client/requests/${request.id}`
    })),
    ...projects.map((project) => ({
      id: project.id,
      type: "Project",
      label: project.name,
      href: `/portal/client/projects/${project.id}`
    })),
    ...knowledgeBaseArticles.map((article) => ({
      id: article.id,
      type: "Article",
      label: article.title,
      href: `/portal/client/knowledge-base?article=${article.id}`
    }))
  ];
}
