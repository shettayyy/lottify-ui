'use client';
import { useQuery } from '@apollo/client';
import { useCallback } from 'react';

import { LottieCard } from '@/libs/components/app-specific/lottie-card';
import CircularLoader from '@/libs/components/core/circular-loader';
import { InfiniteScroll } from '@/libs/components/core/infinite-scroll';
import { GET_LOTTIES } from '@/libs/graphql/queries/lottie';
import { GetLottieParams, GetLotties } from '@/libs/types/lottie';

export const LottieList = () => {
  const { data, loading, fetchMore } = useQuery<GetLotties, GetLottieParams>(
    GET_LOTTIES,
  );

  const handleIntersect = useCallback(() => {
    if (!loading && data?.lotties?.metadata?.pagination?.nextPage) {
      fetchMore({
        variables: {
          input: {
            page: data.lotties.metadata.pagination.nextPage,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            lotties: {
              ...fetchMoreResult.lotties,
              result: [
                ...(prev.lotties?.result ?? []),
                ...fetchMoreResult.lotties.result,
              ],
            },
          };
        },
      });
    }
  }, [data, fetchMore, loading]);

  if (loading) {
    // Show loading placeholder cards
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <LottieCard key={index} loading />
        ))}
      </div>
    );
  }

  if (!data?.lotties?.result?.length) {
    return <p>No lotties found!</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.lotties.result.map(lottie => (
          <LottieCard key={lottie._id} lottie={lottie} />
        ))}
      </div>

      {!!(loading && data) && <CircularLoader className="py-4" />}

      <InfiniteScroll onIntersect={handleIntersect} />
    </>
  );
};
