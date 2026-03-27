"use client";

import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types";

export function NotificationMenu({ items }: { items: NotificationItem[] }) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount ? (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.id} className="block space-y-1 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.title}</p>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(item.createdAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

