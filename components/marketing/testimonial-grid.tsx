import { testimonials } from "@/lib/demo-data";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.name}>
          <CardContent className="space-y-5 px-6 py-8">
            <p className="font-display text-xl leading-8 text-foreground">
              “{testimonial.quote}”
            </p>
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.company}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

