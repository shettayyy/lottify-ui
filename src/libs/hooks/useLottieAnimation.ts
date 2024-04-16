import Axios from 'axios';
import { LottieOptions } from 'lottie-react';
import { useCallback, useEffect, useState } from 'react';

import { Lottie } from '@/libs/types/lottie';

type UseLottieAnimationReturnType = {
  animationData: LottieOptions['animationData'];
  loading: boolean;
};

export const useLottieAnimation = (lottie: Lottie | undefined) => {
  const [animationData, setAnimationData] =
    useState<LottieOptions['animationData']>(null);
  const [loading, setLoading] = useState(false);

  const loadAnimation = useCallback(async () => {
    if (!lottie?.url) return;

    setLoading(true);

    try {
      // clear params from url
      const url = lottie.url.split('?')[0];
      const { data } = await Axios.get(url, {
        responseType: 'json',
      });
      setAnimationData(data);
    } catch (error) {
      console.error('Error loading Lottie animation:', error);
    } finally {
      setLoading(false);
    }
  }, [lottie?.url]);

  useEffect(() => {
    loadAnimation();
  }, [loadAnimation]);

  return { animationData, loading } as UseLottieAnimationReturnType;
};
