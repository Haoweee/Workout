import { RecommendedTopics } from '@/features/marketing/support/recommendedTopics';
import { FAQs } from '@/features/marketing/support/faq';

export const HelpCenterPage = () => {
  return (
    <div className="max-w-[1000px] mx-auto space-y-12 py-8">
      <RecommendedTopics />
      <FAQs />
    </div>
  );
};
