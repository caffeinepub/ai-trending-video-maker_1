import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Platform, TrendingTopic } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame } from 'lucide-react';
import TrendingTopicCard from '../components/TrendingTopicCard';

// Hardcoded mock trending topics data
const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  // YouTube Topics (Video-centric)
  {
    id: 'topic-yt-1',
    platform: Platform.youtube,
    topic: 'AI Revolution 2026: Complete Guide',
    hashtags: ['#AI', '#TechTrends', '#Innovation', '#FutureTech', '#MachineLearning'],
    keywords: ['artificial intelligence', 'future tech', 'AI tools', 'automation', 'tech revolution'],
    timestamp: BigInt(Date.now() - 3600000),
    metrics: {
      views: 4500000n,
      likes: 380000n,
      shares: 125000n,
      comments: 45000n,
    },
  },
  {
    id: 'topic-yt-2',
    platform: Platform.youtube,
    topic: '5 Hidden iPhone Tricks You Must Know',
    hashtags: ['#iPhone', '#TechTips', '#Apple', '#iOS', '#Productivity'],
    keywords: ['iphone tricks', 'hidden features', 'ios tips', 'apple secrets', 'smartphone hacks'],
    timestamp: BigInt(Date.now() - 7200000),
    metrics: {
      views: 3200000n,
      likes: 290000n,
      shares: 95000n,
      comments: 38000n,
    },
  },
  {
    id: 'topic-yt-3',
    platform: Platform.youtube,
    topic: 'Morning Routine for Maximum Productivity',
    hashtags: ['#MorningRoutine', '#Productivity', '#SelfImprovement', '#Motivation', '#Success'],
    keywords: ['morning habits', 'productivity tips', 'daily routine', 'success mindset', 'self growth'],
    timestamp: BigInt(Date.now() - 10800000),
    metrics: {
      views: 2800000n,
      likes: 245000n,
      shares: 78000n,
      comments: 32000n,
    },
  },
  {
    id: 'topic-yt-4',
    platform: Platform.youtube,
    topic: 'Crypto Market Analysis: What\'s Next?',
    hashtags: ['#Crypto', '#Bitcoin', '#Finance', '#Investment', '#Trading'],
    keywords: ['cryptocurrency', 'bitcoin price', 'crypto news', 'blockchain', 'investment strategy'],
    timestamp: BigInt(Date.now() - 14400000),
    metrics: {
      views: 1900000n,
      likes: 165000n,
      shares: 52000n,
      comments: 28000n,
    },
  },
  {
    id: 'topic-yt-5',
    platform: Platform.youtube,
    topic: 'Ultimate Gaming Setup Tour 2026',
    hashtags: ['#Gaming', '#SetupTour', '#PCGaming', '#GamingRoom', '#TechSetup'],
    keywords: ['gaming setup', 'pc build', 'gaming room', 'tech tour', 'gaming gear'],
    timestamp: BigInt(Date.now() - 18000000),
    metrics: {
      views: 2100000n,
      likes: 195000n,
      shares: 68000n,
      comments: 25000n,
    },
  },

  // Instagram Topics (Lifestyle & Visual)
  {
    id: 'topic-ig-1',
    platform: Platform.instagram,
    topic: 'Summer Fashion Trends 2026',
    hashtags: ['#Fashion', '#SummerStyle', '#OOTD', '#FashionTrends', '#StyleInspo'],
    keywords: ['summer fashion', 'outfit ideas', 'style trends', 'fashion tips', 'wardrobe essentials'],
    timestamp: BigInt(Date.now() - 21600000),
    metrics: {
      views: 3500000n,
      likes: 420000n,
      shares: 135000n,
      comments: 52000n,
    },
  },
  {
    id: 'topic-ig-2',
    platform: Platform.instagram,
    topic: 'Healthy Meal Prep Ideas',
    hashtags: ['#MealPrep', '#HealthyEating', '#FitnessFood', '#NutritionTips', '#CleanEating'],
    keywords: ['meal prep', 'healthy recipes', 'fitness meals', 'nutrition guide', 'diet tips'],
    timestamp: BigInt(Date.now() - 25200000),
    metrics: {
      views: 2900000n,
      likes: 365000n,
      shares: 118000n,
      comments: 48000n,
    },
  },
  {
    id: 'topic-ig-3',
    platform: Platform.instagram,
    topic: 'Travel Destinations You Must Visit',
    hashtags: ['#Travel', '#Wanderlust', '#TravelGoals', '#ExploreMore', '#TravelTips'],
    keywords: ['travel destinations', 'vacation spots', 'travel guide', 'adventure travel', 'bucket list'],
    timestamp: BigInt(Date.now() - 28800000),
    metrics: {
      views: 4100000n,
      likes: 485000n,
      shares: 152000n,
      comments: 61000n,
    },
  },
  {
    id: 'topic-ig-4',
    platform: Platform.instagram,
    topic: 'Home Decor Transformation',
    hashtags: ['#HomeDecor', '#InteriorDesign', '#HomeInspo', '#RoomMakeover', '#DecorIdeas'],
    keywords: ['home decor', 'interior design', 'room makeover', 'decor tips', 'home styling'],
    timestamp: BigInt(Date.now() - 32400000),
    metrics: {
      views: 2600000n,
      likes: 315000n,
      shares: 98000n,
      comments: 42000n,
    },
  },
  {
    id: 'topic-ig-5',
    platform: Platform.instagram,
    topic: 'Fitness Motivation & Workout Tips',
    hashtags: ['#Fitness', '#WorkoutMotivation', '#GymLife', '#FitnessJourney', '#HealthyLifestyle'],
    keywords: ['fitness motivation', 'workout tips', 'gym routine', 'fitness goals', 'exercise guide'],
    timestamp: BigInt(Date.now() - 36000000),
    metrics: {
      views: 3300000n,
      likes: 395000n,
      shares: 125000n,
      comments: 55000n,
    },
  },

  // X (Twitter) Topics (News & Discussions)
  {
    id: 'topic-x-1',
    platform: Platform.x,
    topic: 'Breaking: Tech Industry Layoffs 2026',
    hashtags: ['#TechNews', '#TechLayoffs', '#SiliconValley', '#TechIndustry', '#CareerAdvice'],
    keywords: ['tech layoffs', 'job market', 'tech industry', 'career tips', 'employment news'],
    timestamp: BigInt(Date.now() - 39600000),
    metrics: {
      views: 5200000n,
      likes: 285000n,
      shares: 195000n,
      comments: 78000n,
    },
  },
  {
    id: 'topic-x-2',
    platform: Platform.x,
    topic: 'Climate Change: Latest Research Findings',
    hashtags: ['#ClimateChange', '#Environment', '#Sustainability', '#GreenEnergy', '#ClimateAction'],
    keywords: ['climate change', 'environmental news', 'sustainability', 'green technology', 'climate research'],
    timestamp: BigInt(Date.now() - 43200000),
    metrics: {
      views: 4800000n,
      likes: 325000n,
      shares: 215000n,
      comments: 92000n,
    },
  },
  {
    id: 'topic-x-3',
    platform: Platform.x,
    topic: 'Stock Market Rally: What Investors Need to Know',
    hashtags: ['#StockMarket', '#Investing', '#Finance', '#WallStreet', '#MarketNews'],
    keywords: ['stock market', 'investment tips', 'market analysis', 'trading strategy', 'financial news'],
    timestamp: BigInt(Date.now() - 46800000),
    metrics: {
      views: 3900000n,
      likes: 245000n,
      shares: 165000n,
      comments: 68000n,
    },
  },
  {
    id: 'topic-x-4',
    platform: Platform.x,
    topic: 'Space Exploration: New Mars Mission Details',
    hashtags: ['#Space', '#Mars', '#NASA', '#SpaceExploration', '#Science'],
    keywords: ['space exploration', 'mars mission', 'nasa news', 'space technology', 'astronomy'],
    timestamp: BigInt(Date.now() - 50400000),
    metrics: {
      views: 4500000n,
      likes: 385000n,
      shares: 225000n,
      comments: 85000n,
    },
  },
  {
    id: 'topic-x-5',
    platform: Platform.x,
    topic: 'AI Ethics Debate: Regulation vs Innovation',
    hashtags: ['#AIEthics', '#TechPolicy', '#Innovation', '#Regulation', '#FutureTech'],
    keywords: ['ai ethics', 'tech regulation', 'ai policy', 'innovation debate', 'technology governance'],
    timestamp: BigInt(Date.now() - 54000000),
    metrics: {
      views: 3700000n,
      likes: 295000n,
      shares: 185000n,
      comments: 72000n,
    },
  },

  // Google Trends Topics (General Trending)
  {
    id: 'topic-gt-1',
    platform: Platform.googleTrends,
    topic: 'How to Start a Side Hustle in 2026',
    hashtags: ['#SideHustle', '#Entrepreneurship', '#PassiveIncome', '#BusinessTips', '#MakeMoneyOnline'],
    keywords: ['side hustle ideas', 'make money online', 'passive income', 'business startup', 'entrepreneur tips'],
    timestamp: BigInt(Date.now() - 57600000),
    metrics: {
      views: 6200000n,
      likes: 485000n,
      shares: 265000n,
      comments: 95000n,
    },
  },
  {
    id: 'topic-gt-2',
    platform: Platform.googleTrends,
    topic: 'Mental Health Awareness: Self-Care Tips',
    hashtags: ['#MentalHealth', '#SelfCare', '#Wellness', '#MentalHealthAwareness', '#Mindfulness'],
    keywords: ['mental health', 'self care tips', 'wellness guide', 'stress management', 'mindfulness practices'],
    timestamp: BigInt(Date.now() - 61200000),
    metrics: {
      views: 5800000n,
      likes: 525000n,
      shares: 285000n,
      comments: 102000n,
    },
  },
  {
    id: 'topic-gt-3',
    platform: Platform.googleTrends,
    topic: 'Electric Vehicles: Complete Buying Guide',
    hashtags: ['#ElectricVehicles', '#EV', '#GreenTech', '#SustainableTransport', '#FutureCars'],
    keywords: ['electric vehicles', 'ev buying guide', 'electric cars', 'sustainable transport', 'green technology'],
    timestamp: BigInt(Date.now() - 64800000),
    metrics: {
      views: 4900000n,
      likes: 395000n,
      shares: 215000n,
      comments: 78000n,
    },
  },
  {
    id: 'topic-gt-4',
    platform: Platform.googleTrends,
    topic: 'Remote Work Best Practices 2026',
    hashtags: ['#RemoteWork', '#WorkFromHome', '#Productivity', '#DigitalNomad', '#FutureOfWork'],
    keywords: ['remote work tips', 'work from home', 'productivity hacks', 'digital nomad', 'remote career'],
    timestamp: BigInt(Date.now() - 68400000),
    metrics: {
      views: 5500000n,
      likes: 445000n,
      shares: 245000n,
      comments: 88000n,
    },
  },
  {
    id: 'topic-gt-5',
    platform: Platform.googleTrends,
    topic: 'Personal Finance: Budgeting for Beginners',
    hashtags: ['#PersonalFinance', '#Budgeting', '#MoneyTips', '#FinancialFreedom', '#SaveMoney'],
    keywords: ['personal finance', 'budgeting tips', 'money management', 'financial planning', 'save money'],
    timestamp: BigInt(Date.now() - 72000000),
    metrics: {
      views: 5100000n,
      likes: 425000n,
      shares: 235000n,
      comments: 82000n,
    },
  },
];

