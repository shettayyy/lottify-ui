import UploadProgressMenu from '@/libs/components/app-specific/upload-progress-menu';
import SectionHeader from '@/libs/components/layout/section-header';
import { LottieList } from '@/libs/containers/lottie-list/lottie-list';
import { UploadAnimation } from '@/libs/containers/upload-animation/upload-animation';

export default function Home() {
  return (
    <main className="container m-auto p-4 sm:px-2">
      <SectionHeader title="Discover" endAdornment={<UploadAnimation />} />

      {/* Render the lottie list */}
      <LottieList />

      {/* Render the upload progress menu */}
      <UploadProgressMenu />
    </main>
  );
}
