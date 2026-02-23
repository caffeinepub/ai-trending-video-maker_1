import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import { TrendingTopic, Platform } from '../backend';

interface TrendingTopicCardProps {
  topic: TrendingTopic;
  onSelect: (topicId: string) => void;
}

const platformColors: Record<Platform, string> = {
  [Platform.youtube]: 'bg-red-500/10 text-red-400 border-red-500/50',
  [Platform.instagram]: 'bg-pink-500/10 text-pink-400 border-pink-500/50',
  [Platform.x]: 'bg-blue-500/10 text-blue-400 border-blue-500/50',
  [Platform.googleTrends]: 'bg-green-500/10 text-green-400 border-green-500/50',
};

const platformLabels: Record<Platform, string> = {
  [Platform.youtube]: 'YouTube',
  [Platform.instagram]: 'Instagram',
  [Platform.x]: 'X',
  [Platform.googleTrends]: 'Google',
};

export default function TrendingTopicCard({ topic, onSelect }: TrendingTopicCardProps) {
  const totalEngagement = Number(topic.metrics.likes + topic.metrics.shares + topic.metrics.comments + topic.metrics.views);

  const handleCreateVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(topic.id);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={platformColors[topic.platform]}>{platformLabels[topic.platform]}</Badge>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{topic.topic}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {topic.hashtags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {topic.keywords.slice(0, 3).map((keyword, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Number(topic.metrics.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{Number(topic.metrics.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            <span>{Number(topic.metrics.shares)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{Number(topic.metrics.comments)}</span>
          </div>
        </div>
        <Button 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
          onClick={handleCreateVideo}
        >
          Create Video
        </Button>
      </CardContent>
    </Card>
  );
}
