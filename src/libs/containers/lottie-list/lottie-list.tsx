'use client';
import { useQuery } from '@apollo/client';
import { FC, useCallback } from 'react';

import { LottieCard } from '@/libs/components/app-specific/lottie-card';
import NotFound from '@/libs/components/app-specific/not-found';
import CircularLoader from '@/libs/components/core/circular-loader';
import { InfiniteScroll } from '@/libs/components/core/infinite-scroll';
import { GET_LOTTIES } from '@/libs/graphql/queries/lottie';
import { GetLottieParams, GetLotties } from '@/libs/types/lottie';
import { showToast } from '@/libs/utils/toast';

type LottieListProps = {
  search?: string;
};

export const LottieList: FC<LottieListProps> = ({ search = '' }) => {
  const { data, loading, fetchMore } = useQuery<GetLotties, GetLottieParams>(
    GET_LOTTIES,
    {
      variables: {
        input: {
          search,
          page: 1,
          limit: 40,
        },
      },
      notifyOnNetworkStatusChange: true,
      onError(error) {
        showToast('error', error.message);
      },
    },
  );

  const handleIntersect = useCallback(() => {
    if (!loading && data?.lotties?.metadata?.pagination?.nextPage) {
      fetchMore({
        variables: {
          input: {
            search,
            page: data.lotties.metadata.pagination.nextPage,
            limit: 40,
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
  }, [data?.lotties.metadata.pagination.nextPage, fetchMore, loading, search]);

  if (loading && !data) {
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
    return (
      <NotFound
        title="No Lotties Found"
        description="Try searching for something else"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.lotties.result.map(lottie => (
          <LottieCard key={lottie._id} lottie={lottie} />
        ))}
      </div>

      {loading && <CircularLoader size={56} className="py-4" />}

      <InfiniteScroll onIntersect={handleIntersect} />
    </>
  );
};
