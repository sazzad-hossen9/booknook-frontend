import { SectionHeading } from "@/components/SectionHeading";
import { BookPlus, BookOpenCheck, RotateCcw, ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Add a book",
    description: "Share your favourite book with the community.",
    icon: BookPlus,
  },
  {
    step: 2,
    title: "Borrow a book",
    description: "Take a book and enjoy your reading time.",
    icon: BookOpenCheck,
  },
  {
    step: 3,
    title: "Return with care",
    description: "Bring it back so others can enjoy it too.",
    icon: RotateCcw,
  },
];

/**
 * How Borrowing Works section illustrating the 3 easy steps.
 */
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
      <SectionHeading
        title="How Borrowing Works"
        subtitle="It's simple! Just follow these steps."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="relative flex">
              <div className="flex w-full flex-col items-start rounded-[16px] border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md">
                {/* Step badge */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E0A526] text-xs font-bold text-[#1F2A44] shadow-xs">
                  {item.step}
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF7F2] dark:bg-[#111624] border border-border text-[#1F2A44] dark:text-[#E0A526]">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connecting arrow on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-background border border-border text-muted-foreground shadow-xs">
                  <ArrowRight className="h-3.5 w-3.5 text-[#E0A526]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

