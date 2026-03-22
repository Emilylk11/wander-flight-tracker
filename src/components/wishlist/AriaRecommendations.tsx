import { Card, CardPad, CardHeader } from '@/components/ui/Card';

export default function AriaRecommendations() {
  return (
    <Card>
      <CardPad>
        <CardHeader title="✦ ARIA Recommendations" />
        <div className="text-center py-6">
          <div className="text-2xl mb-2">✦</div>
          <div className="text-xs text-wtext-3 max-w-[280px] mx-auto">
            Add destinations to your wishlist and ARIA will suggest smart trip combinations to save money and time.
          </div>
        </div>
      </CardPad>
    </Card>
  );
}
