import Link from "next/link";
import { ArrowRight, CheckCircle2, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  flowPilotFaqs,
  flowPilotLandingFeatures,
  flowPilotTemplates,
  flowPilotTestimonials,
  flowPilotWorkflowCards
} from "@/lib/flowpilot-data";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="container grid gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
        <FadeIn className="space-y-8">
          <div className="space-y-5">
            <span className="eyebrow">Premium automation platform demo</span>
            <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
              Automate the Work That Slows Your Business Down
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              FlowPilot Automation helps businesses automate lead response, bookings, invoices,
              tasks, client follow-ups, social media publishing, and internal notifications using
              simple trigger-based workflows that still look enterprise-ready.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">
                View Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Start Building</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <Sparkles className="h-5 w-5 text-brand" />
              <p className="mt-3 font-semibold">Builder-led automation</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Create polished workflows without a clunky admin-form feel.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <p className="mt-3 font-semibold">Supabase ready</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Auth, schema, seed data, and RLS policies are part of the delivery.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <CheckCircle2 className="h-5 w-5 text-brand" />
              <p className="mt-3 font-semibold">Sales-demo quality</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The dashboard, logs, and templates are designed to impress fast.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative rounded-[2.5rem] border border-white/30 bg-slate-950/95 p-6 text-white shadow-card">
            <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_24%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-slate-300">Today’s automation health</p>
                  <p className="mt-1 text-3xl font-semibold">96.4%</p>
                </div>
                <Badge variant="success">Stable</Badge>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                <Card className="border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle className="text-base">Flow builder</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Trigger</p>
                      <p className="mt-2 font-semibold">New lead created</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Condition</p>
                      <p className="mt-2 font-semibold">Lead source = Facebook</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Actions</p>
                      <p className="mt-2 font-semibold">Send WhatsApp · Create task · Notify team</p>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                      <CardTitle className="text-base">Run volume</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[38, 54, 46, 68, 59, 72].map((value, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>Day {index + 1}</span>
                            <span>{value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                      <CardTitle className="text-base">Fast launch story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-300">
                      <p>12 seeded automations</p>
                      <p>120 execution logs</p>
                      <p>Social planner and approvals</p>
                      <p>Role-based demo access</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="platform" className="container py-12 lg:py-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="eyebrow">Platform</span>
            <h2 className="section-title">A premium SaaS story from the first click</h2>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            The app combines workflow automation, social scheduling, logs, tasks, notifications,
            templates, analytics, and settings in a polished dashboard shell designed for serious
            demos and future custom builds.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {flowPilotLandingFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="workflows" className="container py-12 lg:py-20">
        <div className="mb-10 space-y-3 text-center">
          <span className="eyebrow">Workflows</span>
          <h2 className="section-title">Workflow illustration cards that sell the value fast</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            These examples mirror real business logic for lead response, booking reminders,
            overdue invoices, and social content approvals.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {flowPilotWorkflowCards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-brand/15 bg-brand-soft/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Trigger</p>
                  <p className="mt-2 text-lg font-semibold">{card.trigger}</p>
                </div>
                <div className="space-y-3">
                  {card.steps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                        {index + 1}
                      </div>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-12 lg:py-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="eyebrow">Templates</span>
            <h2 className="section-title">Ready-made workflows for common business moments</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/workspace/templates">See all templates</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {flowPilotTemplates
            .filter((template) =>
              ["Sales", "Marketing", "Finance", "Onboarding"].includes(template.category)
            )
            .slice(0, 4)
            .map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{template.name}</CardTitle>
                  <Badge variant="accent">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <p className="text-sm font-medium text-brand">{template.estimatedLift}</p>
                <Button variant="outline" asChild>
                  <Link href={`/login?redirectTo=/workspace/automations/new?template=${template.id}`}>
                    Use template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="testimonials" className="container py-12 lg:py-20">
        <div className="mb-10 space-y-3 text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title">What teams say when the product actually feels buyable</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {flowPilotTestimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="space-y-4 pt-6">
                <PlayCircle className="h-5 w-5 text-brand" />
                <p className="text-base leading-7">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="container py-12 lg:py-20">
        <div className="mb-10 space-y-3 text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Questions buyers usually ask before the demo ends</h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4">
          {flowPilotFaqs.map((item) => (
            <Card key={item.question}>
              <CardContent className="space-y-3 pt-6">
                <p className="text-lg font-semibold">{item.question}</p>
                <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-12 lg:py-20">
        <div className="rounded-[2.5rem] bg-slate-950 px-8 py-12 text-white shadow-card sm:px-12">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <span className="eyebrow border-white/10 bg-white/10 text-white">Launch your demo</span>
            <h2 className="font-display text-4xl font-semibold">
              Present workflow automation like a real software company would
            </h2>
            <p className="text-base leading-8 text-slate-300">
              Use this as a white-label foundation for real estate, accounting, service businesses,
              or internal operations teams that need a more premium automation story.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/login">Explore the live demo</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/signup">Start building</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
