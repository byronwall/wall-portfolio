import { ReactNode } from "react";

export interface TimelineItem {
  title: ReactNode;
  date: string;
  children: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <section className="bw-timeline not-prose" aria-label="Timeline">
      <div className="relative">
        {/* Rail */}
        <div
          className="pointer-events-none absolute left-2 top-1 bottom-1 w-px bg-neutral-200 dark:bg-neutral-800"
          aria-hidden="true"
        />

        <div role="list" className="space-y-8">
          {items.map((item, index) => (
            <div
              key={index}
              role="listitem"
              className="relative grid grid-cols-[1.25rem_1fr] gap-x-6"
            >
              {/* Marker */}
              <div className="relative">
                <div
                  className="absolute left-[0.2rem] top-[0.35rem] grid h-4 w-4 place-items-center rounded-full bg-white ring-1 ring-neutral-200 dark:bg-black dark:ring-neutral-800"
                  aria-hidden="true"
                >
                  <div className="h-2 w-2 rounded-full bg-neutral-900/70 dark:bg-neutral-100/70" />
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div className="min-w-0 text-xl font-semibold tracking-tight leading-snug [&_a]:underline [&_a]:decoration-neutral-400 dark:[&_a]:decoration-neutral-600 [&_a]:underline-offset-2">
                    {item.title}
                  </div>
                  <time className="shrink-0 text-sm text-neutral-600 dark:text-neutral-400">
                    {item.date}
                  </time>
                </div>

                <div className="mt-3 text-[0.98rem] leading-relaxed text-neutral-800 dark:text-neutral-200 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1">
                  {item.children}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