export default function TrendingPage() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<'engagement' | 'recent'>('engagement');

  const filteredAndSortedTopics = useMemo(() => {
    let topics = MOCK_TRENDING_TOPICS;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      topics = topics.filter((t) => t.platform === selectedPlatform);
    }

    // Sort
    if (sortBy === 'engagement') {
      topics = [...topics].sort((a, b) => {
        const aScore = Number(a.metrics.likes + a.metrics.shares + a.metrics.comments + a.metrics.views);
        const bScore = Number(b.metrics.likes + b.metrics.shares + b.metrics.comments + b.metrics.views);
        return bScore - aScore;
      });
    } else {
      topics = [...topics].sort((a, b) => Number(b.timestamp - a.timestamp));
    }

    return topics;
  }, [selectedPlatform, sortBy]);

  const handleTopicSelect = (topicId: string) => {
    const topic = MOCK_TRENDING_TOPICS.find((t) => t.id === topicId);
    if (!topic) return;

    // Navigate with complete topic data as URL search parameters
    navigate({
      to: '/configure/$topicId',
      params: { topicId: topic.id },
      search: {
        topic: topic.topic,
        hashtags: topic.hashtags.join(','),
        keywords: topic.keywords.join(','),
        platform: topic.platform,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Trending Topics</h1>
        </div>
        <p className="text-muted-foreground">
          Discover what's trending across platforms and create viral content instantly
        </p>
      </div>

      <Tabs value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as Platform | 'all')} className="mb-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={Platform.youtube}>YouTube</TabsTrigger>
          <TabsTrigger value={Platform.instagram}>Instagram</TabsTrigger>
          <TabsTrigger value={Platform.x}>X</TabsTrigger>
          <TabsTrigger value={Platform.googleTrends}>Google</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-4 mb-6">
        <Card className="flex-1">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('engagement')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    sortBy === 'engagement'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Engagement
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    sortBy === 'recent'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTopics.map((topic) => (
          <TrendingTopicCard key={topic.id} topic={topic} onSelect={handleTopicSelect} />
        ))}
      </div>

      {filteredAndSortedTopics.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No trending topics found for this platform</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
