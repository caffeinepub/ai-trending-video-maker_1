import { ReactNode } from 'react';

interface TimelineItem {
  id: string;
  label: string;
  duration: number;
}

interface TimelineTrackProps {
  icon: ReactNode;
  label: string;
  items: TimelineItem[];
  color: string;
}

export default function TimelineTrack({ icon, label, items, color }: TimelineTrackProps) {
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="relative h-16 bg-accent/20 rounded-lg border border-border overflow-hidden">
        <div className="absolute inset-0 flex">
          {items.map((item, idx) => {
            const widthPercent = (item.duration / totalDuration) * 100;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-center border-r border-border/50 ${color} transition-all hover:opacity-80`}
                style={{ width: `${widthPercent}%` }}
              >
                <span className="text-xs font-medium px-2 truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
