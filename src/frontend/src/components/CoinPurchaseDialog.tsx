import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Check } from 'lucide-react';
import { useAddCoins, useGetUserAccount } from '../hooks/useUserAccount';

interface CoinPurchaseDialogProps {
  onClose: () => void;
}

const coinPackages = [
  { amount: 100, price: '$4.99', popular: false },
  { amount: 500, price: '$19.99', popular: true },
  { amount: 1000, price: '$34.99', popular: false },
];

export default function CoinPurchaseDialog({ onClose }: CoinPurchaseDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(coinPackages[1]);
  const addCoins = useAddCoins();
  const { data: userAccount } = useGetUserAccount();

  const handlePurchase = async () => {
    try {
      await addCoins.mutateAsync(selectedPackage.amount);
      onClose();
    } catch (error) {
      console.error('Coin purchase error:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Purchase Coins
          </DialogTitle>
          <DialogDescription>
            Current balance: <span className="font-semibold">{userAccount?.coins || 0} coins</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3">
            {coinPackages.map((pkg) => (
              <Card
                key={pkg.amount}
                className={`cursor-pointer transition-all ${
                  selectedPackage.amount === pkg.amount
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage.amount === pkg.amount ? 'border-primary bg-primary' : 'border-muted'
                      }`}>
                        {selectedPackage.amount === pkg.amount && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-semibold">{pkg.amount} Coins</p>
                        <p className="text-sm text-muted-foreground">{pkg.price}</p>
                      </div>
                    </div>
                    {pkg.popular && <Badge>Popular</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            size="lg"
            onClick={handlePurchase}
            disabled={addCoins.isPending}
            className="w-full"
          >
            {addCoins.isPending ? 'Processing...' : `Purchase ${selectedPackage.amount} Coins for ${selectedPackage.price}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
