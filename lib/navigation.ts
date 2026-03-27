import {
  BookOpen,
  CreditCard,
  Files,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Paintbrush,
  ReceiptText,
  Settings,
  Shield,
  Ticket,
  Users
} from "lucide-react";

export const marketingNav = [
  { label: "Product", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" }
];

export const clientNav = [
  { label: "Dashboard", href: "/portal/client", icon: LayoutDashboard },
  { label: "My Requests", href: "/portal/client/requests", icon: Ticket },
  { label: "Projects", href: "/portal/client/projects", icon: FolderKanban },
  { label: "Documents", href: "/portal/client/documents", icon: Files },
  { label: "Invoices", href: "/portal/client/invoices", icon: CreditCard },
  { label: "Messages", href: "/portal/client/messages", icon: MessageSquare },
  { label: "Knowledge Base", href: "/portal/client/knowledge-base", icon: BookOpen },
  { label: "Profile & Settings", href: "/portal/client/settings", icon: Settings }
];

export const adminNav = [
  { label: "Dashboard", href: "/portal/admin", icon: LayoutDashboard },
  { label: "Client Management", href: "/portal/admin/clients", icon: Users },
  { label: "Request Management", href: "/portal/admin/requests", icon: Ticket },
  { label: "Project Management", href: "/portal/admin/projects", icon: FolderKanban },
  { label: "Invoice Management", href: "/portal/admin/invoices", icon: ReceiptText },
  { label: "Document Management", href: "/portal/admin/documents", icon: Files },
  { label: "Knowledge Base", href: "/portal/admin/knowledge-base", icon: BookOpen },
  { label: "Branding Settings", href: "/portal/admin/branding", icon: Paintbrush },
  { label: "Audit Log", href: "/portal/admin/activity", icon: Shield }
];

