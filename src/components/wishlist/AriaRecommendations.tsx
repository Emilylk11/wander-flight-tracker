import { Card, CardPad, CardHeader } from '@/components/ui/Card';

const recommendations = [
  {
    title: 'Combine Kyoto + Maldives into one trip',
    description:
      'Flying TUL → NRT → MLE as one itinerary saves ~$420 vs. two separate trips. Best window is Jan 10–28, 2027.',
  },
  {
    title: 'Patagonia prices hit a 2-year low',
    description:
      'TUL → SCL dropped to $1,120 — lowest since March 2022. This window typically closes within 5 days.',
  },
];

export default function AriaRecommendations() {
  return (
    <Card>
      <CardPad>
        <CardHeader
          title="ARIA's recommendations — based on your wishlist"
          action="Refresh →"
        />
        <div className="flex flex-col gap-2.5">
          {recommendations.map((rec) => (
            <div
              key={rec.title}
              className="flex items-start gap-3 p-3 bg-cream rounded-[10px]"
            >
              <div className="text-lg flex-shrink-0">✦</div>
              <div>
                <div className="text-[13px] font-medium text-wtext mb-[3px]">
                  {rec.title}
                </div>
                <div className="text-xs text-wtext-2 leading-relaxed">
                  {rec.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardPad>
    </Card>
  );
}
