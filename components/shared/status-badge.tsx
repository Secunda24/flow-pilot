import { Badge } from "@/components/ui/badge";
import {
  getInvoiceTone,
  getProjectTone,
  getRequestTone
} from "@/lib/demo-data";
import type { InvoiceItem, ProjectItem, RequestStatus } from "@/lib/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge variant={getRequestTone(status)}>{status}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceItem["status"] }) {
  return <Badge variant={getInvoiceTone(status)}>{status}</Badge>;
}

export function ProjectStatusBadge({ status }: { status: ProjectItem["status"] }) {
  return <Badge variant={getProjectTone(status)}>{status}</Badge>;
}

