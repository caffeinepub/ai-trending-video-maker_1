import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetTrendingTopicsSortedByEngagement, useFilterTrendingTopicsByPlatform } from '../hooks/useTrendingTopics';
import { Platform } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Flame, TrendingUp, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import TrendingTopicCard from '../components/TrendingTopicCard';

export default function TrendingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const navigate = useNavigate();

  const { data: allTopics, isLoading: allLoading } = useGetTrendingTopicsSortedByEngagement();
  const { data: youtubeTopics, isLoading: youtubeLoading } = useFilterTrendingTopicsByPlatform(Platform.youtube);
  const { data: instagramTopics, isLoading: instagramLoading } = useFilterTrendingTopicsByPlatform(Platform.instagram);
  const { data: xTopics, isLoading: xLoading } = useFilterTrendingTopicsByPlatform(Platform.x);
  const { data: googleTopics, isLoading: googleLoading } = useFilterTrendingTopicsByPlatform(Platform.googleTrends);

  const handleTopicSelect = (topicId: string) => {
    navigate({ to: '/configure/$topicId', params: { topicId } });
  };

  const isLoading = allLoading || youtubeLoading || instagramLoading || xLoading || googleLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trending topics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/assets/generated/trending-icon.dim_128x128.png" alt="Trending" className="w-12 h-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Trending Topics
          </h1>
        </div>
        <p className="text-muted-foreground">
          Discover viral topics from social media and create engaging videos instantly
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setSelectedPlatform(v as Platform | 'all')}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all" className="gap-2">
            <Flame className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger value={Platform.youtube} className="gap-2">
            YouTube
          </TabsTrigger>
          <TabsTrigger value={Platform.instagram} className="gap-2">
            Instagram
          </TabsTrigger>
          <TabsTrigger value={Platform.x} className="gap-2">
            X (Twitter)
          </TabsTrigger>
          <TabsTrigger value={Platform.googleTrends} className="gap-2">
            Google
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allTopics && allTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTopics.map((topic) => (
                <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No trending topics available yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={Platform.youtube} className="space-y-4">
          {youtubeTopics && youtubeTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {youtubeTopics.map((topic) => (
                <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No YouTube trending topics available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={Platform.instagram} className="space-y-4">
          {instagramTopics && instagramTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instagramTopics.map((topic) => (
                <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No Instagram trending topics available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={Platform.x} className="space-y-4">
          {xTopics && xTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {xTopics.map((topic) => (
                <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No X (Twitter) trending topics available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value={Platform.googleTrends} className="space-y-4">
          {googleTopics && googleTopics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {googleTopics.map((topic) => (
                <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No Google Trends topics available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
