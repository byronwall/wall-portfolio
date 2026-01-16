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
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-neutral-200 dark:bg-neutral-700" />

      {items.map((item, index) => (
        <div key={index} className="relative flex gap-6 pb-8 group">
          {/* Timeline dot */}
          <div className="absolute left-3 w-1 h-1 p-1.5 -translate-x-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700 border-4 border-white dark:border-black group-hover:border-neutral-200 dark:group-hover:border-neutral-700 transition-colors" />

          {/* Content */}
          <div className="ml-8">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              {item.date}
            </p>
            <div className="text-neutral-800 dark:text-neutral-200">
              {item.children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
