import Link from "next/link";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/layout/global-search";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { NotificationMenu } from "@/components/layout/notification-menu";
import type { NotificationItem, Profile } from "@/lib/types";

export function PortalHeader({
  profile,
  searchItems,
  notifications
}: {
  profile: Profile;
  searchItems: Array<{ id: string; type: string; label: string; href: string }>;
  notifications: NotificationItem[];
}) {
  return (
    <div className="surface flex flex-col gap-4 rounded-[2rem] p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearch items={searchItems} />
        <div className="flex items-center justify-between gap-3 xl:justify-end">
          <div className="flex items-center gap-2">
            <NotificationMenu items={notifications} />
            <ModeToggle />
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-background/70 px-3 py-2 sm:flex">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{profile.avatar}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">{profile.title}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/api/auth/logout">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

