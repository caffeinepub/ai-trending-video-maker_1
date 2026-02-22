import { useNavigate } from '@tanstack/react-router';
import { useGetUserAccount, useUpgradeToPremium } from '../hooks/useUserAccount';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetCallerVideoProjects } from '../hooks/useVideoProject';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Coins, Video, Calendar, Sparkles } from 'lucide-react';
import { SubscriptionTier, VideoStatus } from '../backend';
import SubscriptionCard from '../components/SubscriptionCard';
import CoinPurchaseDialog from '../components/CoinPurchaseDialog';
import { useState } from 'react';

export default function UserAccountPage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userAccount, isLoading: accountLoading } = useGetUserAccount();
  const { data: videoProjects, isLoading: projectsLoading } = useGetCallerVideoProjects();
  const [showCoinDialog, setShowCoinDialog] = useState(false);

  const isPremium = userProfile?.tier === SubscriptionTier.premium;

  if (accountLoading || projectsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your subscription, coins, and video projects</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className={isPremium ? 'border-primary/50 bg-primary/5' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className={`w-5 h-5 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant={isPremium ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                  {isPremium ? 'Premium' : 'Free'}
                </Badge>
              </div>
              {userAccount && (
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(Number(userAccount.created) / 1000000).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Coin Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-3xl font-bold">{userAccount?.coins || 0}</p>
              <Button size="sm" variant="outline" onClick={() => setShowCoinDialog(true)} className="w-full">
                Purchase Coins
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Videos Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{videoProjects?.length || 0}</p>
            <p className="text-sm text-muted-foreground mt-2">Total projects</p>
          </CardContent>
        </Card>
      </div>

      {!isPremium && <SubscriptionCard />}

      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-bold mb-4">Video Projects</h2>
        {videoProjects && videoProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {videoProjects.map((project) => (
              <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/editor/$projectId', params: { projectId: project.id } })}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant={project.status === VideoStatus.completed ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(Number(project.created) / 1000000).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{project.format}</span>
                    <span className="text-muted-foreground">{Number(project.script.duration)}s</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No video projects yet</p>
              <Button onClick={() => navigate({ to: '/trending' })}>
                Create Your First Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showCoinDialog && <CoinPurchaseDialog onClose={() => setShowCoinDialog(false)} />}
    </div>
  );
}
