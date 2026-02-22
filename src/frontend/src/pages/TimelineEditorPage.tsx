import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetVideoProject } from '../hooks/useVideoProject';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Film, Music, Type, Sparkles, Download } from 'lucide-react';
import TimelineTrack from '../components/TimelineTrack';

export default function TimelineEditorPage() {
  const { projectId } = useParams({ from: '/editor/$projectId' });
  const navigate = useNavigate();
  const { data: project, isLoading } = useGetVideoProject(projectId);

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
              <Badge variant="outline">{project.format}</Badge>
            </div>
          </div>
          <Button onClick={() => navigate({ to: '/export/$projectId', params: { projectId } })} className="gap-2">
            <Download className="w-4 h-4" />
            Export Video
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Hook Line</p>
              <p className="p-3 bg-accent/20 rounded-lg">{project.script.hookLine}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Main Content</p>
              <p className="p-3 bg-accent/20 rounded-lg">{project.script.mainContent}</p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Language: {project.script.language}</span>
              <span>•</span>
              <span>Style: {project.script.style}</span>
              <span>•</span>
              <span>Duration: {Number(project.script.duration)}s</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimelineTrack
              icon={<Film className="w-5 h-5" />}
              label="Video Clips"
              items={project.stockVideoIds.map((id, idx) => ({
                id,
                label: `Clip ${idx + 1}`,
                duration: 10,
              }))}
              color="bg-primary/20 border-primary/50"
            />
            <TimelineTrack
              icon={<Music className="w-5 h-5" />}
              label="Background Music"
              items={[{ id: project.musicId, label: 'Background Track', duration: Number(project.script.duration) }]}
              color="bg-emerald-500/20 border-emerald-500/50"
            />
            {project.subtitles && (
              <TimelineTrack
                icon={<Type className="w-5 h-5" />}
                label="Subtitles"
                items={[{ id: 'subtitles', label: 'Animated Captions', duration: Number(project.script.duration) }]}
                color="bg-teal-500/20 border-teal-500/50"
              />
            )}
            <TimelineTrack
              icon={<Sparkles className="w-5 h-5" />}
              label="Voiceover"
              items={[{ id: 'voiceover', label: `${project.voiceover} Voice`, duration: Number(project.script.duration) }]}
              color="bg-amber-500/20 border-amber-500/50"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Voiceover</p>
              <p className="font-medium">{project.voiceover === 'male' ? 'Male Voice' : 'Female Voice'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Subtitles</p>
              <p className="font-medium">{project.subtitles ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Format</p>
              <p className="font-medium">{project.format} (9:16)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Watermark</p>
              <p className="font-medium">{project.watermark ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
