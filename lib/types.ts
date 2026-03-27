export type UserRole = "client" | "admin";

export type StatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger";

export type RequestStatus =
  | "New"
  | "In Progress"
  | "Waiting on Client"
  | "Completed"
  | "Overdue";

export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";

export type ProjectStatus = "Planning" | "In Progress" | "Review" | "Complete";

export interface Company {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  plan: string;
  location: string;
  clientSince: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  companyId: string;
  title: string;
  avatar: string;
  phone: string;
}

export interface RequestItem {
  id: string;
  companyId: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: RequestStatus;
  assignee: string;
  lastUpdated: string;
  createdAt: string;
  description: string;
  relatedDocumentIds: string[];
}

export interface RequestMessage {
  id: string;
  requestId: string;
  author: string;
  role: "client" | "staff";
  body: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  companyId: string;
  name: string;
  category: string;
  visibility: "client" | "internal";
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  summary: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  status: "Upcoming" | "In Progress" | "Done";
}

export interface ProjectItem {
  id: string;
  companyId: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  manager: string;
  deadline: string;
  description: string;
  budget: number;
}

export interface InvoiceItem {
  id: string;
  companyId: string;
  invoiceNumber: string;
  amount: number;
  issuedAt: string;
  dueDate: string;
  status: InvoiceStatus;
  summary: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
  audience: UserRole | "all";
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  companyId?: string;
  title: string;
  detail: string;
  actor: string;
  createdAt: string;
  type: "request" | "invoice" | "project" | "document" | "account";
}

export interface BrandingSettings {
  portalName: string;
  companyName: string;
  logoPlaceholder: string;
  accentHsl: string;
  supportEmail?: string;
}
