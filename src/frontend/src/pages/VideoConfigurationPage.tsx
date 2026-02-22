import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetTrendingTopic } from '../hooks/useTrendingTopics';
import { useGenerateScript } from '../hooks/useScriptGeneration';
import { useCreateVideoProject } from '../hooks/useVideoProjectMutations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Wand2 } from 'lucide-react';
import { Variant_hindi_both_english, Variant_dramatic_emotional, Variant_female_male, Variant_tiktok_youtubeShorts_instagramReels } from '../backend';

export default function VideoConfigurationPage() {
  const { topicId } = useParams({ from: '/configure/$topicId' });
  const navigate = useNavigate();
  const { data: topic, isLoading: topicLoading } = useGetTrendingTopic(topicId);
  const generateScript = useGenerateScript();
  const createProject = useCreateVideoProject();

  const [language, setLanguage] = useState<Variant_hindi_both_english>(Variant_hindi_both_english.both);
  const [style, setStyle] = useState<Variant_dramatic_emotional>(Variant_dramatic_emotional.emotional);
  const [voiceover, setVoiceover] = useState<Variant_female_male>(Variant_female_male.female);
  const [format, setFormat] = useState<Variant_tiktok_youtubeShorts_instagramReels>(Variant_tiktok_youtubeShorts_instagramReels.youtubeShorts);
  const [duration, setDuration] = useState<number>(30);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [editedHookLine, setEditedHookLine] = useState<string>('');
  const [editedMainContent, setEditedMainContent] = useState<string>('');

  const handleGenerateScript = async () => {
    if (!topic) return;
    try {
      const script = await generateScript.mutateAsync({
        topic: topic.topic,
        language,
        duration: BigInt(duration),
        style,
      });
      setGeneratedScript(script);
      setEditedHookLine(script.hookLine);
      setEditedMainContent(script.mainContent);
    } catch (error) {
      console.error('Script generation error:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!generatedScript || !topic) return;
    try {
      const finalScript = {
        ...generatedScript,
        hookLine: editedHookLine,
        mainContent: editedMainContent,
      };
      const projectId = await createProject.mutateAsync({
        title: `Video: ${topic.topic}`,
        topicId: topic.id,
        script: finalScript,
        stockVideoIds: ['stock-1', 'stock-2', 'stock-3'],
        musicId: 'music-1',
        voiceover,
        format,
      });
      navigate({ to: '/editor/$projectId', params: { projectId } });
    } catch (error) {
      console.error('Project creation error:', error);
    }
  };

  if (topicLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading topic...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Topic not found</p>
            <Button onClick={() => navigate({ to: '/trending' })} className="mt-4">
              Back to Trending
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Configure Your Video</h1>
        <p className="text-muted-foreground">Customize settings for: {topic.topic}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language & Style</CardTitle>
            <CardDescription>Choose the language and storytelling style for your video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as Variant_hindi_both_english)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Variant_hindi_both_english.english}>English</SelectItem>
                  <SelectItem value={Variant_hindi_both_english.hindi}>हिंदी (Hindi)</SelectItem>
                  <SelectItem value={Variant_hindi_both_english.both}>Both (Bilingual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Script Style</Label>
              <RadioGroup value={style} onValueChange={(v) => setStyle(v as Variant_dramatic_emotional)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_dramatic_emotional.emotional} id="emotional" />
                  <Label htmlFor="emotional" className="cursor-pointer">
                    Emotional - Heartfelt and inspiring
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_dramatic_emotional.dramatic} id="dramatic" />
                  <Label htmlFor="dramatic" className="cursor-pointer">
                    Dramatic - Bold and attention-grabbing
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Duration</Label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voiceover & Format</CardTitle>
            <CardDescription>Select voiceover gender and export format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>AI Voiceover</Label>
              <RadioGroup value={voiceover} onValueChange={(v) => setVoiceover(v as Variant_female_male)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_female_male.female} id="female" />
                  <Label htmlFor="female" className="cursor-pointer">
                    Female Voice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_female_male.male} id="male" />
                  <Label htmlFor="male" className="cursor-pointer">
                    Male Voice
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Export Format</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as Variant_tiktok_youtubeShorts_instagramReels)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_tiktok_youtubeShorts_instagramReels.youtubeShorts} id="youtube" />
                  <Label htmlFor="youtube" className="cursor-pointer">
                    YouTube Shorts (9:16)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_tiktok_youtubeShorts_instagramReels.instagramReels} id="instagram" />
                  <Label htmlFor="instagram" className="cursor-pointer">
                    Instagram Reels (9:16)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Variant_tiktok_youtubeShorts_instagramReels.tiktok} id="tiktok" />
                  <Label htmlFor="tiktok" className="cursor-pointer">
                    TikTok (9:16)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {!generatedScript ? (
          <Button
            size="lg"
            onClick={handleGenerateScript}
            disabled={generateScript.isPending}
            className="w-full gap-2"
          >
            {generateScript.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Script
              </>
            )}
          </Button>
        ) : (
          <>
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  Generated Script
                </CardTitle>
                <CardDescription>Edit the script below before creating your video project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-primary">Hook Line (First 3 seconds)</Label>
                  <Textarea
                    value={editedHookLine}
                    onChange={(e) => setEditedHookLine(e.target.value)}
                    className="mt-2 min-h-[80px] hindi-text"
                    placeholder="Enter hook line..."
                  />
                </div>
                <Separator />
                <div>
                  <Label>Main Content</Label>
                  <Textarea
                    value={editedMainContent}
                    onChange={(e) => setEditedMainContent(e.target.value)}
                    className="mt-2 min-h-[200px] hindi-text"
                    placeholder="Enter main content..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleGenerateScript} disabled={generateScript.isPending} className="flex-1">
                Regenerate Script
              </Button>
              <Button onClick={handleCreateProject} disabled={createProject.isPending} className="flex-1 gap-2">
                {createProject.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Create Video Project
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
