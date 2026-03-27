"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { SiteLogo } from "@/components/shared/site-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

function NavContent({
  items,
  portalName,
  mark
}: {
  items: NavItem[];
  portalName: string;
  mark: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
      <SiteLogo name={portalName} mark={mark} href="/" />
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PortalSidebar({
  items,
  portalName,
  mark
}: {
  items: NavItem[];
  portalName: string;
  mark: string;
}) {
  return (
    <>
      <aside className="surface hidden h-[calc(100vh-2rem)] rounded-[2rem] p-6 lg:block">
        <NavContent items={items} portalName={portalName} mark={mark} />
      </aside>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="left-0 top-0 h-full max-w-sm translate-x-0 translate-y-0 rounded-none border-r p-6 sm:max-w-sm">
          <NavContent items={items} portalName={portalName} mark={mark} />
        </DialogContent>
      </Dialog>
    </>
  );
}
