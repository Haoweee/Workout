import { CTA } from '@/features/marketing/homepage/cta';
import { Features } from '@/features/marketing/homepage/features';
import { Header } from '@/features/marketing/homepage/header';
import { ProblemSolution } from '@/features/marketing/homepage/problem-solution';

import { useGuestAuth } from '@/context/GuestContext';

const HomePage = () => {
  const { user } = useGuestAuth();
  return (
    <div className="space-y-28">
      <Header user={user} />
      <ProblemSolution />
      <Features />
      <CTA user={user} />
    </div>
  );
};

export default HomePage;
