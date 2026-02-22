import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Sparkles, Zap, TrendingUp, Globe, Wand2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="AI Video Maker"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Create Viral Videos in Seconds
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered video creation from trending topics. Generate engaging short-form content for YouTube Shorts,
            Instagram Reels, and TikTok automatically.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90"
            onClick={() => navigate({ to: '/trending' })}
          >
            <Video className="w-5 h-5 mr-2" />
            Create Video Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Trending Topics</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically fetch viral topics from YouTube, Instagram, X, and Google Trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Script Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate engaging 30-60 second scripts with hook lines in Hindi and English
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10">
                  <Wand2 className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Auto Video Creation</h3>
                  <p className="text-sm text-muted-foreground">
                    AI selects stock videos, music, animations, and adds animated subtitles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Video className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Multi-Format Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Export in 9:16 format for YouTube Shorts, Instagram Reels, and TikTok
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10">
                  <Zap className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">One-Click Export</h3>
                  <p className="text-sm text-muted-foreground">
                    HD export with optional watermark removal for premium users
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10">
                  <Globe className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Hindi + English</h3>
                  <p className="text-sm text-muted-foreground">
                    Full support for bilingual content creation with AI voiceover
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Go Viral?</h2>
          <p className="text-muted-foreground">Join thousands of creators making trending videos with AI</p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate({ to: '/trending' })}
          >
            Start Creating Free
          </Button>
        </div>
      </div>
    </div>
  );
}
