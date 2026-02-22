import { Progress } from '@/components/ui/progress';

interface ExportProgressProps {
  progress: number;
}

export default function ExportProgress({ progress }: ExportProgressProps) {
  const getStatusMessage = () => {
    if (progress < 25) return 'Preparing video assets...';
    if (progress < 50) return 'Rendering video clips...';
    if (progress < 75) return 'Adding audio and effects...';
    if (progress < 95) return 'Finalizing export...';
    return 'Complete!';
  };

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-3" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{getStatusMessage()}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
