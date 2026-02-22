import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';
import { useUpgradeToPremium } from '../hooks/useUserAccount';

export default function SubscriptionCard() {
  const upgradeToPremium = useUpgradeToPremium();

  const handleUpgrade = async () => {
    try {
      await upgradeToPremium.mutateAsync();
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-emerald-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Upgrade to Premium
          </CardTitle>
          <Badge className="bg-primary">Best Value</Badge>
        </div>
        <CardDescription>Unlock all features and remove watermarks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold">Premium Features:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Watermark-free exports</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Unlimited video renders</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Priority AI processing</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Additional Benefits:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>HD+ quality exports</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Advanced templates</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>
        <Button
          size="lg"
          onClick={handleUpgrade}
          disabled={upgradeToPremium.isPending}
          className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90"
        >
          {upgradeToPremium.isPending ? 'Upgrading...' : 'Upgrade Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
