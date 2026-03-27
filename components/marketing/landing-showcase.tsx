"use client";

import { motion } from "framer-motion";
import { Activity, CreditCard, Files, Ticket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cards = [
  {
    title: "Client Dashboard",
    value: "4 open requests",
    icon: Ticket,
    accent: "left-10 top-8"
  },
  {
    title: "Project Pulse",
    value: "68% rollout complete",
    icon: Activity,
    accent: "right-8 top-24"
  },
  {
    title: "Billing Overview",
    value: "2 unpaid invoices",
    icon: CreditCard,
    accent: "left-0 bottom-16"
  },
  {
    title: "Document Vault",
    value: "40 secure files",
    icon: Files,
    accent: "right-2 bottom-0"
  }
];

export function LandingShowcase() {
  return (
    <div className="relative min-h-[520px]">
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-soft via-white to-amber-50 shadow-card dark:from-brand-soft/30 dark:via-slate-950 dark:to-slate-900" />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative grid min-h-[520px] gap-5 p-8 sm:p-10"
      >
        <Card className="border-none bg-slate-950 text-white shadow-none dark:bg-slate-900">
          <CardHeader className="pb-3">
            <Badge variant="accent" className="w-fit">
              Premium SaaS demo
            </Badge>
            <CardTitle className="mt-4 text-2xl text-white">A client portal that sells itself</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">{card.title}</p>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-8 font-display text-2xl">{card.value}</p>
                  <div className="mt-6 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-teal-400"
                      style={{ width: `${55 + index * 10}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

