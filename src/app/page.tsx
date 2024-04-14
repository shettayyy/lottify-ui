import SectionHeader from '@/components/layout/section-header';

export default function Home() {
  return (
    <main className="container m-auto p-4 sm:px-2">
      <SectionHeader title="Discover" />

      {/* Render a list of 100 items to scroll */}
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 100 }, (_, i) => (
          <li key={i} className="bg-gray-100 p-4">
            Item {i + 1}
          </li>
        ))}
      </ul>
    </main>
  );
}
