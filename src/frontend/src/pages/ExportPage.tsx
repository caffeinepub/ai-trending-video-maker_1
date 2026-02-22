import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetVideoProject, useUpdateVideoProjectStatus } from '../hooks/useVideoProject';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, CheckCircle2, Sparkles } from 'lucide-react';
import { VideoStatus, SubscriptionTier } from '../backend';
import ExportProgress from '../components/ExportProgress';

export default function ExportPage() {
  const { projectId } = useParams({ from: '/export/$projectId' });
  const navigate = useNavigate();
  const { data: project, isLoading: projectLoading } = useGetVideoProject(projectId);
  const { data: userProfile } = useGetCallerUserProfile();
  const updateStatus = useUpdateVideoProjectStatus();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const isPremium = userProfile?.tier === SubscriptionTier.premium;

  useEffect(() => {
    if (project?.status === VideoStatus.completed) {
      setIsComplete(true);
      setExportProgress(100);
    }
  }, [project]);

  const handleExport = async () => {
    if (!project) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Set status to rendering
      await updateStatus.mutateAsync({ id: projectId, status: VideoStatus.rendering });

      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate export completion after 4 seconds
      setTimeout(async () => {
        clearInterval(interval);
        await updateStatus.mutateAsync({ id: projectId, status: VideoStatus.completed });
        setExportProgress(100);
        setIsComplete(true);
        setIsExporting(false);
      }, 4000);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
            <Button onClick={() => navigate({ to: '/account' })} className="mt-4">
              Back to Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Export Video</h1>
        <p className="text-muted-foreground">{project.title}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Format</p>
                <p className="font-medium">{project.format} (9:16)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-medium">{Number(project.script.duration)} seconds</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quality</p>
                <p className="font-medium">HD (1080p)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Watermark</p>
                <Badge variant={project.watermark ? 'secondary' : 'default'}>
                  {project.watermark ? 'Present' : 'Removed'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isPremium && project.watermark && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Upgrade to Premium
              </CardTitle>
              <CardDescription>Remove watermarks and unlock unlimited exports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/account' })} variant="default" className="w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {!isComplete && !isExporting && (
          <Button size="lg" onClick={handleExport} disabled={updateStatus.isPending} className="w-full gap-2">
            <Download className="w-5 h-5" />
            Export HD Video
          </Button>
        )}

        {isExporting && (
          <Card>
            <CardHeader>
              <CardTitle>Exporting Video...</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportProgress progress={exportProgress} />
            </CardContent>
          </Card>
        )}

        {isComplete && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-6 h-6" />
                Export Complete!
              </CardTitle>
              <CardDescription>Your video is ready to download</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">File Details</p>
                <p className="font-medium">{project.title}.mp4</p>
                <p className="text-sm text-muted-foreground">HD Quality • {project.format} • {Number(project.script.duration)}s</p>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2">
                  <Download className="w-5 h-5" />
                  Download Video
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/account' })} className="flex-1">
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
