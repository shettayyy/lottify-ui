'use client';
import { useQuery } from '@apollo/client';

import { LottieCard } from '@/libs/components/app-specific/lottie-card';
import { GET_LOTTIES } from '@/libs/graphql/queries/lottie';
import { GetLottieParams, GetLotties } from '@/libs/types/lottie';

export const LottieList = () => {
  const { data, loading, error } = useQuery<GetLotties, GetLottieParams>(
    GET_LOTTIES,
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data?.lotties?.result?.length) {
    return <p>No lotties found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.lotties.result.map(lottie => (
        <LottieCard key={lottie._id} lottie={lottie} />
      ))}
    </div>
  );
};
