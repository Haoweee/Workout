import { CTA } from '@/features/marketing/homepage/cta';
import { Features } from '@/features/marketing/homepage/features';
import { Header } from '@/features/marketing/homepage/header';
import { ProblemSolution } from '@/features/marketing/homepage/problem-solution';

import { useAuth } from '@/hooks/auth';

export const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-28">
      <Header user={user} />
      <ProblemSolution />
      <Features />
      <CTA user={user} />
    </div>
  );
};
