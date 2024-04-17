'use client';
import { useState } from 'react';

import { Search } from '@/libs/components/core/search';
import { LottieList } from '@/libs/containers/lottie-list/lottie-list';
import { useDebounce } from '@/libs/hooks/useDebounce';

export default function Home() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  return (
    <main className="container m-auto p-4 sm:px-2">
      <div className="mb-4 mt-2 flex flex-col gap-4 md:flex-row md:justify-between">
        <h1 className="text-center font-quicksand text-3xl font-bold uppercase tracking-widest text-slate-100">
          Discover
        </h1>

        <Search
          className="w-full justify-end md:w-4/5"
          inputClassName="w-full"
          placeholder="Search for a lottie..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Render the lottie list */}
      <LottieList search={debouncedSearch} />
    </main>
  );
}
