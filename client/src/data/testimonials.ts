export interface Testimonial {
  id: string;
  name: string;
  text: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    text: "Jason fixed our burst pipe within hours of calling. Professional, clean, and fair pricing. Highly recommend!",
    date: "2026-06-08",
  },
  {
    id: "2",
    name: "David Thompson",
    text: "Excellent work on our bathroom renovation. Jason was punctual, knowledgeable, and left everything spotless. Will definitely use again.",
    date: "2026-06-01",
  },
  {
    id: "3",
    name: "Emma Richardson",
    text: "Our kitchen tap installation was seamless. Jason explained everything clearly and finished ahead of schedule. Great service!",
    date: "2026-05-25",
  },
  {
    id: "4",
    name: "Michael Chen",
    text: "Called for an emergency leak repair. Jason arrived quickly and resolved the issue professionally. Worth every penny.",
    date: "2026-05-18",
  },
  {
    id: "5",
    name: "Linda Patel",
    text: "Fantastic plumber. Installed our new radiators and they work perfectly. Jason is reliable, friendly, and does quality work.",
    date: "2026-05-10",
  },
];
